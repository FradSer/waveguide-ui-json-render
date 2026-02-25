"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Progress({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const value = Math.min(100, Math.max(0, (props.value as number) || 0));

  return (
    <div className={`${baseClass} ${customClass}`}>
      {props.label ? (
        <div className="text-[9px] text-[#00AA44] mb-1 text-left">
          {props.label as string}
        </div>
      ) : null}
      <div className="h-1.5 bg-black rounded-full overflow-hidden border border-[#00FF66]">
        <div
          className="h-full bg-[#00FF66] rounded-none transition-all waveguide-glow"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
