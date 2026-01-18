"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Text({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const textVariant = props.variant as string;
  const textClass =
    textVariant === "caption"
      ? "text-[9px]"
      : textVariant === "muted"
        ? "text-[10px] text-[#00AA44]"
        : "text-[10px]";

  return (
    <p
      className={`${textClass} text-left text-[#00FF66] ${baseClass} ${customClass}`}
    >
      {props.content as string}
    </p>
  );
}
