import { Container, Nav, Navbar } from "react-bootstrap";
import { useState, useEffect } from "react";

import tools from "../../lib/tools";
import RUNTIME from "../../system/runtime";

import { FaCog } from "react-icons/fa";

import { MdCurrencyExchange } from "react-icons/md";
import { GiCardExchange } from "react-icons/gi";
/* System footer
*   @param  {string}    active       //selected nav name
*/

function Header(props) {

  let [login, setLogin] = useState("Login");

  const navs = [
    {
      name: "market",
      //icon:<GiCardExchange size={24} color="#FF0000"/>,
    },
    {
      name: "bounty",
      icon:"",
    },
    {
      name: "playground",
      icon:"",
    },
    {
      name: "blacksmith",
      icon:"",
    },
    // {
    //   name: "creativity",
    //   icon:"",
    // },
  ]

  const self = {
    clickLogin: () => {
      if (login === "Login") {
        RUNTIME.auto((addr) => {
          setLogin(tools.shorten(addr, 5));
        });
      } else {
        props.link("user");
      }
    },
  }

  useEffect(() => {
    //(props.active === "user" && login === "Login")
    if (login === "Login") {
      setLogin("Checking...");
      setTimeout(() => {
        //setLogin("Login");
        self.clickLogin();
      }, 1500);
    }
  }, [props.active]);

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand >
          <h3 className="pointer" onClick={(ev) => { props.link("home") }} >iNFT</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {navs.map((row, index) => (
              <Nav.Link key={index} onClick={(ev) => { props.link(row.name) }} >
                {row.icon?row.icon:( <h5 className={props.active === row.name ? "text-warning" : ""}>{tools.toUp(row.name)}</h5>)}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <button className={props.active === "user" ? "btn btn-md btn-default text-info" : "btn btn-md btn-default"} onClick={(ev) => {
              self.clickLogin();
            }}>{login}</button>
            <span className="ml-5 text-secondary">|</span>
            <span className={props.active === "setting" ? "pointer text-warning" : "pointer"} onClick={(ev) => {
              props.link("setting");
            }}>
              <FaCog className="ml-5" size={16} />
            </span>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;