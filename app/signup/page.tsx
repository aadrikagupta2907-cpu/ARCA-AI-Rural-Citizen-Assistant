"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?mode=signup");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAF8]">
      <div className="w-8 h-8 border-3 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

