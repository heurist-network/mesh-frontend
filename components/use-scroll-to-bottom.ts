import { useEffect, useRef, type RefObject } from 'react';

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>,
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);
  const userScrolledRef = useRef(false);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      // check if user has scrolled away from bottom
      const handleScroll = () => {
        if (isScrollingRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 10;

        userScrolledRef.current = !isAtBottom;
      };

      // scroll to bottom when content changes, unless user has scrolled up
      const observer = new MutationObserver(() => {
        if (!userScrolledRef.current) {
          isScrollingRef.current = true;
          end.scrollIntoView({ behavior: 'smooth', block: 'end' });

          // reset scrolling flag after animation completes
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 300);
        }
      });

      container.addEventListener('scroll', handleScroll);

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      return () => {
        observer.disconnect();
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return [containerRef, endRef];
}
