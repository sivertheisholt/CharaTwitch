import React, { useContext } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { StatusCard } from "../components/cards/StatusCard";
import Alert from "react-bootstrap/esm/Alert";
import { v4 as uuidv4 } from "uuid";
import { HomeContext } from "../contexts/HomeContext";
import { HomeContextType } from "../types/HomeContextType";
import RingLoader from "react-spinners/RingLoader";
import { CustomScroll } from "react-custom-scroll";
import Container from "react-bootstrap/esm/Container";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomePageProps {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HomePageComponent = (props: HomePageProps) => {
	const {
		twitchMessages,
		twitchRedeems,
		twitchIrcStatus,
		twitchPubSubStatus,
		twitchAccountStatus,
		caiAccountStatus,
		caiMessages,
		caiProcessing,
	} = useContext(HomeContext) as HomeContextType;

	return (
		<>
			<Container style={{ height: "30%" }}>
				<Row className="h-100 justify-content-center align-items-center">
					<Col>
						<StatusCard
							active={twitchAccountStatus}
							title="Twitch Account"
							pngName="twitch-logo.png"
						/>
					</Col>
					<Col>
						<StatusCard
							active={twitchIrcStatus}
							title="Twitch IRC"
							pngName="twitch-logo.png"
						/>
					</Col>
					<Col>
						<StatusCard
							active={twitchPubSubStatus}
							title="Twitch Redeems"
							pngName="twitch-logo.png"
						/>
					</Col>
					<Col>
						<StatusCard
							active={caiAccountStatus}
							title="Character AI"
							pngName="cai.ico"
						/>
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
						<h1>Character AI</h1>
						<hr className="hr" />
						<CustomScroll heightRelativeToParent="calc(100% - 85px)">
							{caiMessages.map((message) => (
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
						<div
							style={{ height: "calc(100% - 71px)" }}
							className="d-flex justify-content-center align-items-center"
						>
							<RingLoader
								color="#36d7b7"
								loading={caiProcessing}
								size={150}
								aria-label="Loading Spinner"
							/>
						</div>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export const HomePage = React.memo(HomePageComponent);
