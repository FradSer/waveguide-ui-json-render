"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Card({ element, children }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const maxWidthClass =
    props.maxWidth === "sm"
      ? "max-w-xs sm:min-w-[280px]"
      : props.maxWidth === "md"
        ? "max-w-sm sm:min-w-[320px]"
        : props.maxWidth === "lg"
          ? "max-w-md sm:min-w-[360px]"
          : "w-full h-full";

  const isFullWidth = !props.maxWidth || props.maxWidth === "full";

  return (
    <div
      className={`${isFullWidth ? "" : "border border-border rounded-lg"} p-2 bg-black overflow-hidden ${maxWidthClass} ${baseClass} ${customClass}`}
    >
      {props.title ? (
        <div className="font-semibold text-xs mb-1 text-left waveguide-glow text-[#00FF66]">
          {props.title as string}
        </div>
      ) : null}
      {props.description ? (
        <div className="text-[9px] text-[#00AA44] mb-1 text-left">
          {props.description as string}
        </div>
      ) : null}
      <div className="space-y-1">{children}</div>
    </div>
  );
}
