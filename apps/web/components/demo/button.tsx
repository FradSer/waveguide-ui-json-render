"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Button({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const variant = props.variant as string;
  const label = props.label as string;
  const actionText = (props.actionText as string) || label;
  const btnClass =
    variant === "danger"
      ? "bg-black border border-[#00FF66] text-[#00FF66] border-dashed"
      : variant === "secondary"
        ? "bg-black border border-[#00FF66] text-[#00FF66]"
        : "bg-[#00FF66] text-black";

  return (
    <button
      type="button"
      onClick={() =>
        (
          window as unknown as { __demoAction?: (text: string) => void }
        ).__demoAction?.(actionText)
      }
      className={`self-start px-2 py-1 rounded text-[10px] font-medium hover:waveguide-glow-intense transition-all ${btnClass} ${baseClass} ${customClass}`}
    >
      {label}
    </button>
  );
}
