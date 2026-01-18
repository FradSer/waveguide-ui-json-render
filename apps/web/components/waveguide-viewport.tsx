import React from "react";

interface WaveguideViewportProps {
  children: React.ReactNode;
}

/**
 * Fixed 540x180 viewport for AR glasses - uses every pixel
 * No padding, no margins - content fills entire display
 */
export function WaveguideViewport({ children }: WaveguideViewportProps) {
  return (
    <div className="inline-block bg-black p-1 rounded flex-shrink-0">
      <div
        className="overflow-hidden bg-black"
        style={{
          width: "540px",
          height: "180px",
          flexShrink: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
