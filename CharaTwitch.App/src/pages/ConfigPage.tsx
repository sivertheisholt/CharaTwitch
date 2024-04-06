import React from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { CaiConfig } from "../components/config/CaiConfig";
import { TwitchConfig } from "../components/config/TwitchConfig";

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
					<CaiConfig />
				</Col>
			</Row>
		</>
	);
};

export const ConfigPage = React.memo(ConfigPageComponent);
