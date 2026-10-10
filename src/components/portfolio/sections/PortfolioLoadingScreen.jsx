import { useEffect, useState } from "react";

export function PortfolioLoadingScreen() {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsSlow(true);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main
      role="status"
      aria-live="polite"
      className="
        fixed inset-0 z-[9999]
        flex min-h-dvh flex-col
        items-center justify-center
        bg-[#FAF8F5] px-6
        text-[#111114]
      "
    >
      {/* Portfolio monogram */}
      <div
        className="
          mb-7 flex h-16 w-16
          items-center justify-center
          rounded-[1.35rem]
          bg-gradient-to-br
          from-[#8C9EFF] via-[#B6A0F5] to-[#E7A4C7]
          text-2xl font-bold text-white
          shadow-[0_8px_24px_rgba(140,126,210,0.28)]
        "
      >
        V
      </div>

      <h1 className="text-lg font-semibold tracking-tight">
        Vivek
      </h1>

      <p className="mt-2 text-sm text-[#77716F]">
        {isSlow
          ? "Waking up the server..."
          : "Preparing your experience..."}
      </p>

      {/* Indeterminate activity indicator */}
      <div
        className="
          mt-7 h-1 w-44 overflow-hidden
          rounded-full bg-[#E8E1DA]
        "
        aria-hidden="true"
      >
        <div
          className="
            portfolio-loading-bar h-full w-1/3
            rounded-full
            bg-gradient-to-r
            from-[#8C9EFF] via-[#B6A0F5] to-[#E7A4C7]
          "
        />
      </div>

      <style>{`
        @keyframes portfolio-loader-slide {
          from { transform: translateX(-120%); }
          to   { transform: translateX(340%); }
        }

        .portfolio-loading-bar {
          animation: portfolio-loader-slide 1.4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .portfolio-loading-bar {
            animation: none;
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
