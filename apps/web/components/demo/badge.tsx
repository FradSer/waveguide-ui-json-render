"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Badge({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const badgeVariant = props.variant as string;
  const badgeClass =
    badgeVariant === "success"
      ? "bg-black text-[#00FF66] border border-[#00FF66]"
      : badgeVariant === "warning"
        ? "bg-black text-[#00FF66] border border-[#00FF66] border-dashed"
        : badgeVariant === "danger"
          ? "bg-black text-[#00FF66] border border-[#00FF66] border-dotted"
          : "bg-black text-[#00FF66] border border-[#00FF66]";

  return (
    <span
      className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${badgeClass} ${baseClass} ${customClass}`}
    >
      {props.text as string}
    </span>
  );
}
