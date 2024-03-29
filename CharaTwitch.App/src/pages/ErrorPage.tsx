import React from "react";
import { useRouteError } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ErrorPageProps {}

const ErrorPageComponent = (props: ErrorPageProps) => {
	const error: any = useRouteError();
	return (
		<div id="error-page">
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				<i>{error.statusText || error.message}</i>
			</p>
		</div>
	);
};

export const ErrorPage = React.memo(ErrorPageComponent);
