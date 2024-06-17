import { Container, Nav, Navbar } from 'react-bootstrap';
function Header(props) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/home">
          <h3>iNFT</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={(ev) => { props.link("market") }} >
              <h5 className={props.active === "market" ? "text-warning" : ""}>Market</h5>
            </Nav.Link>
            {/* <Nav.Link href="/bounty">
              <h5 className={props.active==="bounty"?"text-warning":""}>Bounty</h5>
            </Nav.Link> */}
            <Nav.Link onClick={(ev) => { props.link("template") }}>
              <h5 className={props.active === "template" ? "text-warning" : ""}>Template</h5>
            </Nav.Link>
            <Nav.Link onClick={(ev) => { props.link("explorer") }}>
              <h5 className={props.active === "explorer" ? "text-warning" : ""}>Explorer</h5>
            </Nav.Link>
            <Nav.Link onClick={(ev) => { props.link("playground") }}>
              <h5 className={props.active === "playground" ? "text-warning" : ""}>Playground</h5>
            </Nav.Link>
            <Nav.Link onClick={(ev) => { props.link("minter") }}>
              <h5 className={props.active === "minter" ? "text-warning" : ""}>Minter</h5>
            </Nav.Link>
            <Nav.Link onClick={(ev) => { props.link("editor") }}>
              <h5 className={props.active === "editor" ? "text-warning" : ""}>Editor</h5>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;