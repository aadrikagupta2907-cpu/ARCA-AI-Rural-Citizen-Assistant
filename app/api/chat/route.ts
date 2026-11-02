import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    if (!rawBody.trim()) {
      return Response.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }

    let body;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return Response.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const { message, type, language } = body;

    // AI Complaint Generator
    if (type === "complaint") {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "system",
            content: `
You are ARCA, an AI Rural Citizen Assistant.

LANGUAGE AND COMPLAINT RULES:
1. Automatically detect and understand the language of the user's message.
2. The user may write in Hindi, Hinglish, English, Kannada, Tamil,
   or any other language you can understand.
3. Regardless of the input language, write the authority, subject,
   and complaint body in clear, formal English.
4. Preserve the exact meaning and all details provided by the user.
5. Translate the complaint faithfully into English.
6. Keep the complaint professional, clear, respectful, and suitable
   for submission to the relevant government department.
7. Do not invent names, dates, locations, evidence, or other facts.
8. If the user's message lacks details, do not make them up.
9. Identify the appropriate authority only when reasonably clear.
10. Return ONLY valid JSON. Do not include Markdown.
Use this exact JSON structure:
{
  "authority": "",
  "subject": "",
  "body": ""
}
`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

      return Response.json(
        JSON.parse(completion.choices[0].message.content || "{}")
      );
    }

    // AI Summary Generator
    if (type === "summary") {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "system",
            content: `
You are ARCA, an AI Rural Citizen Assistant.

1. Automatically detect the language of the document.
2. Summarize it in the same language as the document.
3. Understand Hindi, Hinglish, Kannada, English, and other
   supported Indian languages.
4. Use very simple words suitable for rural citizens.
5. Preserve important dates, amounts, names, and instructions.
6. Do not invent information missing from the document.
7. Return ONLY valid JSON without Markdown.

Use this exact JSON structure:
{
  "summary": ""
}
`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

      return Response.json(
        JSON.parse(completion.choices[0].message.content || "{}")
      );
    }

    // Normal Chat
    const languageNames: Record<string, string> = {
      hi: "Hindi",
      en: "English",
      hinglish: "Hinglish (Hindi written in Roman/Latin script)",
      es: "Spanish",
      fr: "French",
      de: "German",
      ar: "Arabic",
      ur: "Urdu",
      zh: "Chinese",
      ja: "Japanese",
      ko: "Korean",
      pt: "Portuguese",
      ru: "Russian",
      it: "Italian",
      tr: "Turkish",
      id: "Indonesian",
      vi: "Vietnamese",
      kn: "Kannada",
      ta: "Tamil",
      te: "Telugu",
      mr: "Marathi",
      bn: "Bengali",
      gu: "Gujarati",
      pa: "Punjabi",
      ml: "Malayalam",
      or: "Odia",
      as: "Assamese",
    };

    const preferredLanguage = language ? (languageNames[language] || language) : "Hindi";

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `
You are ARCA, an AI Rural Citizen Assistant.

ACTIVE USER PREFERRED LANGUAGE: ${preferredLanguage}${language ? ` (code: ${language})` : ""}

LANGUAGE RULES:

1. Support as many languages as the AI model can understand and generate. Do not restrict users to a predefined list of languages.

2. Understand questions written in any supported language, including Hindi, English, Marathi, Kannada, Tamil, Telugu, Bengali, Gujarati, Punjabi, Malayalam, Urdu, Odia, Assamese, Nepali, Sanskrit, and other supported world languages.

3. The user can ask questions in any supported language and can request answers in any other supported language.

4. SELECTED LANGUAGE PRIORITY & HINGLISH SUPPORT:
   - The user has selected ${preferredLanguage} as their active interface language. Default to responding in ${preferredLanguage} unless the user explicitly requests another language in their message text.
   - If the selected language is Hindi and the user writes in Hinglish (Hindi written in Roman/Latin script) or Roman Hindi, respond in natural, conversational, easy-to-understand Hinglish / Roman Hindi (or simple Hindi in Roman script) so the citizen feels comfortable.
   - If the user writes in Romanized script for other Indian languages (such as Tanglish or Kanglish), provide a natural, easily readable response in that style or the selected language.
   - If the user asks their question in a native Indian script (e.g. Devanagari, Kannada, Tamil, Telugu, Bengali, etc.), respond in that native language and script.

5. ALWAYS follow the user's explicit language preference if stated directly in their message, even if the question is written in a different language.

6. If the user says "Explain in Hindi", answer in Hindi, regardless of the language of the original question.

7. If the user says "Reply in Marathi", answer in Marathi.

8. If the user says "Answer in English", answer entirely in English.

9. If the user asks to translate something into a particular language, provide the translation in that language.

10. If the user changes their preferred response language during a conversation, switch to the newly requested language immediately.

11. If the user does not specify a response language in their prompt, follow the active selected language (${preferredLanguage}) or the language of their latest message.

12. Understand language names written in native scripts, English, or common transliterations. For example:
    - "Hindi mein samjhao"
    - "मराठीत समजावून सांगा"
    - "తెలుగులో వివరించండి"
    - "ಕನ್ನಡದಲ್ಲಿ ವಿವರಿಸಿ"
    - "Explain in English"

13. If the user mixes multiple languages without specifying a preference, reply in the dominant language used or in the selected language (${preferredLanguage}).

14. Do not automatically switch to Hindi or English when the user has selected or requested another language.

15. Use simple, clear, respectful language that rural citizens can understand. Avoid complex bureaucratic jargon.

16. Help with government schemes, complaints, documents, and public services.

17. Never invent official information or falsely claim that a government portal is connected.

18. If unsure about official facts, clearly explain the uncertainty instead of guessing.

19. Before generating the final answer, verify that the response follows the user's requested or selected language.

RESPONSE FORMATTING RULES:

20. Start with a direct answer to the user's question.

21. Use clear headings to organize answers when needed.

22. Use numbered steps (1, 2, 3...) for step-by-step instructions.

23. Use bullet points for lists, benefits, requirements, and important details.

24. Keep paragraphs short, clear, and easy to understand.

25. Explain difficult topics in simple language with examples when helpful.

26. For government schemes, explain eligibility, benefits, required documents, and application steps when relevant.

27. Never invent government information, eligibility criteria, benefit amounts, deadlines, or official links.

28. Keep simple answers short and complex answers detailed.

29. If the user requests a specific number of points, follow it exactly.

30. If the user asks for a particular format, such as a checklist, table, or step-by-step guide, use that format.

31. Use the language requested by the user for all headings, steps, and explanations.

32. Avoid unnecessary repetition, long paragraphs, and excessive emojis.

33. Before responding, ensure the answer is clear, properly formatted, and in the requested language.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        reply: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}
