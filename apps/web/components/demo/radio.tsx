"use client";

import { useState } from "react";
import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Radio({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const options = (props.options as string[]) || [];
  const [selected, setSelected] = useState(0);

  return (
    <div className={`space-y-1 ${baseClass} ${customClass}`}>
      {props.label ? (
        <div className="text-[10px] text-[#00AA44] mb-1 text-left">
          {props.label as string}
        </div>
      ) : null}
      {options.map((opt, i) => (
        <label
          key={i}
          className="flex items-center gap-2 text-xs cursor-pointer text-[#00FF66]"
          onClick={() => setSelected(i)}
        >
          <div
            className={`w-3.5 h-3.5 border border-[#00FF66] rounded-full flex items-center justify-center transition-colors ${selected === i ? "bg-black" : ""}`}
          >
            {selected === i && (
              <div className="w-2 h-2 rounded-full bg-[#00FF66]" />
            )}
          </div>
          {opt}
        </label>
      ))}
    </div>
  );
}
