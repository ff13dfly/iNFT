import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Network from "../../network/router";
import Config from "../../system/config";
import tools from "../../lib/tools";

/* On chain bounty setting
*   @param  {string}    bounty       //bounty_name, alink of bounty
*/

function BountySelling(props) {
  const size = {
    row: [12],
    left:[8,4],
  };

  let [price, setPrice] = useState(0.1);
  let [expire, setExpire]= useState(0);
  let [info,  setInfo]  = useState("");

  const self = {
    changePrice:(ev)=>{
      setPrice(ev.target.value);
    },
    changeExpire:(ev)=>{
      setExpire(ev.target.value);
    },
    clickBounty:(ev)=>{
      const dt=tools.decode(props.bounty);
      const chain=Network("anchor");
      chain.view(dt,"anchor",(data)=>{
        if(data===false) return setInfo("Invalid bounty data");
        
        const dapp=Config.get(["system","name"]);
        const ticket={
          name:dt.name,
          block:dt.block,
          price:parseFloat(price),
          expire:parseInt(expire),
        }
        chain.bounty.create(dapp,ticket,(res)=>{
          console.log(res);
        });
      });
    }
  }

  useEffect(() => {
    console.log(props);

  }, [props.bounty]);

  return (
    <Row >
      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        <small>Ticket price by $ANK</small>
        <input type="number" className="form-control" value={price} onChange={(ev)=>{
          self.changePrice(ev);
        }}/>
      </Col>
      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        <small>Expired block. Default is 0, unlimited.</small>
        <input type="number" className="form-control" value={expire} onChange={(ev)=>{
          self.changeExpire(ev);
        }}/>
      </Col>
      <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
        {info}
      </Col>
      <Col className="text-end" md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
        <button className="btn btn-md btn-primary" onClick={(ev)=>{
          self.clickBounty(ev);
        }}>Set Bounty Ticket</button>
      </Col>
    </Row>
  );
}
export default BountySelling;