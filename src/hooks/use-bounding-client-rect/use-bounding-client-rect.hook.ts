import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

export function useBoundingClientRect<T extends HTMLElement>(): [
  React.RefObject<T>,
  { height: number | undefined; width: number | undefined },
] {
  const ref = useRef<T>(null);

  const [resizeCounter, setResizeCounter] = useState(0);

  const onResize = useCallback(() => setResizeCounter((resizeCounter) => resizeCounter + 1), []);

  useLayoutEffect(() => {
    window.addEventListener("resize", onResize, false);

    const observer = new ResizeObserver(onResize);

    if (ref.current) observer.observe(ref.current);

    return () => {
      window.removeEventListener("resize", onResize, false);
      observer.disconnect();
    };
  }, [onResize]);

  return useMemo(() => {
    let boundingClientRect = ref.current?.getBoundingClientRect();

    return [ref, { height: boundingClientRect?.height, width: boundingClientRect?.width }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resizeCounter]);
}
