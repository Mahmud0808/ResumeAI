"use client";

import React, { useEffect, useMemo, useRef } from "react";
import EditableSection from "./EditableSection";
import SummaryPreview from "../previews/SummaryPreview";
import ExperiencePreview from "../previews/ExperiencePreview";
import EducationalPreview from "../previews/EducationalPreview";
import SkillsPreview from "../previews/SkillsPreview";
import { useFormContext } from "@/lib/context/FormProvider";
import { updateResume } from "@/lib/actions/resume.actions";
import { useToast } from "@/components/ui/use-toast";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";

const DEFAULT_ORDER = ["experience", "education", "skills"] as const;

type SectionKey = (typeof DEFAULT_ORDER)[number];

const SECTION_CONFIG: Record<
  SectionKey,
  {
    index: number;
    hasData: (formData: any) => boolean;
    Component: React.ComponentType;
  }
> = {
  experience: {
    index: 3,
    hasData: (formData) => formData?.experience?.length > 0,
    Component: ExperiencePreview,
  },
  education: {
    index: 4,
    hasData: (formData) => formData?.education?.length > 0,
    Component: EducationalPreview,
  },
  skills: {
    index: 5,
    hasData: (formData) => formData?.skills?.length > 0,
    Component: SkillsPreview,
  },
};

/** A draggable section row: grip handle starts the drag, body stays clickable. */
const DraggableSection = ({
  sectionKey,
  isEditMode,
  onSelect,
}: {
  sectionKey: SectionKey;
  isEditMode: boolean;
  onSelect: (index: number) => void;
}) => {
  const dragControls = useDragControls();
  const { index, Component } = SECTION_CONFIG[sectionKey];

  return (
    <Reorder.Item
      as="div"
      value={sectionKey}
      layout="position"
      dragListener={false}
      dragControls={dragControls}
      className="group/section relative"
    >
      <div
        onPointerDown={(e) => {
          e.preventDefault();
          dragControls.start(e);
        }}
        className="absolute -left-7 top-1 z-10 flex h-6 w-6 cursor-grab touch-none items-center justify-center rounded-md text-slate-300 opacity-0 transition-opacity hover:bg-black/5 hover:text-slate-500 active:cursor-grabbing group-hover/section:opacity-100 print:hidden"
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <EditableSection index={index} isEditMode={isEditMode} onSelect={onSelect}>
        <Component />
      </EditableSection>
    </Reorder.Item>
  );
};

/**
 * The summary/experience/education/skills blocks, shared across templates.
 * Summary is pinned first; the remaining sections are drag-reorderable in
 * edit mode and render in the saved order everywhere. `sections` lets a
 * template manage a subset (e.g. sidebar keeps skills in its side column).
 */
const BodySections = ({
  formData,
  isEditMode,
  onSelect,
  sections = [...DEFAULT_ORDER],
}: {
  formData: any;
  isEditMode: boolean;
  onSelect: (index: number) => void;
  sections?: string[];
}) => {
  const { handleInputChange } = useFormContext();
  const { toast } = useToast();
  const persistTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(persistTimer.current);
  }, []);

  // Saved order, sanitized: unknown keys dropped, missing keys appended.
  const fullOrder = useMemo<SectionKey[]>(() => {
    const saved = (
      Array.isArray(formData?.sectionOrder) ? formData.sectionOrder : []
    ).filter((key: any): key is SectionKey =>
      (DEFAULT_ORDER as readonly string[]).includes(key)
    );
    return [...saved, ...DEFAULT_ORDER.filter((key) => !saved.includes(key))];
  }, [formData?.sectionOrder]);

  // Sections this instance shows, with data, in saved order.
  const visibleKeys = fullOrder.filter(
    (key) => sections.includes(key) && SECTION_CONFIG[key].hasData(formData)
  );

  const onReorder = (newVisible: SectionKey[]) => {
    // Splice the reordered visible keys back into the full order, leaving
    // hidden/foreign sections in their slots.
    let cursor = 0;
    const merged = fullOrder.map((key) =>
      visibleKeys.includes(key) ? newVisible[cursor++] : key
    );

    handleInputChange({
      target: { name: "sectionOrder", value: merged },
    });

    clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(async () => {
      const result = await updateResume({
        resumeId: formData.resumeId,
        updates: { sectionOrder: merged },
      });
      if (!result.success) {
        toast({
          title: "Uh Oh! Something went wrong.",
          description: result?.error,
          variant: "destructive",
          className: "bg-white",
        });
      }
    }, 800);
  };

  return (
    <>
      <EditableSection index={2} isEditMode={isEditMode} onSelect={onSelect}>
        <SummaryPreview />
      </EditableSection>

      {isEditMode ? (
        <Reorder.Group
          as="div"
          axis="y"
          values={visibleKeys}
          onReorder={onReorder}
        >
          {visibleKeys.map((key) => (
            <DraggableSection
              key={key}
              sectionKey={key}
              isEditMode={isEditMode}
              onSelect={onSelect}
            />
          ))}
        </Reorder.Group>
      ) : (
        visibleKeys.map((key) => {
          const { index, Component } = SECTION_CONFIG[key];
          return (
            <EditableSection
              key={key}
              index={index}
              isEditMode={isEditMode}
              onSelect={onSelect}
            >
              <Component />
            </EditableSection>
          );
        })
      )}
    </>
  );
};

export default BodySections;
