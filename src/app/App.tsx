import { RouterProvider } from "react-router";
import { router } from "./routes";
import { InspectionProvider } from "./state/InspectionContext";

export default function App() {
  return (
    <InspectionProvider>
      <RouterProvider router={router} />
    </InspectionProvider>
  );
}
