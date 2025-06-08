import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import RestaurantPost from "./routes/RestaurantPost";
import RestaurantEdit from "./routes/RestaurantEdit";
import { restaurantEditLoader } from "./loaders/restaurantEditLoader";
import { RecomendationsPage } from "./routes/RecomendationsPage";
import { FollowsPage } from "./routes/FollowsPage";
import { FriendsPage } from "./routes/FriendsPage";
import { SavedPage } from "./routes/SavedPage";


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
      { path: "restaurants/new", element: <RestaurantPost /> },
      { path: "/restaurants/:rid/edit", element: <RestaurantEdit />, loader: restaurantEditLoader, },
      { path: "/recommendations", element: <RecomendationsPage /> },
      { path: "/follows", element: <FollowsPage /> },
      { path: "/friends", element: <FriendsPage /> },
      { path: "/saved", element: <SavedPage /> }
    ],
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
