import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaCheck } from "react-icons/fa";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function PaymentSolana(props) {
  const size = {
    row: [12],
    transaction: [1, 9, 2],
  };

  let [payed, setPayed]=useState(true);
  let [info, setInfo]=useState("");
  let [hash, setHash] = useState("");         //transaction hash to confirm payment;

  const coin="sol";
  const self = {
    changeHash: (ev) => {
      setHash(ev.target.value);
    },
    clickPayed: () => {
      setPayed(!payed);
    },
    clickSign: (ev) => {
      setInfo("");
    }
  }

  useEffect(() => {
    console.log(props);
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
          <Col className="text-end" md={size.transaction[2]} lg={size.transaction[2]} xl={size.transaction[2]} xxl={size.transaction[2]}>
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
export default PaymentSolana;