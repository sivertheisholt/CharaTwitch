import React from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { StatusCard } from "../components/cards/StatusCard";
import useSocket from "../hooks/useSocket";

export interface HomePageProps {}

const HomePageComponent = (props: HomePageProps) => {
  const socket = useSocket("http://localhost:5000");

  socket?.on("hello", (arg) => {
    console.log(arg); // world
  });
  return (
    <div style={{ height: "100%" }}>
      <Row style={{ height: "20%" }}>
        <Col>
          <Row
            className=" justify-content-center align-items-center"
            style={{ flexWrap: "nowrap", height: "100%" }}
          >
            <Col>
              <StatusCard title="Twitch Account" pngName="twitch-logo.png" />
            </Col>
            <Col>
              <StatusCard title="Twitch IRC" pngName="twitch-logo.png" />
            </Col>
            <Col>
              <StatusCard title="Twitch Redeems" pngName="twitch-logo.png" />
            </Col>
            <Col>
              <StatusCard title="Character AI" pngName="cai.ico" />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style={{ height: "40%" }}>
        <Col>
          <h1>Twitch chat</h1>
          <hr className="hr" />
        </Col>
        <Col md="auto">
          <div style={{ height: "100%" }} className="vr"></div>
        </Col>
        <Col>
          <h1>Twitch Redeems</h1>
          <hr className="hr" />
        </Col>
      </Row>
      <Row style={{ height: "40%" }}>
        <Col>
          <h1>Character AI</h1>
          <hr className="hr" />
        </Col>
        <Col md="auto">
          <div style={{ height: "100%" }} className="vr"></div>
        </Col>
        <Col>
          <h1>Status</h1>
          <hr className="hr" />
          <h1>Processing request...</h1>
        </Col>
      </Row>
    </div>
  );
};

export const HomePage = React.memo(HomePageComponent);
