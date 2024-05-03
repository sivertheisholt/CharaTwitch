import React from "react";
import Card from "react-bootstrap/esm/Card";

export interface StatusCardProps {
	pngName: string;
	active?: boolean;
}

const StatusCardComponent = ({ pngName, active = false }: StatusCardProps) => {
	return (
		<Card data-bs-theme="dark" style={{ padding: "8px" }}>
			<Card.Img
				style={{
					width: "80px",
					height: "55px",
					marginLeft: "auto",
					marginRight: "auto",
				}}
				variant="top"
				src={`images/${pngName}`}
			/>
			<Card.Body style={{ width: "100%", textAlign: "center" }}>
				<img
					alt="Online/Offline"
					style={{ width: "40px", textAlign: "center" }}
					src={`images/${active ? "check.png" : "cancel.png"}`}
				/>
			</Card.Body>
		</Card>
	);
};

export const StatusCard = React.memo(StatusCardComponent);
