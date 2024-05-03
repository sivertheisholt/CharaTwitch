import React, { useContext } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { StatusCard } from "../components/cards/StatusCard";
import Alert from "react-bootstrap/esm/Alert";
import { v4 as uuidv4 } from "uuid";
import RingLoader from "react-spinners/RingLoader";
import { CustomScroll } from "react-custom-scroll";
import Container from "react-bootstrap/esm/Container";
import { TwitchDashboardContext } from "../contexts/dashboard/TwitchDashboardContext";
import { TwitchDashboardContextType } from "../types/context/dashboard/TwitchDashboardContextType";
import { AiDashboardContext } from "../contexts/dashboard/AiDashboardContext";
import { AiDashboardContextType } from "../types/context/dashboard/AiDashboardContextType";
import { CaiDashboardContext } from "../contexts/dashboard/CaiDashboardContext";
import { CaiDashboardContextType } from "../types/context/dashboard/CaiDashboardContextType";
import { OllamaDashboardContext } from "../contexts/dashboard/OllamaDashboardContext";
import { OllamaDashboardContextType } from "../types/context/dashboard/OllamaDashboardContextType";

export interface DashboardPageProps {}

const DashboardPageComponent = (props: DashboardPageProps) => {
	const { twitchMessages, twitchRedeems, twitchIrcStatus, twitchPubSubStatus, twitchAccountStatus } = useContext(
		TwitchDashboardContext
	) as TwitchDashboardContextType;
	const { aiProcessing, aiMessages } = useContext(AiDashboardContext) as AiDashboardContextType;
	const { caiAccountStatus } = useContext(CaiDashboardContext) as CaiDashboardContextType;
	const { ollamaStatus } = useContext(OllamaDashboardContext) as OllamaDashboardContextType;

	return (
		<>
			<Container style={{ height: "30%" }}>
				<Row className="h-100 justify-content-center align-items-center">
					<Col>
						<StatusCard
							active={twitchAccountStatus && twitchIrcStatus && twitchPubSubStatus}
							pngName="twitch-logo.png"
						/>
					</Col>
					<Col>
						<StatusCard active={caiAccountStatus} pngName="cai.ico" />
					</Col>
					<Col>
						<StatusCard active={ollamaStatus} pngName="ollama.png" />
					</Col>
				</Row>
			</Container>
			<Container style={{ height: "70%" }}>
				<Row style={{ height: "50%" }}>
					<Col style={{ height: "100%" }}>
						<h1>Twitch chat</h1>
						<hr className="hr" />
						<CustomScroll heightRelativeToParent="calc(100% - 85px)">
							{twitchMessages.map((twitch) => (
								<Alert key={uuidv4()} variant={"primary"}>
									{twitch.username}: {twitch.message}
								</Alert>
							))}
						</CustomScroll>
					</Col>
					<Col md="auto">
						<div style={{ height: "100%" }} className="vr"></div>
					</Col>
					<Col style={{ height: "100%", overflowY: "auto" }}>
						<h1>Twitch Redeems</h1>
						<hr className="hr" />
						<CustomScroll heightRelativeToParent="calc(100% - 85px)">
							{twitchRedeems.map((redeem) => (
								<Alert key={uuidv4()} variant={"primary"}>
									{redeem.username}: {redeem.reward}
								</Alert>
							))}
						</CustomScroll>
					</Col>
				</Row>
				<Row style={{ height: "50%" }}>
					<Col style={{ height: "100%" }}>
						<h1>Character</h1>
						<hr className="hr" />
						<CustomScroll heightRelativeToParent="calc(100% - 85px)">
							{aiMessages.map((message) => (
								<Alert key={uuidv4()} variant={"primary"}>
									{message}
								</Alert>
							))}
						</CustomScroll>
					</Col>
					<Col md="auto">
						<div style={{ height: "100%" }} className="vr"></div>
					</Col>
					<Col style={{ height: "100%" }}>
						<h1>Status</h1>
						<hr className="hr" />
						<div style={{ height: "calc(100% - 71px)" }} className="d-flex justify-content-center align-items-center">
							<RingLoader color="#36d7b7" loading={aiProcessing} size={150} aria-label="Loading Spinner" />
						</div>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export const DashboardPage = React.memo(DashboardPageComponent);
