"use client";

import type { ComponentRenderProps } from "./types";
import { baseClass, getCustomClass } from "./utils";

export function Progress({ element }: ComponentRenderProps) {
  const { props } = element;
  const customClass = getCustomClass(props);
  const value = Math.min(100, Math.max(0, (props.value as number) || 0));

  return (
    <div className={`${baseClass} ${customClass}`}>
      {props.label ? (
        <div className="text-[9px] text-muted-foreground mb-1 text-left">
          {props.label as string}
        </div>
      ) : null}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all waveguide-glow"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
