import React from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { ErrorPage } from "./pages/ErrorPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DefaultLayout } from "./components/layouts/DefaultLayout";
import { ConfigPage } from "./pages/ConfigPage";
import { CharacterPage } from "./pages/CharacterPage";
import { OllamaPage } from "./pages/OllamaPage";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RouterProps {}

const RouterComponent = (props: RouterProps) => {
	const router = createHashRouter([
		{
			path: "/",
			element: <DefaultLayout children={<DashboardPage />} />,
			errorElement: <ErrorPage />,
		},
		{
			path: "/character",
			element: <DefaultLayout children={<CharacterPage />} />,
			errorElement: <ErrorPage />,
		},
		{
			path: "/ollama",
			element: <DefaultLayout children={<OllamaPage />} />,
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
