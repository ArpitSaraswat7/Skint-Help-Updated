import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function CustomerLayout() {
    return (
        <div className="min-h-screen font-sans antialiased flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24 pb-12">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
