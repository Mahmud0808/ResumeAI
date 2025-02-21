"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "@/lib/context/FormProvider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel"


const TemplateSwitcher = () => {
    const { template, changeTemplate } = useFormContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if (!api) return;

        api.on("select", () => {
            const newIndex = api.selectedScrollSnap() + 1;
            changeTemplate(newIndex);
            api.scrollTo(newIndex - 1, false); // Disable animation
        });
    }, [api]);

    // Set initial position when dialog opens
    useEffect(() => {
        if (api && isDialogOpen) {
            api.scrollTo(template - 1, false); // Scroll to current template without animation
        }
    }, [api, isDialogOpen, template]);

    // Example image URLs for each template
    const templateImages = {
        1: "/templates/template1.png",
        2: "/templates/template2.png",
        3: "/templates/template3.png",
        4: "/templates/template4.png",
    };

    return (
        <div className="flex items-center gap-2">
            <Button onClick={() => setIsDialogOpen(true)}>Change Template</Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className='max-h-fit'>
                    <DialogHeader>
                        <DialogTitle>Select a Template</DialogTitle>
                    </DialogHeader>
                    <Carousel
                        setApi={setApi}
                        opts={{
                            startIndex: template - 1, // initial value
                            align: "start",
                            loop: true,
                        }}
                    >
                        <CarouselContent>
                            {Object.entries(templateImages).map(([value, imageUrl]) => (
                                <CarouselItem key={value}>
                                    <div className="flex flex-col items-center gap-2">
                                        <img
                                            src={imageUrl}
                                            alt={`Template ${value}`}
                                            className="w-full min-w-full px-2 scale-50 object-cover rounded"
                                        />
                                        <span className="text-sm">Template {value}</span>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TemplateSwitcher;