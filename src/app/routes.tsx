import React from "react";
import { createBrowserRouter } from "react-router";

import { WelcomeScreen } from "./components/WelcomeScreen";
import { Board } from "./components/Board";
import { AdDetail } from "./components/AdDetail";
import { FormScreen } from "./components/FormScreen";
import { OutcomeScreen } from "./components/OutcomeScreen";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: WelcomeScreen },
      { path: "board", Component: Board },
      { path: "ad/:adId", Component: AdDetail },
      { path: "ad/:adId/form", Component: FormScreen },
      { path: "ad/:adId/outcome", Component: OutcomeScreen },
      { path: "*", Component: WelcomeScreen },
    ],
  },
]);
