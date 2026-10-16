"use client";

import { useState } from "react";
import { ChristmasLightsFrame } from "./christmas-lights";

type Participant = {
  id: number;
  name: string;
  phoneNum: string;
  wishlist: string; // comma-separated in the UI, sent to the backend as a list
};

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

let nextId = 1;
const emptyRow = (): Participant => ({ id: nextId++, name: "", phoneNum: "", wishlist: "" });

export function SecretSantaForm() {
  const [rows, setRows] = useState<Participant[]>(() => [emptyRow(), emptyRow(), emptyRow()]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const updateRow = (id: number, field: keyof Omit<Participant, "id">, value: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (id: number) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filled = rows.filter((r) => r.name.trim() || r.phoneNum.trim());
    if (filled.length < 3) {
      setStatus({ kind: "error", message: "You need at least 3 elves 🧝 to draw names!" });
      return;
    }
    const names = filled.map((r) => r.name.trim().toLowerCase());
    if (new Set(names).size !== names.length) {
      setStatus({ kind: "error", message: "Every participant needs a unique name 🎄" });
      return;
    }

    const payload = filled.map((r) => ({
      name: r.name.trim(),
      phoneNum: r.phoneNum.replace(/[\s()-]/g, ""),
      wishlist: r.wishlist
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean),
    }));

    setStatus({ kind: "loading" });
    try {
      // Save participants to sessionStorage so we can trigger /SendMSG upon return from Stripe
      sessionStorage.setItem("secret_santa_participants", JSON.stringify(payload));

      // Call the FastAPI backend endpoint to create a Stripe checkout session
      const res = await fetch(`${API_URL}/create-checkout-session:8000`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants: payload }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to start checkout session.");
      }

      const data = await res.json();
      if (!data.url) {
        throw new Error("No checkout URL returned from backend.");
      }

      // Redirect user to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Something went wrong at the North Pole.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl">
      <ChristmasLightsFrame>
        <div className="festive-card rounded-2xl p-4 sm:p-6">
          <h2 className="festive-title mb-1 text-center text-3xl text-red-700 sm:text-4xl">
            Who&apos;s on the Nice List?
          </h2>
          <p className="mb-5 text-center text-sm text-emerald-900/80">
            Add everyone joining the gift exchange. Phone numbers should include the country code
            (e.g. <span className="font-mono">+15551234567</span>). Separate wishlist items with commas.
          </p>

          {/* Mobile Card Layout (visible on phones < 768px) */}
          <div className="space-y-4 md:hidden">
            {rows.map((row, i) => (
              <div
                key={row.id}
                className="festive-row relative rounded-xl border border-red-200 p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700 transition active:scale-95 disabled:opacity-30"
                    aria-label={`Remove participant ${i + 1}`}
                  >
                    ✖
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-red-800">
                      🧑 Name
                    </label>
                    <input
                      className="festive-input"
                      placeholder="Buddy the Elf"
                      value={row.name}
                      onChange={(e) => updateRow(row.id, "name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-red-800">
                      📱 Phone Number
                    </label>
                    <input
                      className="festive-input"
                      type="tel"
                      placeholder="+15551234567"
                      value={row.phoneNum}
                      onChange={(e) => updateRow(row.id, "phoneNum", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-red-800">
                      🎁 Wishlist (optional)
                    </label>
                    <input
                      className="festive-input"
                      placeholder="Socks, cocoa, a sled"
                      value={row.wishlist}
                      onChange={(e) => updateRow(row.id, "wishlist", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout (visible on screens >= 768px) */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-sm uppercase tracking-wider text-white">
                  <th className="rounded-l-lg bg-red-700 px-3 py-2">#</th>
                  <th className="bg-red-700 px-3 py-2">🧑 Name</th>
                  <th className="bg-red-700 px-3 py-2">📱 Phone Number</th>
                  <th className="bg-red-700 px-3 py-2">🎁 Wishlist</th>
                  <th className="rounded-r-lg bg-red-700 px-3 py-2">
                    <span className="sr-only">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id} className="festive-row">
                    <td className="rounded-l-lg px-3 py-2 text-center font-bold text-red-700">
                      {i + 1}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        className="festive-input"
                        placeholder="Buddy the Elf"
                        value={row.name}
                        onChange={(e) => updateRow(row.id, "name", e.target.value)}
                        required
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        className="festive-input"
                        type="tel"
                        placeholder="+15551234567"
                        value={row.phoneNum}
                        onChange={(e) => updateRow(row.id, "phoneNum", e.target.value)}
                        required
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        className="festive-input"
                        placeholder="Socks, cocoa, a sled"
                        value={row.wishlist}
                        onChange={(e) => updateRow(row.id, "wishlist", e.target.value)}
                      />
                    </td>
                    <td className="rounded-r-lg px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length <= 1}
                        className="rounded-full px-2 py-1 text-lg transition hover:scale-110 hover:bg-red-100 disabled:opacity-30"
                        aria-label={`Remove row ${i + 1}`}
                        title="Remove"
                      >
                        ✖
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={addRow}
              className="plus-btn flex h-12 w-12 items-center justify-center rounded-full text-3xl font-bold text-white"
              aria-label="Add another person"
              title="Add another person"
            >
              +
            </button>
          </div>

          {status.kind === "error" && (
            <p className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-center text-sm font-medium text-red-800">
              {status.message}
            </p>
          )}
          {status.kind === "success" && (
            <p className="mt-4 rounded-lg bg-emerald-100 px-4 py-2 text-center text-sm font-medium text-emerald-800">
              {status.message}
            </p>
          )}

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={status.kind === "loading"}
              className="submit-btn rounded-full px-10 py-3 text-lg font-bold text-white disabled:cursor-wait disabled:opacity-70"
            >
              {status.kind === "loading" ? "🦌 Heading to Checkout..." : "🎄 Checkout & Draw Names 🎄"}
            </button>
          </div>
        </div>
      </ChristmasLightsFrame>
    </form>
  );
}

