import React from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { ErrorPage } from "./pages/ErrorPage";
import { HomePage } from "./pages/HomePage";
import { DefaultLayout } from "./components/layouts/DefaultLayout";
import { ConfigPage } from "./pages/ConfigPage";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RouterProps {}

const RouterComponent = (props: RouterProps) => {
	const router = createHashRouter([
		{
			path: "/",
			element: <DefaultLayout children={<HomePage />} />,
			errorElement: <ErrorPage />,
		},
		{
			path: "/config",
			element: <DefaultLayout children={<ConfigPage />} />,
			errorElement: <ErrorPage />,
		},
	]);
	return <RouterProvider router={router}></RouterProvider>;
};

export const Router = React.memo(RouterComponent);
