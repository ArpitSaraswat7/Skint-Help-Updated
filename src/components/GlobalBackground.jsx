import { useEffect, useState } from 'react';
import FloatingLines from './ui/FloatingLines';

export function GlobalBackground() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) {
        return (
            <div className="fixed inset-0 w-full h-screen z-0 bg-gradient-to-br from-[#0a1510] to-[#121c17]" style={{ pointerEvents: 'none' }} />
        );
    }

    return (
        <div className="fixed inset-0 w-full h-screen z-0" style={{ pointerEvents: 'none', opacity: 0.8 }}>
            <FloatingLines
                enabledWaves={["top", "middle", "bottom"]}
                lineCount={6}
                lineDistance={12}
                bendRadius={5}
                bendStrength={-0.5}
                interactive={false}
                parallax={false}
                animationSpeed={0.8}
                mixBlendMode="screen"
                linesGradient={[
                    "#22c55e",
                    "#14b8a6",
                    "#06b6d4",
                    "#3b82f6",
                    "#a855f7",
                    "#ec4899",
                ]}
            />
        </div>
    );
}
