import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./pages/ErrorPage";
import { HomePage } from "./pages/HomePage";
import { DefaultLayout } from "./components/layouts/DefaultLayout";

export interface RouterProps {}

const RouterComponent = (props: RouterProps) => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultLayout children={<HomePage />} />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/config",
      element: <DefaultLayout children={<HomePage />} />,
      errorElement: <ErrorPage />,
    },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
};

export const Router = React.memo(RouterComponent);
