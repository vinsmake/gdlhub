import { Screen } from "@ui/Screen";
import { Dashboard } from "@ui/Dashboard";
import { TokenStatusBanner } from "../components/TokenStatusBanner";

export default function RootLayout() {
  return (
    <Screen>
      <TokenStatusBanner />
      <Dashboard>

      </Dashboard>
    </Screen>
  );
}
