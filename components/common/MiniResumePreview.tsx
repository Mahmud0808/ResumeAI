"use client";

import React from "react";

/**
 * Lightweight resume thumbnail for dashboard cards. Renders the resume's real
 * name, job title, theme color, and template layout as a stylized A4 mock —
 * no sub-document fetch needed (uses the flat fields on the resume doc).
 */
const Placeholder = ({
  rows = 3,
  light = false,
}: {
  rows?: number;
  light?: boolean;
}) => (
  <div className="space-y-1">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className={`h-[3px] rounded-full ${
          light ? "bg-white/50" : "bg-slate-200"
        }`}
        style={{ width: `${95 - i * 15}%` }}
      />
    ))}
  </div>
);

const SectionHeading = ({ color }: { color: string }) => (
  <div
    className="mb-1 h-[4px] w-1/3 rounded-full opacity-80"
    style={{ backgroundColor: color }}
  />
);

const MiniResumePreview = ({ resume }: { resume: any }) => {
  const color = resume?.themeColor || "#212121";
  const template = resume?.template || "classic";
  const name =
    [resume?.firstName, resume?.lastName].filter(Boolean).join(" ") ||
    resume?.title ||
    "Untitled";
  const jobTitle = resume?.jobTitle;

  const nameBlock = (inverted = false, centered = false) => (
    <div className={centered ? "text-center" : ""}>
      <p
        className={`truncate text-[9px] font-bold leading-tight ${
          inverted ? "text-white" : "text-slate-800"
        }`}
      >
        {name}
      </p>
      {jobTitle && (
        <p
          className={`truncate text-[7px] leading-tight ${
            inverted ? "text-white/80" : "text-slate-500"
          }`}
        >
          {jobTitle}
        </p>
      )}
    </div>
  );

  const bodyBlock = (
    <div className="flex-1 space-y-2 overflow-hidden">
      <Placeholder rows={3} />
      <div>
        <SectionHeading color={color} />
        <Placeholder rows={3} />
      </div>
      <div>
        <SectionHeading color={color} />
        <Placeholder rows={2} />
      </div>
    </div>
  );

  let layout: React.ReactNode;

  switch (template) {
    case "modern":
      layout = (
        <>
          <div className="px-2.5 py-2" style={{ backgroundColor: color }}>
            {nameBlock(true)}
          </div>
          <div className="flex flex-1 flex-col p-2.5">{bodyBlock}</div>
        </>
      );
      break;
    case "elegant":
      layout = (
        <div className="flex h-full">
          <div className="w-[5px] shrink-0" style={{ backgroundColor: color }} />
          <div className="flex flex-1 flex-col p-2.5">
            <div className="mb-1.5 border-b pb-1" style={{ borderColor: color }}>
              {nameBlock()}
            </div>
            {bodyBlock}
          </div>
        </div>
      );
      break;
    case "minimal":
      layout = (
        <div className="flex h-full flex-col p-2.5">
          {nameBlock()}
          <div className="my-1.5 h-[2px] w-5" style={{ backgroundColor: color }} />
          {bodyBlock}
        </div>
      );
      break;
    case "sidebar":
      layout = (
        <div className="flex h-full">
          <div
            className="w-[34%] shrink-0 space-y-1.5 p-2"
            style={{ backgroundColor: color }}
          >
            {nameBlock(true)}
            <Placeholder rows={3} light />
          </div>
          <div className="flex flex-1 flex-col p-2">{bodyBlock}</div>
        </div>
      );
      break;
    case "executive":
      layout = (
        <div className="flex h-full flex-col p-2.5">
          <div className="h-[1.5px] w-full" style={{ backgroundColor: color }} />
          <div className="py-1">{nameBlock(false, true)}</div>
          <div className="mb-1.5 h-[1.5px] w-full" style={{ backgroundColor: color }} />
          {bodyBlock}
        </div>
      );
      break;
    case "compact":
      layout = (
        <div className="flex h-full flex-col p-2.5">
          <div className="mb-1.5 flex items-start justify-between gap-1 border-b border-slate-100 pb-1">
            {nameBlock()}
            <div className="mt-0.5 w-1/4 space-y-[2px]">
              <div className="h-[2px] rounded-full bg-slate-200" />
              <div className="h-[2px] rounded-full bg-slate-200" />
            </div>
          </div>
          {bodyBlock}
        </div>
      );
      break;
    case "bold":
      layout = (
        <div className="flex h-full flex-col p-2.5">
          <p
            className="truncate text-[11px] font-extrabold leading-tight"
            style={{ color }}
          >
            {name}
          </p>
          {jobTitle && (
            <p className="truncate text-[7px] text-slate-500">{jobTitle}</p>
          )}
          <div className="my-1.5 h-[3px] w-6" style={{ backgroundColor: color }} />
          {bodyBlock}
        </div>
      );
      break;
    case "classic":
    default:
      layout = (
        <div className="flex h-full flex-col p-2.5">
          <div className="mb-1.5">{nameBlock()}</div>
          {bodyBlock}
        </div>
      );
      break;
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {layout}
    </div>
  );
};

export default MiniResumePreview;
