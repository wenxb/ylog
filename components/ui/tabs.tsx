"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import {cn} from "@/utils"

const Tabs = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({className, ...props}, ref) => (
    <TabsPrimitive.Root ref={ref} className={cn("flex flex-col items-start justify-center", className)} {...props} />
))

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({className, ...props}, ref) => (
    <TabsPrimitive.List ref={ref} className={cn("flex items-center justify-center", className)} {...props} />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({className, children, ...props}, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "group relative flex min-w-[72px] cursor-pointer items-center justify-center px-3 font-medium whitespace-nowrap text-foreground/50 ring-offset-background transition-colors select-none hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=active]:font-bold data-[state=active]:text-foreground dark:hover:bg-accent",
            className
        )}
        {...props}
    >
        <div className={"relative flex h-full flex-col items-center justify-center py-3"}>
            {children}
            <div
                className={
                    "pointer-events-none absolute bottom-0 h-1 w-full min-w-12 rounded-md bg-blue-500 opacity-0 group-data-[state=active]:opacity-100"
                }
            ></div>
        </div>
    </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({className, ...props}, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden",
            className
        )}
        {...props}
    />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export {Tabs, TabsList, TabsTrigger, TabsContent}
