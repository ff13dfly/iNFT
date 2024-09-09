import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import AccountSelector from "../account/account_selector";
import Network from "../../network/router";
import tools from "../../lib/tools";

/* Mint result of nearby blocks
*   @param  {function}  callback        //ck(address)
*/

function MintAccount(props) {
  const size = {
    row: [12],
    add:[3,7,2]
  };

  let [list, setList] = useState([]);
  let [address, setAddress] = useState("");
  let [network, setNetwork] = useState("anchor");     //selected network name

  const self = {
    changeNetwork: (ev) => {
      setNetwork(ev.target.value);
    },
    clickTask:()=>{
      if(address && props.callback) props.callback(address);
    },
    getNetworks: () => {
      const ns = Network();
      const arr = [];
      for (var key in ns) {
        if (ns[key] !== null) arr.push(key);
      }
      return arr;
    },
  }

  useEffect(() => {
    const ns = self.getNetworks();
    setList(ns);
  }, []);

  return (
    <Row className="pt-2">
      <Col md={size.add[0]} lg={size.add[0]} xl={size.add[0]} xxl={size.add[0]}>
        <select name="" className="form-control"
          value={network}
          onChange={(ev) => {
            self.changeNetwork(ev);
          }}>
          {list.map((row, index) => (
            <option value={row} key={index} >{tools.toUp(row)} Network</option>
          ))}
        </select>
      </Col>
      <Col md={size.add[1]} lg={size.add[1]} xl={size.add[1]} xxl={size.add[1]}>
        <AccountSelector network={network} callback={(addr)=>{
          setAddress(addr);
        }}/>
      </Col>
      <Col md={size.add[2]} lg={size.add[2]} xl={size.add[2]} xxl={size.add[2]}>
        <button className="btn btn-md btn-primary" onClick={(ev)=>{
          self.clickTask();
        }}> + Task</button>
      </Col>
    </Row>
  );
}
export default MintAccount;