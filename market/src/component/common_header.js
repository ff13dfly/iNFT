import { Container, Nav, Navbar } from 'react-bootstrap';
import { FaCog } from "react-icons/fa";

import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';

const self={
  subwallet:async()=>{
    const extensions = await web3Enable('iNFT Market');
    if (extensions.length === 0) {
      console.log('No extension installed');
      return false;
    }
    const accounts = await web3Accounts();
    if (accounts.length === 0) {
      console.log('No accounts found');
      return false;
    }
    const injector = await web3FromAddress(accounts[0].address);
    console.log(injector);

  },
}

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
            {/* <Nav.Link onClick={(ev) => { props.link("explorer") }}>
              <h5 className={props.active === "explorer" ? "text-warning" : ""}>Explorer</h5>
            </Nav.Link> */}
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
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>

            <span className='pointer text-warning' onClick={(ev) => {
              self.subwallet();
            }}>
              5D5K7b...BhcePg
            </span>
            <span className='ml-5'>|</span>
            <span className='pointer' onClick={(ev) => { props.link("setting") }}>
              <FaCog className='ml-5' size={16} />
            </span>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;