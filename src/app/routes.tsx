import React from "react";
import { createBrowserRouter } from "react-router";

import { WelcomeScreen } from "./components/WelcomeScreen";
import { Board } from "./components/Board";
import { AdDetail } from "./components/AdDetail";
import { FormScreen } from "./components/FormScreen";
import { EvidenceScreen } from "./components/EvidenceScreen";
import { OutcomeScreen } from "./components/OutcomeScreen";
import { ChecklistScreen } from "./components/ChecklistScreen";
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
      { path: "ad/:adId/evidence", Component: EvidenceScreen },
      { path: "ad/:adId/outcome/:outcomeType", Component: OutcomeScreen },
      { path: "checklist", Component: ChecklistScreen },
      { path: "*", Component: WelcomeScreen },
    ],
  },
]);
