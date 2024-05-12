import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import {Container,Nav,Navbar,NavDropdown} from 'react-bootstrap';

function Header(props) {
    const size = {
        row: [12],
        flow:[3,6,3]
    };

    const self={

    }

    useEffect(() => {

    }, [props.update]);

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="/home">
              <h3>iNFT</h3>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/market">
                  <h4>Market</h4></Nav.Link>
                <Nav.Link href="/template">
                  <h4>Template</h4>
                </Nav.Link>
                <Nav.Link href="https://inft.w3os.net/minter">
                  <h4>Minter</h4>
                </Nav.Link>
                <Nav.Link href="https://inft.w3os.net/editor">
                  <h4>Editor</h4>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
}

export default Header;