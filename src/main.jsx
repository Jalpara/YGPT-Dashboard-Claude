import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import YGPTDashboard from "./YGPTDashboard.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <YGPTDashboard />
  </StrictMode>
);
