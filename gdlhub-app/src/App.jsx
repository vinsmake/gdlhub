import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./routes/RootLayout";
import UsersPage from "./routes/UsersPage";
import UserDetail from "./routes/UserDetail";
import RestaurantsPage from "./routes/RestaurantsPage";
import RestaurantDetail from "./routes/RestaurantDetail";
import RestaurantPost from "./routes/RestaurantPost";
import RestaurantEdit from "./routes/RestaurantEdit";
import { RecomendationsPage } from "./routes/RecomendationsPage";
import { FollowsPage } from "./routes/FollowsPage";
import { FriendsPage } from "./routes/FriendsPage";
import { SavedPage } from "./routes/SavedPage";
import { SearchPage } from "./routes/SearchPage";
import CreateUserPage from "./routes/CreateUserPage";
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";
import { HomePage } from "./routes/HomePage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "users/create", element: <CreateUserPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "users/:uid", element: <UserDetail /> },
      { path: "restaurants", element: <RestaurantsPage /> },
      { path: "restaurants/:rid", element: <RestaurantDetail /> },
      { path: "restaurants/new", element: <RestaurantPost /> },
      { path: "/restaurants/:rid/edit", element: <RestaurantEdit />, },
      { path: "/recommendations", element: <RecomendationsPage /> },
      { path: "/follows", element: <FollowsPage /> },
      { path: "/friends", element: <FriendsPage /> },
      { path: "/saved", element: <SavedPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> }

    ],
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
