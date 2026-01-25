import { cn } from "@/lib/utils";

export function ElectricCard({
    children,
    className,
    borderColor = "from-cyan-500 via-blue-500 to-purple-500",
    glowColor = "cyan",
    animated = true,
}) {
    return (
        <div className="relative group">
            {/* Animated Electric Border */}
            <div
                className={cn(
                    "absolute -inset-[2px] rounded-2xl opacity-75 blur-sm transition-all duration-500",
                    animated && "animate-electric-border",
                    `bg-gradient-to-r ${borderColor}`,
                    "group-hover:opacity-100 group-hover:blur-md"
                )}
                style={{
                    background: animated
                        ? `linear-gradient(90deg, 
                hsl(var(--${glowColor}-500) / 0.8), 
                hsl(var(--blue-500) / 0.8), 
                hsl(var(--purple-500) / 0.8), 
                hsl(var(--${glowColor}-500) / 0.8)
              )`
                        : undefined,
                    backgroundSize: animated ? "200% 200%" : undefined,
                    animation: animated ? "electric-border 3s linear infinite" : undefined,
                }}
            />

            {/* Card Content */}
            <div
                className={cn(
                    "relative rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10",
                    "transition-all duration-300",
                    "group-hover:bg-black/80 group-hover:border-white/20",
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
}

// Variant with corner accents
export function ElectricCardCorners({
    children,
    className,
    accentColor = "cyan-500",
}) {
    return (
        <div className="relative group">
            {/* Corner Accents */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-cyan-500 rounded-tl-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-purple-500 rounded-tr-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-purple-500 rounded-bl-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-cyan-500 rounded-br-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

            {/* Animated Glow */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 animate-pulse" />

            {/* Card Content */}
            <div
                className={cn(
                    "relative rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10",
                    "transition-all duration-300",
                    "group-hover:bg-black/80 group-hover:border-white/20",
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
}

// Variant with pulsing border
export function ElectricCardPulse({
    children,
    className,
    pulseColor = "cyan",
}) {
    return (
        <div className="relative group">
            {/* Pulsing Border Layers */}
            <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-50 blur-sm animate-pulse" />
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-75" />

            {/* Card Content */}
            <div
                className={cn(
                    "relative rounded-2xl bg-black/90 backdrop-blur-xl",
                    "transition-all duration-300",
                    "group-hover:bg-black/80",
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
}

// Variant with rotating gradient
export function ElectricCardRotate({
    children,
    className,
}) {
    return (
        <div className="relative group">
            {/* Rotating Gradient Border */}
            <div className="absolute -inset-[2px] rounded-2xl opacity-75 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-pink-500 animate-spin-slow" />
            </div>

            {/* Card Content */}
            <div
                className={cn(
                    "relative rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10",
                    "transition-all duration-300",
                    "group-hover:bg-black/80 group-hover:border-white/20",
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
}
