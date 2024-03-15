import React from "react";
import ReactDOM from "react-dom/client";
import SceneViewer from "pages/SceneViewer";

import "styles/universal.scss";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SceneViewer />
  </React.StrictMode>
);
