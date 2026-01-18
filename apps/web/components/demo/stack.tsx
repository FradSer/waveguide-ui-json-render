"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Stack({ element, children }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const isHorizontal = props.direction === "horizontal";
  const stackGap =
    props.gap === "lg" ? "gap-2" : props.gap === "sm" ? "gap-0.5" : "gap-1";

  return (
    <div
      className={`flex ${isHorizontal ? "flex-row flex-wrap items-center" : "flex-col"} ${stackGap} w-full h-full ${baseClass} ${customClass}`}
    >
      {children}
    </div>
  );
}
