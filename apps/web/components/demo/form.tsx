"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Form({ element, children }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);

  return (
    <div
      className={`border border-[#00FF66] rounded-lg p-3 bg-black ${baseClass} ${customClass}`}
    >
      {props.title ? (
        <div className="font-semibold text-sm mb-2 text-left text-[#00FF66]">
          {props.title as string}
        </div>
      ) : null}
      <div className="space-y-2">{children}</div>
    </div>
  );
}
