
import Groq from "groq-sdk";
import { extractText } from "unpdf";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import {
  createCanvas,
  DOMMatrix,
  ImageData,
  Path2D,
} from "@napi-rs/canvas";

export const runtime = "nodejs";

// Add canvas polyfills for PDF rendering in Node.js.
const nodeGlobals = globalThis as any;

nodeGlobals.DOMMatrix ??= DOMMatrix;
nodeGlobals.ImageData ??= ImageData;
nodeGlobals.Path2D ??= Path2D;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const summaryInstructions = `
You are ARCA, an AI Rural Citizen Assistant.

Read the document and return valid JSON with exactly these fields:
{
  "originalLanguage": "detected language",
  "originalSummary": "summary in the document's language",
  "englishSummary": "English summary",
  "hindiSummary": "Hindi summary"
}

Rules:
- Detect the original language.
- Use simple language suitable for rural citizens.
- Include purpose, eligibility, benefits, amounts, dates,
  required documents and application instructions when available.
- Preserve names, numbers, dates and amounts accurately.
- Never invent facts or claim a fictional scheme is real.
- Keep all three summaries consistent with the document.
- Return JSON only.
`;

function createResponse(result: any) {
  if (
    !result.originalSummary ||
    !result.englishSummary ||
    !result.hindiSummary
  ) {
    throw new Error(
      "The AI did not return all three summaries. Please try again."
    );
  }

  return Response.json({
    summary: result.originalSummary,
    originalLanguage: result.originalLanguage || "Unknown",
    originalSummary: result.originalSummary,
    englishSummary: result.englishSummary,
    hindiSummary: result.hindiSummary,
  });
}

// OCR for scanned PDFs.
async function readScannedPdf(pdfBuffer: Uint8Array) {
  const loadingTask = pdfjsLib.getDocument({
  data: pdfBuffer,
  useSystemFonts: true,
  isEvalSupported: false,
});
  const pdf = await loadingTask.promise;

  try {
    if (pdf.numPages > 10) {
      throw new Error(
        "This scanned PDF has more than 10 pages. Please upload a PDF with 10 pages or fewer."
      );
    }

    let completeText = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = createCanvas(
        Math.ceil(viewport.width),
        Math.ceil(viewport.height)
      );

      const context = canvas.getContext("2d");

      // PDF.js renders into the Node canvas context.
      const renderTask = page.render({
        canvasContext: context as any,
        viewport,
      });

      await renderTask.promise;

      const imageBuffer = canvas.toBuffer("image/png");
      const base64Image = imageBuffer.toString("base64");

      const completion = await groq.chat.completions.create({
        model: "qwen/qwen3.8-27b",
        messages: [
          {
            role: "system",
            content:
              "You are an OCR assistant. Transcribe all readable text from the supplied document page. Preserve the original language, script, numbers, dates, names and headings. Do not summarize or translate. Never invent text. Mark unreadable text as [unreadable].",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Transcribe page ${pageNumber} accurately, keeping its original language.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
      });

      completeText +=
        `\n--- Page ${pageNumber} ---\n` +
        (completion.choices[0].message.content || "");

      page.cleanup();
    }

    if (!completeText.trim()) {
      throw new Error(
        "No readable text was detected. Please upload a clearer scan."
      );
    }

    return completeText;
  } finally {
    await pdf.destroy();
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "Please upload a document." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
    ];

    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "Please upload a PDF, PNG, or JPG file." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json(
        { error: "File size must be less than 10 MB." },
        { status: 400 }
      );
    }

    // JPG and PNG document analysis.
    if (file.type === "image/png" || file.type === "image/jpeg") {
      const imageBuffer = Buffer.from(await file.arrayBuffer());

      const completion = await groq.chat.completions.create({
        model: "qwen/qwen3.8-27b",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: summaryInstructions,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Read this document image carefully and summarize its actual contents.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${file.type};base64,${imageBuffer.toString("base64")}`,
                },
              },
            ],
          },
        ],
      });

      return createResponse(
        JSON.parse(completion.choices[0].message.content || "{}")
      );
    }

    // First try extracting selectable text from a PDF.
    const pdfBuffer = new Uint8Array(await file.arrayBuffer());

    const pdfResult = await extractText(pdfBuffer, {
      mergePages: true,
    });

    let documentText = Array.isArray(pdfResult.text)
      ? pdfResult.text.join("\n")
      : pdfResult.text;

    documentText = (documentText || "").trim();

    // Scanned PDF: extract text from rendered page images using OCR.
    if (!documentText) {
      documentText = await readScannedPdf(pdfBuffer);
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: summaryInstructions,
        },
        {
          role: "user",
          content: documentText.slice(0, 20000),
        },
      ],
    });

    return createResponse(
      JSON.parse(completion.choices[0].message.content || "{}")
    );
  } catch (error) {
    console.error("Document analysis error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Document analysis failed.",
      },
      { status: 500 }
    );
  }
}
