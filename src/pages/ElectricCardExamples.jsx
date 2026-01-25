import { ElectricCard, ElectricCardCorners, ElectricCardPulse, ElectricCardRotate } from "@/components/ui/electric-card";

/**
 * Electric Card Component Examples
 * 
 * This file demonstrates how to use the electric border card components
 * inspired by React Bits premium UI patterns.
 */

export default function ElectricCardExamples() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] p-8">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Electric Card Components</h1>
                    <p className="text-white/60">Premium animated border effects for your cards</p>
                </div>

                {/* Standard Electric Card */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">1. Standard Electric Border</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <ElectricCard className="p-8">
                            <h3 className="text-xl font-bold text-white mb-4">Animated Border</h3>
                            <p className="text-white/70">
                                This card features a smooth animated gradient border that flows continuously.
                                Perfect for highlighting important content.
                            </p>
                        </ElectricCard>

                        <ElectricCard
                            className="p-8"
                            borderColor="from-green-500 via-emerald-500 to-cyan-500"
                            glowColor="green"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Custom Colors</h3>
                            <p className="text-white/70">
                                You can customize the border colors to match your brand. This one uses
                                green and cyan tones.
                            </p>
                        </ElectricCard>
                    </div>
                </div>

                {/* Corner Accents Card */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">2. Corner Accents</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <ElectricCardCorners className="p-8">
                            <h3 className="text-xl font-bold text-white mb-4">Corner Highlights</h3>
                            <p className="text-white/70">
                                This variant features glowing corner accents that appear on hover,
                                creating a subtle but elegant effect.
                            </p>
                        </ElectricCardCorners>

                        <ElectricCardCorners className="p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                                    <span className="text-2xl">✨</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">With Icon</h3>
                            </div>
                            <p className="text-white/70">
                                Combine with icons and other elements for rich card designs.
                            </p>
                        </ElectricCardCorners>
                    </div>
                </div>

                {/* Pulsing Border Card */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">3. Pulsing Border</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <ElectricCardPulse className="p-8">
                            <h3 className="text-xl font-bold text-white mb-4">Pulse Effect</h3>
                            <p className="text-white/70">
                                A pulsing border that draws attention with its breathing animation.
                                Great for call-to-action cards.
                            </p>
                        </ElectricCardPulse>

                        <ElectricCardPulse className="p-8">
                            <h3 className="text-xl font-bold text-white mb-4">Feature Highlight</h3>
                            <ul className="space-y-2 text-white/70">
                                <li>✓ Premium animations</li>
                                <li>✓ Customizable colors</li>
                                <li>✓ Smooth transitions</li>
                                <li>✓ Performance optimized</li>
                            </ul>
                        </ElectricCardPulse>
                    </div>
                </div>

                {/* Rotating Gradient Card */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">4. Rotating Gradient</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <ElectricCardRotate className="p-8">
                            <h3 className="text-xl font-bold text-white mb-4">Slow Rotation</h3>
                            <p className="text-white/70">
                                The most eye-catching variant with a slowly rotating gradient border.
                                Perfect for hero sections or premium features.
                            </p>
                        </ElectricCardRotate>

                        <ElectricCardRotate className="p-8">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 mb-4">
                                    $99
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Premium Plan</h3>
                                <p className="text-white/70 mb-4">
                                    All features included
                                </p>
                                <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity">
                                    Get Started
                                </button>
                            </div>
                        </ElectricCardRotate>
                    </div>
                </div>

                {/* Usage Examples */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-white mb-6">Usage Examples</h2>
                    <ElectricCard className="p-8">
                        <h3 className="text-xl font-bold text-white mb-4">How to Use</h3>
                        <div className="space-y-4 text-white/70">
                            <div>
                                <p className="font-semibold text-white mb-2">1. Import the component:</p>
                                <code className="block bg-black/50 p-3 rounded-lg text-sm">
                                    {`import { ElectricCard } from "@/components/ui/electric-card";`}
                                </code>
                            </div>

                            <div>
                                <p className="font-semibold text-white mb-2">2. Use in your JSX:</p>
                                <code className="block bg-black/50 p-3 rounded-lg text-sm">
                                    {`<ElectricCard className="p-8">
  <h3>Your Content</h3>
  <p>Your description</p>
</ElectricCard>`}
                                </code>
                            </div>

                            <div>
                                <p className="font-semibold text-white mb-2">3. Customize colors:</p>
                                <code className="block bg-black/50 p-3 rounded-lg text-sm">
                                    {`<ElectricCard 
  borderColor="from-green-500 via-emerald-500 to-cyan-500"
  glowColor="green"
>
  {/* Your content */}
</ElectricCard>`}
                                </code>
                            </div>
                        </div>
                    </ElectricCard>
                </div>
            </div>
        </div>
    );
}
