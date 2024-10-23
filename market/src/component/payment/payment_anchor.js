import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Config from "../../system/config";
import Network from "../../network/router";

import { FaCheck } from "react-icons/fa";

/* Component Sample
*   @param  {string}    props.target        //target account to pay
*   @param  {number}    props.amount
*/

function PaymentAnchor(props) {
  const size = {
    row: [12],
    transaction: [1, 9, 2],
  };

  let [payed, setPayed]=useState(true);   //wether payed, set the payment hash
  let [info, setInfo]=useState("");       //payment information
  let [hash, setHash] = useState("");     //transaction hash to confirm payment;
  let [title, setTitle] = useState("Pay Now!");   //button title

  const coin="ank";
  const self = {
    changeHash: (ev) => {
      setHash(ev.target.value);
    },
    clickPayed: () => {
      setPayed(!payed);
      if (!payed) {
        setTitle("Pay Now!");
      } else {
        setTitle("Update");
      }
    },
    clickSign: (ev) => {
      setInfo("");

      //1.do pay to agent account
      const chain=Network("anchor");
      const dapp = Config.get(["system", "name"]);
      chain.wallet(dapp,(injector,walletAddress)=>{
        chain.transfer(injector.signer,props.target,props.amount,(status)=>{
          //console.log(status);
          if(status.finalized){
            const final_block=status.finalized
            if(props.callback)  props.callback(
              props.amount,
              {from:walletAddress,to:props.target},
              {hash:final_block},
            )

            //2.update the payment hash to anchor network
            setHash(final_block);
            setPayed(true);
          }
        },true,walletAddress);
      });
    }
  }

  useEffect(() => {

  }, [props.target, props.amount]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        Total: <strong className="text-danger">{props.amount.toLocaleString()}</strong>
        <strong className="text-warning ml-5">${coin.toUpperCase()}</strong>. Target: <strong className="text-danger">{props.target}</strong>
      </Col>
      <Col className="pt-1" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col className="pt-1" md={size.transaction[0]} lg={size.transaction[0]} xl={size.transaction[0]} xxl={size.transaction[0]}>
            <button className={payed ? "btn btn-sm btn-default" : "btn btn-sm btn-primary"} onClick={(ev) => {
              self.clickPayed(ev)
            }}><FaCheck /></button>
          </Col>
          <Col hidden={payed} className="" md={size.transaction[1]} lg={size.transaction[1]} xl={size.transaction[1]} xxl={size.transaction[1]}>
            <input 
              className="form-control" 
              type="text" 
              placeholder={`Transaction hash of Anchor Network`} 
              value={hash}
              onChange={(ev) => {
                self.changeHash(ev);
              }} />
          </Col>
          <Col hidden={!payed} className="" md={size.transaction[1]} lg={size.transaction[1]} xl={size.transaction[1]} xxl={size.transaction[1]}>

          </Col>
          <Col hidden={payed} className="text-end" md={size.transaction[2]} lg={size.transaction[2]} xl={size.transaction[2]} xxl={size.transaction[2]}>
            <button className="btn btn-md btn-primary"  onClick={(ev) => {
              self.clickSign();
            }}>Update</button>
          </Col>
          <Col hidden={!payed} className="text-end" md={size.transaction[2]} lg={size.transaction[2]} xl={size.transaction[2]} xxl={size.transaction[2]}>
            <button className="btn btn-md btn-primary"  onClick={(ev) => {
              self.clickSign();
            }}>Pay Now!</button>
          </Col>
          <Col className="text-end text-danger" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            {info}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default PaymentAnchor;