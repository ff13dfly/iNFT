import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Nav, Navbar } from 'react-bootstrap';

function Header(props) {
  const size = {
    row: [12],
    flow: [3, 6, 3]
  };

  const self = {

  }

  console.log(useParams())

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
              <h4 className={props.active==="market"?"text-warning":""}>Market</h4>
            </Nav.Link>
            <Nav.Link href="/template">
              <h4 className={props.active==="template"?"text-warning":""}>Template</h4>
            </Nav.Link>
            <Nav.Link href="/minter">
              <h4 className={props.active==="minter"?"text-warning":""}>Minter</h4>
            </Nav.Link>
            <Nav.Link href="/editor">
              <h4 className={props.active==="editor"?"text-warning":""}>Editor</h4>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;