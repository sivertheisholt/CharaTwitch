import React, { ReactElement } from "react";
import { Container } from "react-bootstrap";
import { NavBar } from "../navbar/NavBar";

export interface DefaultLayoutProps {
  children: ReactElement;
}

const DefaultLayoutComponent = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <NavBar />
      <Container style={{ height: "calc(100% - 56px)" }} className="text-light">
        {children}
      </Container>
    </>
  );
};

export const DefaultLayout = React.memo(DefaultLayoutComponent);
