import type { RefObject } from "react";
import { useEffect, useState } from "react";

export function useScrollShadow(scrollRef: RefObject<HTMLElement | null>) {
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 1;

      setShowTopShadow(scrollTop > 0);
      setShowBottomShadow(!isAtBottom);
    };

    // Initial check
    handleScroll();

    element.addEventListener("scroll", handleScroll);
    // Also listen to resize events that might change scrollability
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener("scroll", handleScroll);
      resizeObserver.unobserve(element);
      resizeObserver.disconnect();
    };
  }, [scrollRef]);

  return { showTopShadow, showBottomShadow };
}
