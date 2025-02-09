"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import {cn} from "@/utils"

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({className, ...props}, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn("group relative flex w-full touch-none items-center select-none", className)}
        {...props}
    >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow cursor-pointer overflow-hidden rounded-full bg-primary/5 transition-colors group-hover:bg-primary/10">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-4 w-4 cursor-pointer rounded-full border bg-white shadow-sm shadow-black/20 transition-transform hover:scale-110 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export {Slider}
