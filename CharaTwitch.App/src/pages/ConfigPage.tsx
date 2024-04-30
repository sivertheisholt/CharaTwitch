import React from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { TwitchConfig } from "../components/config/TwitchConfig";
import { OllamaConfig } from "../components/config/OllamaConfig";
import Card from "react-bootstrap/esm/Card";
import { ElevenlabsConfig } from "../components/config/ElevenlabsConfig";

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
					<h1>AI config</h1>
					<hr className="hr" />
					<Card className="mb-2" data-bs-theme="dark">
						<Card.Body>
							<OllamaConfig />
						</Card.Body>
					</Card>
					<Card className="mb-2" data-bs-theme="dark">
						<Card.Body>
							<ElevenlabsConfig />
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export const ConfigPage = React.memo(ConfigPageComponent);
