"use client";

import React, { useEffect, useMemo, useRef } from "react";
import EditableSection from "./EditableSection";
import SummaryPreview from "../previews/SummaryPreview";
import ExperiencePreview from "../previews/ExperiencePreview";
import EducationalPreview from "../previews/EducationalPreview";
import SkillsPreview from "../previews/SkillsPreview";
import CustomSectionPreview from "../previews/CustomSectionPreview";
import { useFormContext } from "@/lib/context/FormProvider";
import { updateResume } from "@/lib/actions/resume.actions";
import { useToast } from "@/components/ui/use-toast";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";

const BUILTIN_ORDER = ["experience", "education", "skills"] as const;
const CUSTOM_PREFIX = "custom-";
const CUSTOM_FORM_INDEX = 6;

type BuiltinKey = (typeof BUILTIN_ORDER)[number];

const BUILTIN_CONFIG: Record<
  BuiltinKey,
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

const customIndexOf = (key: string) => Number(key.slice(CUSTOM_PREFIX.length));

/** A draggable section row: grip handle starts the drag, body stays clickable. */
const DraggableSection = ({
  sectionKey,
  isEditMode,
  onSelect,
  children,
  stepIndex,
}: {
  sectionKey: string;
  isEditMode: boolean;
  onSelect: (index: number) => void;
  children: React.ReactNode;
  stepIndex: number;
}) => {
  const dragControls = useDragControls();

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
      <EditableSection
        index={stepIndex}
        isEditMode={isEditMode}
        onSelect={onSelect}
      >
        {children}
      </EditableSection>
    </Reorder.Item>
  );
};

/**
 * The body blocks shared across templates. Summary is pinned first (hideable);
 * built-in and custom sections are drag-reorderable in edit mode and render in
 * the saved order everywhere. `sections` lets a template manage a subset —
 * built-in keys plus the "custom" token for all custom sections (e.g. sidebar
 * keeps skills in its side column).
 */
const BodySections = ({
  formData,
  isEditMode,
  onSelect,
  sections,
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

  const customSections = Array.isArray(formData?.customSections)
    ? formData.customSections
    : [];
  const customKeys = customSections.map(
    (_: any, index: number) => `${CUSTOM_PREFIX}${index}`
  );
  const hidden: string[] = Array.isArray(formData?.hiddenSections)
    ? formData.hiddenSections
    : [];

  // Saved order, sanitized: unknown keys dropped, missing keys appended.
  const fullOrder = useMemo<string[]>(() => {
    const known = [...BUILTIN_ORDER, ...customKeys] as string[];
    const saved = (
      Array.isArray(formData?.sectionOrder) ? formData.sectionOrder : []
    ).filter((key: any) => known.includes(key));
    return [...saved, ...known.filter((key) => !saved.includes(key))];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.sectionOrder, customKeys.length]);

  const isCustom = (key: string) => key.startsWith(CUSTOM_PREFIX);

  const inScope = (key: string) =>
    !sections ||
    sections.includes(key) ||
    (sections.includes("custom") && isCustom(key));

  const hasData = (key: string) => {
    if (isCustom(key)) {
      const section = customSections[customIndexOf(key)];
      return !!(section?.title && section?.body);
    }
    return BUILTIN_CONFIG[key as BuiltinKey].hasData(formData);
  };

  // Sections this instance shows, with data, in saved order.
  const visibleKeys = fullOrder.filter(
    (key) => inScope(key) && !hidden.includes(key) && hasData(key)
  );

  const onReorder = (newVisible: string[]) => {
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

  const renderContent = (key: string) =>
    isCustom(key) ? (
      <CustomSectionPreview index={customIndexOf(key)} />
    ) : (
      React.createElement(BUILTIN_CONFIG[key as BuiltinKey].Component)
    );

  const stepIndexFor = (key: string) =>
    isCustom(key) ? CUSTOM_FORM_INDEX : BUILTIN_CONFIG[key as BuiltinKey].index;

  const showSummary = !hidden.includes("summary");

  return (
    <>
      {showSummary && (
        <EditableSection index={2} isEditMode={isEditMode} onSelect={onSelect}>
          <SummaryPreview />
        </EditableSection>
      )}

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
              stepIndex={stepIndexFor(key)}
            >
              {renderContent(key)}
            </DraggableSection>
          ))}
        </Reorder.Group>
      ) : (
        visibleKeys.map((key) => (
          <EditableSection
            key={key}
            index={stepIndexFor(key)}
            isEditMode={isEditMode}
            onSelect={onSelect}
          >
            {renderContent(key)}
          </EditableSection>
        ))
      )}
    </>
  );
};

export default BodySections;
