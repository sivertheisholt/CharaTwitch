import React from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { TwitchConfig } from "../components/config/TwitchConfig";
import { AiConfig } from "../components/config/AiConfig";

export interface ConfigPageProps {}

const ConfigPageComponent = (props: ConfigPageProps) => {
	return (
		<>
			<Row className="h-100">
				<Col>
					<TwitchConfig />
				</Col>
				<Col md="auto">
					<div className="vr h-100"></div>
				</Col>
				<Col>
					<AiConfig />
				</Col>
			</Row>
		</>
	);
};

export const ConfigPage = React.memo(ConfigPageComponent);
