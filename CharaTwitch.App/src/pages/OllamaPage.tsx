import Slider from "rc-slider/lib/Slider";
import React, { useContext } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { OllamaParametersContext } from "../contexts/ollama/OllamaParametersContext";
import { SocketContextType } from "../types/context/SocketContextType";
import { SocketContext } from "../contexts/SocketContext";
import { OllamaParametersContextType } from "../types/context/ollama/OllamaParametersContextType";
import {
	OLLAMA_PARAMETERS_MIROSTAT_CHANGE,
	OLLAMA_PARAMETERS_MIROSTAT_ETA_CHANGE,
	OLLAMA_PARAMETERS_NUM_CTX_CHANGE,
	OLLAMA_PARAMETERS_REPEAT_LAST_N_CHANGE,
	OLLAMA_PARAMETERS_REPEAT_PENALTY_CHANGE,
	OLLAMA_PARAMETERS_TEMPERATURE_CHANGE,
	OLLAMA_PARAMETERS_SEED_CHANGE,
	OLLAMA_PARAMETERS_TFS_Z_CHANGE,
	OLLAMA_PARAMETERS_KEEP_ALIVE_CHANGE,
	OLLAMA_PARAMETERS_ENABLE_OVERRIDE_CHANGE,
	OLLAMA_PARAMETERS_NUM_PREDICT_CHANGE,
	OLLAMA_PARAMETERS_TOP_K_CHANGE,
	OLLAMA_PARAMETERS_TOP_P_CHANGE,
	OLLAMA_PARAMETERS_SYSTEM_MESSAGE_CHANGE,
} from "../socket/OllamaParametersEvents";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";

export interface OllamaPageProps {}

const OllamaPageComponent = (props: OllamaPageProps) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const {
		ollamaParametersMiroStat,
		setOllamaParametersMiroStat,
		ollamaParametersMiroStatEta,
		setOllamaParametersMiroStatEta,
		ollamaParametersNumCtx,
		setOllamaParametersNumCtx,
		ollamaParametersRepeatLastN,
		setOllamaParametersRepeatLastN,
		ollamaParametersRepeatPenalty,
		setOllamaParametersRepeatPenalty,
		ollamaParametersTemperature,
		setOllamaParametersTemperature,
		ollamaParametersSeed,
		setOllamaParametersSeed,
		ollamaParametersTfsZ,
		setOllamaParametersTfsZ,
		ollamaParametersNumPredict,
		setOllamaParametersNumPredict,
		ollamaParametersTopK,
		setOllamaParametersTopK,
		ollamaParametersTopP,
		setOllamaParametersTopP,
		ollamaParametersEnableOverride,
		setOllamaParametersEnableOverride,
		ollamaParametersKeepAlive,
		setOllamaParametersKeepAlive,
		ollamaSystemMessage,
		setOllamaSystemMessage,
	} = useContext(OllamaParametersContext) as OllamaParametersContextType;

	const handleKeepAliveChange = (value: number) => {
		setOllamaParametersKeepAlive(value);
		socket.emit(OLLAMA_PARAMETERS_KEEP_ALIVE_CHANGE, value);
	};

	const handleEnableOverrideChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		setOllamaParametersEnableOverride(checked);
		socket.emit(OLLAMA_PARAMETERS_ENABLE_OVERRIDE_CHANGE, checked);
	};

	const handleMiroStatChange = (value: number) => {
		setOllamaParametersMiroStat(value);
		socket.emit(OLLAMA_PARAMETERS_MIROSTAT_CHANGE, value);
	};
	const handleMiroStatEtaChange = (value: number) => {
		setOllamaParametersMiroStatEta(value);
		socket.emit(OLLAMA_PARAMETERS_MIROSTAT_ETA_CHANGE, value);
	};
	const handleNumCtxChange = (value: number) => {
		setOllamaParametersNumCtx(value);
		socket.emit(OLLAMA_PARAMETERS_NUM_CTX_CHANGE, value);
	};
	const handleRepeatLastNChange = (value: number) => {
		setOllamaParametersRepeatLastN(value);
		socket.emit(OLLAMA_PARAMETERS_REPEAT_LAST_N_CHANGE, value);
	};
	const handleRepeatPenaltyChange = (value: number) => {
		setOllamaParametersRepeatPenalty(value);
		socket.emit(OLLAMA_PARAMETERS_REPEAT_PENALTY_CHANGE, value);
	};
	const handleTemperatureChange = (value: number) => {
		setOllamaParametersTemperature(value);
		socket.emit(OLLAMA_PARAMETERS_TEMPERATURE_CHANGE, value);
	};
	const handleSeedChange = (value: number) => {
		setOllamaParametersSeed(value);
		socket.emit(OLLAMA_PARAMETERS_SEED_CHANGE, value);
	};
	const handleTfsZChange = (value: number) => {
		setOllamaParametersTfsZ(value);
		socket.emit(OLLAMA_PARAMETERS_TFS_Z_CHANGE, value);
	};
	const handleNumPredictChange = (value: number) => {
		setOllamaParametersNumPredict(value);
		socket.emit(OLLAMA_PARAMETERS_NUM_PREDICT_CHANGE, value);
	};
	const handleTopKChange = (value: number) => {
		setOllamaParametersTopK(value);
		socket.emit(OLLAMA_PARAMETERS_TOP_K_CHANGE, value);
	};
	const handleTopPChange = (value: number) => {
		setOllamaParametersTopP(value);
		socket.emit(OLLAMA_PARAMETERS_TOP_P_CHANGE, value);
	};
	const handleSystemMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setOllamaSystemMessage(value);
		socket.emit(OLLAMA_PARAMETERS_SYSTEM_MESSAGE_CHANGE, value);
	};

	return (
		<>
			<Row className="h-20">
				<Col>
					<label className="fs-6 mt-2">
						<strong>Override modelfile parameters</strong>
					</label>
					<InputGroup data-bs-theme="light">
						<Form.Check onChange={handleEnableOverrideChange} checked={ollamaParametersEnableOverride} />
					</InputGroup>
				</Col>
				<Col md="auto">
					<div className="vr h-100"></div>
				</Col>
				<Col>
					<label className="fs-6 mt-2">
						<strong>Keep alive (minutes)</strong>
					</label>
					<div className="row w-100 m-0">
						<span style={{ minWidth: "50px" }} className="col-auto p-0">
							{ollamaParametersKeepAlive}
						</span>
						<Slider
							className="mt-2 col"
							max={120}
							min={0}
							step={1}
							onChange={handleKeepAliveChange}
							value={ollamaParametersKeepAlive}
						/>
					</div>
				</Col>
			</Row>
			<hr className="hr" />
			<Row className="h-80">
				<Col>
					<label className="fs-6">
						<strong>temperature</strong>
					</label>

					<div className="row w-100 m-0">
						<span style={{ minWidth: "50px" }} className="col-auto p-0">
							{ollamaParametersTemperature}
						</span>
						<Slider
							className="mt-2 col"
							max={2}
							min={0}
							step={0.1}
							value={ollamaParametersTemperature}
							onChange={handleTemperatureChange}
						/>
					</div>

					<label className="fs-6">
						<strong>top_k</strong>
					</label>
					<div className="row w-100 m-0">
						<span style={{ minWidth: "50px" }} className="col-auto p-0">
							{ollamaParametersTopK}
						</span>
						<Slider
							className="mt-2 col"
							max={100}
							min={0}
							step={1}
							value={ollamaParametersTopK}
							onChange={handleTopKChange}
						/>
					</div>
					<label className="fs-6">
						<strong>top_p</strong>
					</label>
					<div className="row w-100 m-0">
						<span style={{ minWidth: "50px" }} className="col-auto p-0">
							{ollamaParametersTopP}
						</span>
						<Slider
							className="mt-2 col"
							max={2}
							min={0}
							step={0.1}
							value={ollamaParametersTopP}
							onChange={handleTopPChange}
						/>
					</div>
					<label className="fs-6">
						<strong>repeat_penalty</strong>
					</label>
					<div className="row w-100 m-0">
						<span style={{ minWidth: "50px" }} className="col-auto p-0">
							{ollamaParametersRepeatPenalty}
						</span>
						<Slider
							className="mt-2 col"
							max={2}
							min={0}
							step={0.1}
							value={ollamaParametersRepeatPenalty}
							onChange={handleRepeatPenaltyChange}
						/>
					</div>
					<label className="fs-6">
						<strong>num_predict</strong>
					</label>
					<div className="row w-100 m-0">
						<span style={{ minWidth: "50px" }} className="col-auto p-0">
							{ollamaParametersNumPredict}
						</span>
						<Slider
							className="mt-2 col"
							max={256}
							min={-2}
							step={1}
							value={ollamaParametersNumPredict}
							onChange={handleNumPredictChange}
						/>
					</div>
					<label className="fs-6">
						<strong>num_ctx</strong>
					</label>
					<div className="row w-100 m-0">
						<span style={{ minWidth: "50px" }} className="col-auto p-0">
							{ollamaParametersNumCtx}
						</span>
						<Slider
							className="mt-2 col"
							max={8192}
							min={0}
							step={256}
							value={ollamaParametersNumCtx}
							onChange={handleNumCtxChange}
						/>
					</div>
					<label className="fs-6">
						<strong>mirostat</strong>
					</label>
					<div className="row w-100 m-0">
						<span style={{ minWidth: "50px" }} className="col-auto p-0">
							{ollamaParametersMiroStat}
						</span>
						<Slider
							className="mt-2 col"
							max={2}
							min={0}
							step={1}
							value={ollamaParametersMiroStat}
							onChange={handleMiroStatChange}
						/>
					</div>
					<label className="fs-6">
						<strong>mirostat_eta</strong>
					</label>
					<div className="row w-100 m-0">
						<span style={{ minWidth: "50px" }} className="col-auto p-0">
							{ollamaParametersMiroStatEta}
						</span>
						<Slider
							className="mt-2 col"
							max={1}
							min={0}
							step={0.1}
							value={ollamaParametersMiroStatEta}
							onChange={handleMiroStatEtaChange}
						/>
					</div>

					<label className="fs-6">
						<strong>repeat_last_n</strong>
					</label>
					<div className="row w-100 m-0">
						<span style={{ minWidth: "50px" }} className="col-auto p-0">
							{ollamaParametersRepeatLastN}
						</span>
						<Slider
							className="mt-2 col"
							max={256}
							min={0}
							step={8}
							value={ollamaParametersRepeatLastN}
							onChange={handleRepeatLastNChange}
						/>
					</div>

					<label className="fs-6">
						<strong>seed</strong>
					</label>
					<div className="row w-100 m-0">
						<span style={{ minWidth: "50px" }} className="col-auto p-0">
							{ollamaParametersSeed}
						</span>
						<Slider
							className="mt-2 col"
							max={100}
							min={0}
							step={1}
							value={ollamaParametersSeed}
							onChange={handleSeedChange}
						/>
					</div>
					<label className="fs-6">
						<strong>tfs_z</strong>
					</label>
					<div className="row w-100 m-0">
						<span style={{ minWidth: "50px" }} className="col-auto p-0">
							{ollamaParametersTfsZ}
						</span>
						<Slider
							className="mt-2 col"
							max={3}
							min={1}
							step={1}
							value={ollamaParametersTfsZ}
							onChange={handleTfsZChange}
						/>
					</div>
				</Col>
				<Col md="auto">
					<div className="vr h-100"></div>
				</Col>
				<Col>
					<label className="fs-6">
						<strong>System message</strong>
					</label>
					<InputGroup className="mb-3" size="sm">
						<Form.Control
							data-bs-theme="light"
							style={{ height: "500px" }}
							as="textarea"
							placeholder="You are CHARACTERNAMEHERE, a friendly and engaging VTuber streamer."
							maxLength={1000}
							value={ollamaSystemMessage}
							onChange={handleSystemMessageChange}
						/>
					</InputGroup>
				</Col>
			</Row>
		</>
	);
};

export const OllamaPage = React.memo(OllamaPageComponent);
