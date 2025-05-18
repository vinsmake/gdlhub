import { createBrowserRouter, RouterProvider} from "react-router-dom";
import RootLayout from "./routes/RootLayout";
import UsersPage from "./routes/UsersPage";
import UserDetail from "./routes/UserDetail";
import RestaurantsPage from "./routes/RestaurantsPage";
import RestaurantDetail from "./routes/RestaurantDetail";
import { usersLoader } from "./loaders/usersLoader";
import { userDetailLoader } from "./loaders/userDetailLoader";
import { restaurantsLoader } from "./loaders/restaurantsLoaders";
import { restaurantDetailLoader } from "./loaders/restaurantDetailLoaders";
import { homeLoader } from "./loaders/homeLoader";
import HomePage from "./routes/HomePage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage />, loader: homeLoader },
      { path: "users", element: <UsersPage />, loader: usersLoader },
      { path: "users/:uid", element: <UserDetail />, loader: userDetailLoader },
      { path: "restaurants", element: <RestaurantsPage />, loader: restaurantsLoader },
      { path: "restaurants/:rid", element: <RestaurantDetail />, loader: restaurantDetailLoader },
    ],
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
