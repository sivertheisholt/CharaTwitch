import React from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { CaiConfig } from "../components/config/CaiConfig";
import { TwitchConfig } from "../components/config/TwitchConfig";

export interface ConfigPageProps {}

const ConfigPageComponent = (props: ConfigPageProps) => {
	return (
		<>
			<Row style={{ height: "100%" }}>
				<Col>
					<TwitchConfig />
				</Col>
				<Col md="auto">
					<div style={{ height: "100%" }} className="vr"></div>
				</Col>
				<Col>
					<CaiConfig />
				</Col>
			</Row>
		</>
	);
};

export const ConfigPage = React.memo(ConfigPageComponent);
