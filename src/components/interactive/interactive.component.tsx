import React, { memo, useCallback, useRef } from "react";
import useResizeObserver from "use-resize-observer";

import { clamp } from "@/utils/clamp";

interface IInteractiveProps {
  readonly onCoordinateChange: (x: number, y: number) => void;
  readonly children: React.ReactNode;
}

export const Interactive = memo(({ onCoordinateChange, children }: IInteractiveProps) => {
  const interactiveRef = useRef<HTMLDivElement | null>(null);

  const { width = 1, height = 1 } = useResizeObserver({ ref: interactiveRef });

  const move = useCallback(
    (event: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
      let ir = interactiveRef.current?.getBoundingClientRect();

      const x = clamp(event.pageX - (ir?.left ?? 0), 0, width);
      const y = clamp(event.pageY - (ir?.top ?? 0), 0, height);

      onCoordinateChange(x, y);
    },
    [interactiveRef, width, height, onCoordinateChange]
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;

      move(event);

      const onPointerMove = (event: PointerEvent) => {
        move(event);
      };

      const onPointerUp = (event: PointerEvent) => {
        move(event);

        document.removeEventListener("pointermove", onPointerMove, false);
        document.removeEventListener("pointerup", onPointerUp, false);
      };

      document.addEventListener("pointermove", onPointerMove, false);
      document.addEventListener("pointerup", onPointerUp, false);
    },
    [move]
  );

  return (
    <div ref={interactiveRef} className="rcp-interactive" onPointerDown={onPointerDown}>
      {children}
    </div>
  );
});
