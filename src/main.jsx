import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { validateEnv } from "./lib/env";

// Validate environment variables on app start
validateEnv();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </StrictMode>
);
