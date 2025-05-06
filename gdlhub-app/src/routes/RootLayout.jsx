import { Outlet } from "react-router-dom";
import { Screen } from "@ui/Screen";
import { Dashboard } from "@ui/Dashboard";

export default function RootLayout() {
  return (
    <Screen>
      <Dashboard>
        <Outlet />
      </Dashboard>
    </Screen>
  );
}
