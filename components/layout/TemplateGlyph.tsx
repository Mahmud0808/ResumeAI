"use client";

import React from "react";

/**
 * Tiny abstract layout thumbnail for a resume template. Pure CSS mock — the
 * shapes mirror each template's real structure so options are tellable apart
 * at a glance.
 */
const Bars = ({ count = 3, light = false }: { count?: number; light?: boolean }) => (
  <div className="space-y-[2px]">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`h-[2px] rounded-full ${light ? "bg-white/60" : "bg-slate-300"}`}
        style={{ width: `${90 - i * 18}%` }}
      />
    ))}
  </div>
);

const TemplateGlyph = ({
  template,
  color,
  className = "",
}: {
  template: string;
  color: string;
  className?: string;
}) => {
  const body = (
    <div className="flex-1 space-y-[5px] p-[5px]">
      <Bars count={3} />
      <Bars count={2} />
    </div>
  );

  let inner: React.ReactNode;

  switch (template) {
    case "modern":
      inner = (
        <>
          <div className="space-y-[2px] p-[5px]" style={{ backgroundColor: color }}>
            <div className="h-[3px] w-3/5 rounded-full bg-white/90" />
            <div className="h-[2px] w-2/5 rounded-full bg-white/60" />
          </div>
          {body}
        </>
      );
      break;
    case "elegant":
      inner = (
        <div className="flex h-full">
          <div className="w-[4px]" style={{ backgroundColor: color }} />
          <div className="flex-1">
            <div className="p-[5px] pb-[3px]">
              <div className="h-[3px] w-3/5 rounded-full" style={{ backgroundColor: color }} />
              <div className="mt-[2px] h-[1px] w-full" style={{ backgroundColor: color }} />
            </div>
            {body}
          </div>
        </div>
      );
      break;
    case "minimal":
      inner = (
        <>
          <div className="p-[5px] pb-0">
            <div className="h-[3px] w-1/2 rounded-full bg-slate-400" />
            <div className="mt-[3px] h-[2px] w-[12px]" style={{ backgroundColor: color }} />
          </div>
          {body}
        </>
      );
      break;
    case "sidebar":
      inner = (
        <div className="flex h-full">
          <div className="w-[34%] space-y-[3px] p-[4px]" style={{ backgroundColor: color }}>
            <div className="h-[3px] w-full rounded-full bg-white/90" />
            <div className="h-[2px] w-4/5 rounded-full bg-white/60" />
            <div className="h-[2px] w-3/5 rounded-full bg-white/60" />
          </div>
          <div className="flex-1">{body}</div>
        </div>
      );
      break;
    case "executive":
      inner = (
        <>
          <div className="px-[5px] pt-[5px] text-center">
            <div className="h-[1px] w-full" style={{ backgroundColor: color }} />
            <div className="mx-auto mt-[3px] h-[3px] w-1/2 rounded-full bg-slate-400" />
            <div className="mx-auto mt-[2px] h-[2px] w-1/3 rounded-full" style={{ backgroundColor: color }} />
            <div className="mt-[3px] h-[1px] w-full" style={{ backgroundColor: color }} />
          </div>
          {body}
        </>
      );
      break;
    case "compact":
      inner = (
        <>
          <div className="border-t-[3px]" style={{ borderColor: color }}>
            <div className="flex items-start justify-between p-[5px] pb-[3px]">
              <div className="h-[3px] w-2/5 rounded-full bg-slate-400" />
              <div className="h-[2px] w-1/4 rounded-full bg-slate-300" />
            </div>
            <div className="mx-[5px] h-[1px] bg-slate-200" />
          </div>
          {body}
        </>
      );
      break;
    case "bold":
      inner = (
        <>
          <div className="p-[5px] pb-0">
            <div className="h-[4px] w-3/5 rounded-full" style={{ backgroundColor: color }} />
            <div className="mt-[2px] h-[4px] w-2/5 rounded-full" style={{ backgroundColor: color }} />
            <div className="mt-[3px] h-[2px] w-[14px]" style={{ backgroundColor: color }} />
          </div>
          {body}
        </>
      );
      break;
    case "classic":
    default:
      inner = (
        <>
          <div className="h-[4px] w-full" style={{ backgroundColor: color }} />
          <div className="p-[5px] pb-0">
            <div className="h-[3px] w-3/5 rounded-full bg-slate-400" />
          </div>
          {body}
        </>
      );
      break;
  }

  return (
    <div
      className={`flex aspect-[3/4] flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {inner}
    </div>
  );
};

export default TemplateGlyph;
