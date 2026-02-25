"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Input({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);

  return (
    <div className={`${baseClass} ${customClass}`}>
      {props.label ? (
        <label className="text-[9px] text-[#00FF66] block mb-0.5 text-left">
          {props.label as string}
        </label>
      ) : null}
      <input
        type={(props.type as string) || "text"}
        placeholder={(props.placeholder as string) || ""}
        className="h-6 w-full bg-black border border-[#00FF66] rounded px-2 text-[10px] text-[#00FF66] focus:outline-none focus:ring-1 focus:ring-[#00FF66] focus:waveguide-glow transition-all placeholder:text-[#00AA44] placeholder:opacity-100"
      />
    </div>
  );
}
