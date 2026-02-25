"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Alert({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const alertType = props.type as string;
  const alertClass =
    alertType === "success"
      ? "bg-black border-[#00FF66] text-[#00FF66]"
      : alertType === "warning"
        ? "bg-black border-[#00FF66] text-[#00FF66] border-dashed"
        : alertType === "error"
          ? "bg-black border-[#00FF66] text-[#00FF66] border-dotted"
          : "bg-black border-[#00FF66] text-[#00FF66]";

  return (
    <div
      className={`p-2 rounded border ${alertClass} ${baseClass} ${customClass}`}
    >
      <div className="text-xs font-medium">{props.title as string}</div>
      {props.message ? (
        <div className="text-[10px] mt-0.5 text-[#00AA44]">
          {props.message as string}
        </div>
      ) : null}
    </div>
  );
}
