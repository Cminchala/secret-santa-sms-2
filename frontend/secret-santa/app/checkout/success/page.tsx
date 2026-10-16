"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FestiveNavbar } from "@/components/christmas/festive-navbar";
import { Snowfall } from "@/components/christmas/snowfall";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    async function triggerSendMSG() {
      const stored = sessionStorage.getItem("secret_santa_participants");
      if (!stored) {
        setStatus("error");
        setErrorMessage(
          "No pending participant list found in session storage. If you already submitted or refreshed the page, the elves may have already been drawn!"
        );
        return;
      }

      try {
        const participants = JSON.parse(stored);

        // Call backend FastAPI endpoint /SendMSG
        const res = await fetch(`${API_URL}/SendMSG`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(participants),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Backend responded with status ${res.status}`);
        }

        // Successfully drawn and sent
        sessionStorage.removeItem("secret_santa_participants");
        setStatus("success");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to contact backend.";
        setStatus("error");
        setErrorMessage(msg);
      }
    }

    triggerSendMSG();
  }, [sessionId]);

  return (
    <div className="relative z-10 flex min-h-[75vh] flex-col items-center justify-center px-4 py-12">
      <div className="festive-card w-full max-w-lg rounded-3xl p-8 text-center shadow-2xl">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="text-5xl animate-bounce">🎁</div>
            <h2 className="festive-title text-3xl text-emerald-800">
              Payment Successful!
            </h2>
            <p className="text-stone-700">
              Connecting with Santa&apos;s workshop to draw names and notify participants via <code className="bg-emerald-50 px-1 py-0.5 rounded text-emerald-700 font-mono">/SendMSG</code>...
            </p>
            <div className="flex justify-center pt-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-5">
            <div className="text-6xl sway">🎅🎉</div>
            <h2 className="festive-title text-4xl text-emerald-700">
              Ho Ho Ho! It&apos;s Official!
            </h2>
            <p className="text-base text-stone-700">
              Payment confirmed and <strong className="text-emerald-800">/SendMSG</strong> was called successfully! Everyone has been matched for the Secret Santa gift exchange.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="submit-btn inline-block rounded-full px-8 py-3 font-bold text-white transition hover:scale-105"
              >
                🎄 Back to Secret Santa
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="text-5xl">⚠️</div>
            <h2 className="festive-title text-3xl text-red-700">
              Payment Succeeded, But...
            </h2>
            <p className="text-sm text-red-800 bg-red-100 rounded-lg p-3">
              {errorMessage}
            </p>
            <p className="text-xs text-stone-600">
              Make sure your FastAPI backend is running at <span className="font-mono">{API_URL}</span>.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-block rounded-full bg-red-700 px-6 py-2.5 font-bold text-white hover:bg-red-800"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="festive-bg relative min-h-screen overflow-x-hidden">
      <Snowfall />
      <FestiveNavbar />
      <Suspense fallback={<div className="text-center text-white p-12">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}

