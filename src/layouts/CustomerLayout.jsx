import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedOutlet } from "@/components/AnimatedOutlet";

export function CustomerLayout() {
    return (
        <div className="min-h-screen font-sans antialiased flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24 pb-12">
                <AnimatedOutlet />
            </main>
            <Footer />
        </div>
    );
}
