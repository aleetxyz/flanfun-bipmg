import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SceneViewer from "pages/SceneViewer";
import SessionCode from "pages/SessionCode";

import "./index.css";
import "styles/universal.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SceneViewer />,
  },
  {
    path: "/:uuid",
    element: <SceneViewer />,
  },
  {
    path: "/session",
    element: <SessionCode />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
