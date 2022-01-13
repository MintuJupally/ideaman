import { Navigate } from "react-router-dom";

import Home from "./components/Home";
import Board from "./components/Board";

const routes = [
  {
    path: "/",
    children: [
      { path: "/boards", element: <Home /> },
      { path: "/board", element: <Board /> },
      { path: "/board/:id", element: <Board /> },
      { path: "/", element: <Navigate to="/boards" replace /> },
      { path: "*", element: <Navigate to="/boards" replace /> },
    ],
  },
];

export default routes;
