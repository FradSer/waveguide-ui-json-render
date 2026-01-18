"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Badge({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const badgeVariant = props.variant as string;
  const badgeClass =
    badgeVariant === "success"
      ? "bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/50"
      : badgeVariant === "warning"
        ? "bg-[#00AA44]/20 text-[#00AA44] border border-[#00AA44]/50"
        : badgeVariant === "danger"
          ? "bg-[#00AA44]/20 text-[#00AA44] border border-[#00AA44]/50"
          : "bg-black text-[#00FF66] border border-[#00FF66]";

  return (
    <span
      className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${badgeClass} ${baseClass} ${customClass}`}
    >
      {props.text as string}
    </span>
  );
}
