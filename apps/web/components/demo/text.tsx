"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Text({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const textVariant = props.variant as string;
  const textClass =
    textVariant === "caption"
      ? "text-[9px] text-[#00FF66]"
      : textVariant === "muted"
        ? "text-[10px] text-[#00AA44]"
        : "text-[10px] text-[#00FF66]";

  return (
    <p className={`${textClass} text-left ${baseClass} ${customClass}`}>
      {props.content as string}
    </p>
  );
}
