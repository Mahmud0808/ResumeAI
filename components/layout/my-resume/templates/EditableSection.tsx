"use client";

import React from "react";

/**
 * Wraps a preview section so that, in edit mode, clicking it jumps to the
 * matching form step. Shared by all resume templates.
 */
const EditableSection = ({
  index,
  isEditMode,
  onSelect,
  className = "",
  children,
}: {
  index: number;
  isEditMode: boolean;
  onSelect: (index: number) => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    onClick={isEditMode ? () => onSelect(index) : undefined}
    className={`${
      isEditMode ? "cursor-pointer hover:bg-black/5 rounded" : ""
    } ${className}`}
  >
    {children}
  </div>
);

export default EditableSection;
