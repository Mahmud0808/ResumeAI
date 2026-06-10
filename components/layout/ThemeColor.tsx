"use client";

import { useFormContext } from "@/lib/context/FormProvider";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Check, LayoutGrid, Pipette } from "lucide-react";
import { themeColors } from "@/lib/utils";
import { updateResume } from "@/lib/actions/resume.actions";
import { useToast } from "../ui/use-toast";
import { motion } from "framer-motion";

// Last preset slot is replaced by the custom color picker.
const presetColors = themeColors.slice(0, -1);

const ThemeColor = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const { formData, handleInputChange } = useFormContext();
  const [selectedColor, setSelectedColor] = useState(themeColors[0]);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const persistTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setSelectedColor(formData.themeColor);
  }, [formData.themeColor]);

  useEffect(() => {
    return () => clearTimeout(persistTimer.current);
  }, []);

  const persistColor = async (color: string) => {
    const result = await updateResume({
      resumeId: params.id,
      updates: {
        themeColor: color,
      },
    });

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Theme color updated successfully.",
        className: "bg-white",
      });
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-white",
      });
    }
  };

  const onColorSelect = async (color: any) => {
    setSelectedColor(color);

    handleInputChange({
      target: {
        name: "themeColor",
        value: color,
      },
    });

    await persistColor(color);
  };

  // Native color input fires continuously while dragging: update the live
  // preview immediately, but debounce the server save until the user settles.
  const onCustomColorChange = (color: string) => {
    setSelectedColor(color);

    handleInputChange({
      target: {
        name: "themeColor",
        value: color,
      },
    });

    clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => persistColor(color), 600);
  };

  const isCustomColor =
    !!selectedColor && !presetColors.includes(selectedColor);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="flex gap-2 border-primary-700 text-primary-700 hover:border-primary-700 hover:bg-primary-50 hover:text-primary-800 hover:shadow-md hover:shadow-primary-700/15"
        >
          <LayoutGrid /> Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className="mb-3 text-sm font-bold">Select Theme Color</h2>
        <div className="grid grid-cols-5 gap-3">
          {presetColors.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => onColorSelect(item)}
              className="flex justify-center items-center h-8 w-8 rounded-lg cursor-pointer shadow-sm ring-1 ring-black/5"
              style={{
                background: item,
              }}
            >
              {selectedColor == item && (
                <Check color="#ffffff" strokeWidth={3} width={20} height={20} />
              )}
            </motion.div>
          ))}

          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => colorInputRef.current?.click()}
            className="relative flex justify-center items-center h-8 w-8 rounded-lg cursor-pointer shadow-sm ring-1 ring-black/5 overflow-hidden"
            style={{
              background: isCustomColor
                ? selectedColor
                : "var(--conic-gradient)",
            }}
            title="Custom color"
          >
            {isCustomColor ? (
              <Check color="#ffffff" strokeWidth={3} width={20} height={20} />
            ) : (
              <Pipette
                color="#ffffff"
                strokeWidth={2.5}
                width={14}
                height={14}
                className="drop-shadow"
              />
            )}
            <input
              ref={colorInputRef}
              type="color"
              value={isCustomColor ? selectedColor : "#435ada"}
              onChange={(e) => onCustomColorChange(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="Pick a custom theme color"
            />
          </motion.div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeColor;
