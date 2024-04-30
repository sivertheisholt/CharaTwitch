import React, { useContext } from "react";
import { OllamaConfigContext } from "../../contexts/config/OllamaConfigContext";
import { SocketContext } from "../../contexts/SocketContext";
import { OllamaConfigContextType } from "../../types/context/config/OllamaConfigContextType";
import { SocketContextType } from "../../types/context/SocketContextType";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";

export interface OllamaConfigProps {}

const OllamaConfigComponent = (props: OllamaConfigProps) => {
	const { socket } = useContext(SocketContext) as SocketContextType;
	const { ollamaModelName, setOllamaModelName, ollamaBaseUrl, setOllamaBaseUrl } = useContext(
		OllamaConfigContext
	) as OllamaConfigContextType;

	const handleOllamaModelName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOllamaModelName(event.target.value);
	};
	const handleOllamaBaseUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOllamaBaseUrl(event.target.value);
	};

	return (
		<>
			<h2>Ollama</h2>
			<hr className="hr" />
			<label className="fs-4">
				<strong>Model Name</strong>
			</label>
			<InputGroup className="mb-3" size="lg">
				<Form.Control
					value={ollamaModelName}
					onChange={handleOllamaModelName}
					placeholder="Model Name"
					aria-label="Model Name"
				/>
			</InputGroup>
			<label className="fs-4">
				<strong>Ollama Server</strong>
			</label>
			<InputGroup className="mb-3" size="lg">
				<Form.Control
					value={ollamaBaseUrl}
					onChange={handleOllamaBaseUrl}
					placeholder="Ollama Server"
					aria-label="Ollama Server"
				/>
			</InputGroup>
		</>
	);
};

export const OllamaConfig = React.memo(OllamaConfigComponent);
