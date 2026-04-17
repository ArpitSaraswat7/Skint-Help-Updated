import * as React from "react"

import { cn } from "@/lib/utils"
import { Meteors } from "@/components/ui/meteors"

const cardVariants = {
    default: "rounded-lg border bg-card text-card-foreground shadow-sm",
    glass: "glass-card",
    elevated: "rounded-lg bg-card text-card-foreground shadow-depth hover:shadow-depth-hover transition-shadow duration-300",
    premium: "glass-premium",
}

const Card = React.forwardRef(({ className, variant = "default", meteors = true, meteorCount = 8, ...props }, ref) => {
    const safeClass = cardVariants[variant] || cardVariants.default

    if (process.env.NODE_ENV !== "production" && !cardVariants[variant]) {
        console.warn(`[Card] Invalid variant "${variant}" — falling back to "default".`)
    }

    return (
        <div
            ref={ref}
            className={cn("relative overflow-hidden", safeClass, className)}
            {...props}
        >
            {props.children}
            {meteors && <Meteors number={meteorCount} />}
        </div>
    )
})
Card.displayName = "Card"

const GlassCard = React.forwardRef(({ className, hoverable = false, meteors = true, meteorCount = 8, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative overflow-hidden",
            "backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_0_0_rgba(255,255,255,0.1)]",
            hoverable && "hover:bg-white/8 hover:border-white/15 hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)] transition-all duration-300",
            className
        )}
        {...props}
    >
        {props.children}
        {meteors && <Meteors number={meteorCount} />}
    </div>
))
GlassCard.displayName = "GlassCard"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, GlassCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
