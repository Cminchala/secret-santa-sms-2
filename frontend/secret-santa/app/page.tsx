import { FestiveNavbar } from "@/components/christmas/festive-navbar";
import { SecretSantaForm } from "@/components/christmas/secret-santa-form";
import { Snowfall } from "@/components/christmas/snowfall";

export default function Home() {
  return (
    <main className="festive-bg relative min-h-screen overflow-x-hidden">
      <Snowfall />
      <FestiveNavbar />
      <section className="relative z-10 flex flex-col items-center px-4 pb-32 pt-14">
        <p className="festive-title mb-8 text-center text-xl text-amber-200 sm:text-2xl">
          ✨ Gather your elves, draw names, and spread some holiday cheer! ✨
        </p>
        <SecretSantaForm />
      </section>
    </main>
  );
}
