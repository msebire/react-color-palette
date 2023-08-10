import React, { memo, useCallback } from "react";

import { useBoundingClientRect } from "@/hooks/use-bounding-client-rect";

import { clamp } from "@/utils/clamp";

interface IInteractiveProps {
  readonly onCoordinateChange: (x: number, y: number) => void;
  readonly children: React.ReactNode;
}

export const Interactive = memo(({ onCoordinateChange, children }: IInteractiveProps) => {
  const [interactiveRef, { width = 1, height = 1 }] = useBoundingClientRect<HTMLDivElement>();

  const move = useCallback(
    (event: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
      const { left = 1, top = 1 } = interactiveRef.current?.getBoundingClientRect() ?? {};
      const x = clamp(event.clientX - left, 0, width);
      const y = clamp(event.clientY - top, 0, height);

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
