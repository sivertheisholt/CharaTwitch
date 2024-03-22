import React from "react";
import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/esm/Nav";
import Navbar from "react-bootstrap/esm/Navbar";
import { NavLink } from "react-router-dom";

export interface NavBarProps {}

const NavBarComponent = (props: NavBarProps) => {
	return (
		<Navbar expand="lg" data-bs-theme="dark" className="bg-body-tertiary">
			<Container>
				<Navbar.Brand>CharaTwitch</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link as={NavLink} to="/">
							Home
						</Nav.Link>
						<Nav.Link as={NavLink} to="/config">
							Config
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export const NavBar = React.memo(NavBarComponent);
