type Orientation = "horizontal" | "vertical";

/**
 * A string of Christmas light bulbs that cycle through colors.
 * Each bulb gets a staggered animation delay so the colors "chase".
 */
export function LightString({
  count = 20,
  orientation = "horizontal",
  className = "",
}: {
  count?: number;
  orientation?: Orientation;
  className?: string;
}) {
  const isH = orientation === "horizontal";
  return (
    <div
      aria-hidden
      className={`light-string ${isH ? "light-string-h" : "light-string-v"} ${className}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`bulb ${isH ? "" : "bulb-v"}`}
          style={{ animationDelay: `${-(i % 5) * 0.4}s` }}
        />
      ))}
    </div>
  );
}

/**
 * Wraps children with Christmas lights on all four sides.
 */
export function ChristmasLightsFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative px-3 py-4 sm:px-8 sm:py-8">
      <LightString count={22} className="absolute left-2 right-2 sm:left-4 sm:right-4 top-0" />
      <LightString count={22} className="absolute left-2 right-2 sm:left-4 sm:right-4 bottom-0 rotate-180" />
      <LightString
        count={12}
        orientation="vertical"
        className="absolute top-2 bottom-2 sm:top-4 sm:bottom-4 left-0"
      />
      <LightString
        count={12}
        orientation="vertical"
        className="absolute top-2 bottom-2 sm:top-4 sm:bottom-4 right-0 rotate-180"
      />
      {children}
    </div>
  );
}

