import FloatingLines from './ui/FloatingLines';

export function GlobalBackground() {
    return (
        <div className="fixed inset-0 w-full h-screen z-0" style={{ pointerEvents: 'none', opacity: 0.8 }}>
            <FloatingLines
                enabledWaves={["top", "middle", "bottom"]}
                lineCount={6}  // Reduced from 10 to 6 for better performance
                lineDistance={12}
                bendRadius={5}
                bendStrength={-0.5}
                interactive={false}
                parallax={true}
                animationSpeed={0.8}  // Reduced from 1.2 to 0.8 for smoother performance
                mixBlendMode="screen"
                linesGradient={[
                    "#22c55e", // brighter green
                    "#14b8a6", // teal-500
                    "#06b6d4", // cyan-500
                    "#3b82f6", // blue-500
                    "#a855f7", // brighter purple
                    "#ec4899", // pink
                ]}
            />
        </div>
    );
}
