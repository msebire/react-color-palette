import React, { memo, useCallback, useMemo } from "react";
import useResizeObserver from "use-resize-observer";

import { ColorService, type IColor } from "@/services/color";

import { Interactive } from "../interactive";

interface IHueProps {
  readonly color: IColor;
  readonly onChange: (color: IColor) => void;
}

export const Hue = memo(({ color, onChange }: IHueProps) => {
  const { ref: hueRef, width = 1 } = useResizeObserver();

  const position = useMemo(() => {
    const x = (color.hsv.h / 360) * width;

    return { x };
  }, [color.hsv.h, width]);

  const updateColor = useCallback(
    (x: number) => {
      const nextColor = ColorService.convert("hsv", {
        ...color.hsv,
        h: (x / width) * 360,
      });

      onChange(nextColor);
    },
    [width, color.hsv, onChange]
  );

  const hsl = useMemo(() => [color.hsv.h, "100%", "50%"].join(" "), [color.hsv.h]);

  return (
    <Interactive onCoordinateChange={updateColor}>
      <div ref={hueRef} className="rcp-hue">
        <div style={{ left: position.x, backgroundColor: `hsl(${hsl})` }} className="rcp-hue-cursor" />
      </div>
    </Interactive>
  );
});
