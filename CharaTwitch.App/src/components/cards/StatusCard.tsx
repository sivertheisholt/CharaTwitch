import React from "react";
import Card from "react-bootstrap/esm/Card";

export interface StatusCardProps {
  pngName: string;
  title?: string;
  active?: boolean;
}

const StatusCardComponent = ({
  pngName,
  title = "",
  active = false,
}: StatusCardProps) => {
  return (
    <Card data-bs-theme="dark" style={{ padding: "8px" }}>
      <Card.Img
        style={{
          width: "80px",
          height: "50px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        variant="top"
        src={`img/${pngName}`}
      />
      <Card.Body>
        <Card.Title style={{ fontSize: "16px" }}>{title}</Card.Title>
        <p>
          Status:
          <img
            alt="Online/Offline"
            style={{ width: "25px", marginLeft: "auto", marginRight: "auto" }}
            src={`img/${active ? "check.png" : "cancel.png"}`}
          />
        </p>
      </Card.Body>
    </Card>
  );
};

export const StatusCard = React.memo(StatusCardComponent);
