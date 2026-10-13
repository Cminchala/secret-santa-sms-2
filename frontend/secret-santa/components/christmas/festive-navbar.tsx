import { LightString } from "./christmas-lights";

export function FestiveNavbar() {
  return (
    <header className="festive-nav sticky top-0 z-30 w-full">
      <div className="relative flex h-20 items-center justify-center px-4">
        <span className="absolute left-4 text-3xl sm:left-8 sway" aria-hidden>
          🎄
        </span>
        <h1 className="festive-title text-center text-3xl sm:text-5xl">
          🎅 Secret Santa 🎁
        </h1>
        <span className="absolute right-4 text-3xl sm:right-8 sway" aria-hidden>
          ⛄
        </span>
      </div>
      {/* hanging lights along the bottom of the taskbar */}
      <LightString count={40} className="absolute -bottom-3 left-0 right-0" />
    </header>
  );
}

