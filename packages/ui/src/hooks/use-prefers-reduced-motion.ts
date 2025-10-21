import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: no-preference)";

export function usePrefersReducedMotion() {
  const mediaQueryList = window.matchMedia(QUERY);
  // Default to no-animations, since we don't know what the
  // user's preference is on the server.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    !mediaQueryList.matches,
  );

  useEffect(() => {
    // Register our event listener
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(!event.matches);
    };

    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [mediaQueryList]);

  return prefersReducedMotion;
}
