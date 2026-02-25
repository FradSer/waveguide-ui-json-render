"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Textarea({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const rows = (props.rows as number) || 3;

  return (
    <div className={`${baseClass} ${customClass}`}>
      {props.label ? (
        <label className="text-[10px] text-[#00AA44] block mb-0.5 text-left">
          {props.label as string}
        </label>
      ) : null}
      <textarea
        placeholder={(props.placeholder as string) || ""}
        rows={rows}
        className="w-full bg-black border border-[#00FF66] rounded px-2 py-1 text-xs text-[#00FF66] resize-none focus:outline-none focus:ring-1 focus:ring-[#00FF66] placeholder:text-[#003318]"
      />
    </div>
  );
}
