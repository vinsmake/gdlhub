import { RestaurantsList } from "../pages/RestaurantsPage";
import { Outlet } from "react-router-dom";

export const DashboardMain = ({ children }) => {
  return (
    <div className="w-4/5 bg-neutral-800 rounded-3xl p-6 text-white space-y-6">
      {children}
      hasta este punto, esta funcionando
      <RestaurantsList />
      <Outlet />
    </div>
  );
};
