"use client";

import { useFormContext } from "@/lib/context/FormProvider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const TemplateSwitcher = () => {
    const { template, changeTemplate } = useFormContext();

    return (
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Template:</label>
            <Select
                value={template.toString()}
                onValueChange={(value) => changeTemplate(parseInt(value))}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">Template 1</SelectItem>
                    <SelectItem value="2">Template 2</SelectItem>
                    <SelectItem value="3">Template 3</SelectItem>
                    <SelectItem value="4">Template 4</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default TemplateSwitcher;
