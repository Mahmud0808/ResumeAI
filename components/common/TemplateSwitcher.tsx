// "use client";

// import { useFormContext } from "@/lib/context/FormProvider";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";

// const TemplateSwitcher = () => {
//     const { template, changeTemplate } = useFormContext();

//     return (
//         <div className="flex items-center gap-2">
//             <label className="text-sm font-medium">Template:</label>
//             <Select
//                 value={template.toString()}
//                 onValueChange={(value) => changeTemplate(parseInt(value))}
//             >
//                 <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Select template" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     <SelectItem value="1">Template 1</SelectItem>
//                     <SelectItem value="2">Template 2</SelectItem>
//                     <SelectItem value="3">Template 3</SelectItem>
//                     <SelectItem value="4">Template 4</SelectItem>
//                 </SelectContent>
//             </Select>
//         </div>
//     );
// };

// export default TemplateSwitcher;


"use client";

import { useState , useEffect } from "react";
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

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    // Example image URLs for each template
    const templateImages = {
        1: "/templates/template1.png",
        2: "/templates/template2.png",
        3: "/templates/template3.png",
        4: "/templates/template4.png",
    };


    useEffect(() => {
        if (!api) {
          return
        }
     
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)
     
        api.on("select", () => {
            changeTemplate(api.selectedScrollSnap()  + 1) })
      }, [api])

    const handleSlideChange = (index: number) => {
        changeTemplate(index + 1); // Update the selected template
    };

    return (
        <div className="flex items-center gap-2">
            {/* <label className="text-sm font-medium">Template:</label>
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
            </Select> */}

            {/* Button to Open Dialog */}
            <Button onClick={() => setIsDialogOpen(true)}>Change Template</Button>

            {/* Dialog with Carousel */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                <DialogContent className='max-h-fit'>
                    <DialogHeader>
                        <DialogTitle>Select a Template</DialogTitle>
                    </DialogHeader>
                    <Carousel
                        setApi={setApi}
                    >
                        <CarouselContent>
                            {Object.entries(templateImages).map(([value, imageUrl]) => (
                                <CarouselItem key={value}>
                                    <div className="flex flex-col items-center gap-2">
                                        <img
                                            src={imageUrl}
                                            alt={`Template ${value}`}
                                            className= "w-full min-w-full px-2 scale-50 object-cover rounded"
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