import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useMemo } from "react";

export const Meteors = ({ number, className }) => {
    const meteorCount = number || 20;

    const meteorData = useMemo(() => {
        return Array.from({ length: meteorCount }, (_, idx) => ({
            position: idx * (800 / meteorCount) - 400,
            delay: Math.random() * 5,
            duration: Math.floor(Math.random() * (10 - 5) + 5),
        }));
    }, [meteorCount]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {meteorData.map((meteor, idx) => (
                <span
                    key={"meteor" + idx}
                    className={cn(
                        "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[215deg] rounded-[9999px]",
                        "bg-[#DBEBC0]/60 shadow-[0_0_0_1px_rgba(219,235,192,0.1)]",
                        "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#DBEBC0]/40 before:to-transparent before:content-['']",
                        className,
                    )}
                    style={{
                        top: "-40px",
                        left: meteor.position + "px",
                        animationDelay: meteor.delay + "s",
                        animationDuration: meteor.duration + "s",
                    }}
                />
            ))}
        </motion.div>
    );
};
