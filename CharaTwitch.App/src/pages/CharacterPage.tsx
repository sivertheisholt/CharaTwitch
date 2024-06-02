import React, { useContext, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Row from "react-bootstrap/esm/Row";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { CharacterContext } from "../contexts/character/CharacterContext";
import { CharacterContextType } from "../types/context/character/CharacterContextType";
import { SocketContext } from "../contexts/SocketContext";
import { SocketContextType } from "../types/context/SocketContextType";
import Alert from "react-bootstrap/esm/Alert";
import {
	CHARACTER_ASK_QUESTION,
	CHARACTER_MINIMUM_TIME_BETWEEN_TALKING_CHANGE,
	CHARACTER_RANDOM_TALKING_CHANGE,
	CHARACTER_RANDOM_TALKING_FREQUENCY_CHANGE,
	CHARACTER_TTS,
	CHARACTER_VOICE_ENABLED_CHANGE,
	CHARACTER_WELCOME_NEW_VIEWERS_CHANGE,
	CHARACTER_WELCOME_RAIDERS_CHANGE,
	CHARACTER_WELCOME_STRANGERS_CHANGE,
} from "../socket/CharacterEvents";
import { VoiceContext } from "../contexts/voice/VoiceContext";
import { VoiceContextType } from "../types/context/voice/VoiceContextType";

export interface CharacterPageProps {}

const CharacterPageComponent = (props: CharacterPageProps) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const {
		characterSelectedRedeem,
		setCharacterSelectedRedeem,
		characterQuestion,
		setCharacterQuestion,
		characterTTS,
		setCharacterTTS,
		characterRandomTalking,
		setCharacterRandomTalking,
		characterWelcomeStrangers,
		setCharacterWelcomeStrangers,
		characterWelcomeRaiders,
		setCharacterWelcomeRaiders,
		characterRandomTalkingFrequency,
		setCharacterRandomTalkingFrequency,
		characterWelcomeNewViewers,
		setCharacterWelcomeNewViewers,
		characterMinimumTimeBetweenTalking,
		setCharacterMinimumTimeBetweenTalking,
	} = useContext(CharacterContext) as CharacterContextType;
	const { voiceEnabled, handleVoiceEnabled } = useContext(VoiceContext) as VoiceContextType;
	const [startTTS, setStartTTS] = useState(false);
	const [startQuestion, setStartQuestion] = useState(false);

	const handleVoiceEnabledChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		socket.emit(CHARACTER_VOICE_ENABLED_CHANGE, checked);
		handleVoiceEnabled(checked);
	};

	const handleRandomTalkingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		socket.emit(CHARACTER_RANDOM_TALKING_CHANGE, checked);
		setCharacterRandomTalking(checked);
	};
	const handleWelcomeStrangersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		socket.emit(CHARACTER_WELCOME_STRANGERS_CHANGE, checked);
		setCharacterWelcomeStrangers(checked);
	};
	const handleWelcomeRaidersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		socket.emit(CHARACTER_WELCOME_RAIDERS_CHANGE, checked);
		setCharacterWelcomeRaiders(checked);
	};
	const handleWelcomeNewViewersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		socket.emit(CHARACTER_WELCOME_NEW_VIEWERS_CHANGE, checked);
		setCharacterWelcomeNewViewers(checked);
	};
	const handleRandomTalkingFrequencyChange = (value: number) => {
		socket.emit(CHARACTER_RANDOM_TALKING_FREQUENCY_CHANGE, value);
		setCharacterRandomTalkingFrequency(value);
	};
	const handleTTSChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setCharacterTTS(value);
	};
	const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setCharacterQuestion(value);
	};
	const handleSelectRedeem = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedRedeem = event.target.value;
		setCharacterSelectedRedeem(selectedRedeem);
	};
	const handleMinimumTimeBetweenTalkingChange = (value: number) => {
		socket.emit(CHARACTER_MINIMUM_TIME_BETWEEN_TALKING_CHANGE, value);
		setCharacterMinimumTimeBetweenTalking(value);
	};

	const handleCharacterTTS = () => {
		socket.emit(CHARACTER_TTS, characterTTS);
		setStartTTS(true);
		setTimeout(() => setStartTTS(false), 5000);
	};

	const handleAskQuestion = () => {
		socket.emit(CHARACTER_ASK_QUESTION, characterQuestion);
		setStartQuestion(true);
		setTimeout(() => setStartQuestion(false), 5000);
	};

	return (
		<>
			<Row className="h-100">
				<Col>
					<h1>Actions</h1>
					<hr className="hr" />
					<Card style={{ display: "none" }} className="mb-2" data-bs-theme="dark">
						<Card.Body>
							<label className="fs-6">
								<strong>Redeems</strong>
							</label>
							<Form.Select
								className="mb-2"
								data-bs-theme="light"
								size="sm"
								aria-label="Default select example"
								value={characterSelectedRedeem}
								onChange={handleSelectRedeem}
							></Form.Select>
							<div className="d-flex justify-content-center">
								<Button className="w-100" variant="primary" size="sm">
									Redeem selected
								</Button>
								<Button className="ms-2 w-100" variant="primary" size="sm">
									Redeem random
								</Button>
							</div>
						</Card.Body>
					</Card>

					<Card className="mb-2" data-bs-theme="dark">
						<Card.Body>
							<label className="fs-6">
								<strong>Question</strong>
							</label>
							<InputGroup className="mb-3" size="sm">
								<Form.Control
									data-bs-theme="light"
									style={{ height: "100px" }}
									as="textarea"
									placeholder="Question"
									maxLength={250}
									value={characterQuestion}
									onChange={handleQuestionChange}
								/>
							</InputGroup>
							<div className="d-grid gap-2 mt-4">
								{startQuestion ? (
									<Alert variant={"success"}>Started!</Alert>
								) : (
									<Button variant="primary" size="sm" onClick={handleAskQuestion}>
										Ask question
									</Button>
								)}
							</div>
						</Card.Body>
					</Card>

					<Card data-bs-theme="dark">
						<Card.Body>
							<label className="fs-6">
								<strong>Text To Speech</strong>
							</label>
							<InputGroup className="mb-3" size="sm">
								<Form.Control
									data-bs-theme="light"
									style={{ height: "100px" }}
									as="textarea"
									placeholder="Text to speech"
									maxLength={1000}
									value={characterTTS}
									onChange={handleTTSChange}
								/>
							</InputGroup>
							<div className="d-grid gap-2 mt-4">
								{startTTS ? (
									<Alert variant={"success"}>Started!</Alert>
								) : (
									<Button variant="primary" size="sm" onClick={handleCharacterTTS}>
										Start
									</Button>
								)}
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md="auto">
					<div className="vr h-100"></div>
				</Col>
				<Col>
					<h1>Behavior</h1>
					<hr className="hr" />

					<Card className="mb-2" data-bs-theme="dark">
						<Card.Body>
							<Container>
								<Row>
									<Col>
										<label className="fs-6">
											<strong>Speech to text</strong>
										</label>
										<InputGroup data-bs-theme="light" className="mb-3" size="sm">
											<Form.Check onChange={handleVoiceEnabledChange} checked={voiceEnabled} />
										</InputGroup>
									</Col>
									<Col>
										<label className="fs-6">
											<strong>Random talking</strong>
										</label>
										<InputGroup data-bs-theme="light" className="mb-3" size="lg">
											<Form.Check onChange={handleRandomTalkingChange} checked={characterRandomTalking} />
										</InputGroup>
									</Col>
								</Row>
								<Row>
									<Col>
										<label className="fs-6">
											<strong>Welcome strangers</strong>
										</label>
										<InputGroup data-bs-theme="light" className="mb-3" size="sm">
											<Form.Check onChange={handleWelcomeStrangersChange} checked={characterWelcomeStrangers} />
										</InputGroup>
									</Col>
									<Col>
										<label className="fs-6">
											<strong>Welcome raiders</strong>
										</label>
										<InputGroup data-bs-theme="light" className="mb-3" size="sm">
											<Form.Check onChange={handleWelcomeRaidersChange} checked={characterWelcomeRaiders} />
										</InputGroup>
									</Col>
								</Row>
								<Row>
									<Col>
										<label className="fs-6">
											<strong>Welcome new viewers</strong>
										</label>
										<InputGroup data-bs-theme="light" className="mb-3" size="sm">
											<Form.Check onChange={handleWelcomeNewViewersChange} checked={characterWelcomeNewViewers} />
										</InputGroup>
									</Col>
								</Row>
							</Container>
						</Card.Body>
					</Card>

					<Card className="mb-2" data-bs-theme="dark">
						<Card.Body className="p-2">
							<label className="fs-6">
								<strong>Talking frequency</strong>
							</label>
							<div className="row w-100 m-0">
								<span style={{ minWidth: "50px" }} className="col-auto p-0">
									{characterRandomTalkingFrequency}%
								</span>
								<Slider
									className="mt-2 col"
									max={100}
									min={0}
									step={5}
									value={characterRandomTalkingFrequency}
									onChange={handleRandomTalkingFrequencyChange}
								/>
							</div>

							<label className="fs-6">
								<strong>Minimum minutes between talking</strong>
							</label>
							<div className="row w-100 m-0">
								<span style={{ minWidth: "50px" }} className="col-auto p-0">
									{characterMinimumTimeBetweenTalking}m
								</span>
								<Slider
									className="col mt-2"
									max={30}
									min={0}
									step={1}
									value={characterMinimumTimeBetweenTalking}
									onChange={handleMinimumTimeBetweenTalkingChange}
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export const CharacterPage = React.memo(CharacterPageComponent);
