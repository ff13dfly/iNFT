import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Mint result of nearby blocks
*   @param  {function}  callback        //ck(address)
*/

function MintAccount(props) {
  const size = {
    row: [12],
    add:[3,5,2,2]
  };

  let [list, setList] = useState([]);
  let [info, setInfo] = useState("");

  const self = {
    clickTask:()=>{
      props.callback("account_009");
    },
  }

  useEffect(() => {
    const arr=[{mock:"a"},{mock:"b"}]
    setList(arr);
  }, []);

  return (
    <Row className="pt-2">
      <Col md={size.add[0]} lg={size.add[0]} xl={size.add[0]} xxl={size.add[0]}>
        <select className="form-control">
          <option value={"account_01"}>Anchor Network</option>
          <option value={"account_02"}>Polkadot Network</option>
        </select>
      </Col>
      <Col md={size.add[1]} lg={size.add[1]} xl={size.add[1]} xxl={size.add[1]}>
        <select className="form-control">
          <option value={"account_01"}>SUB_ACCOUNT_1</option>
          <option value={"account_02"}>SUB_ACCOUNT_2</option>
        </select>
      </Col>
      <Col md={size.add[2]} lg={size.add[2]} xl={size.add[2]} xxl={size.add[2]}>
        <button className="btn btn-md btn-primary" onClick={(ev)=>{
          self.clickTask();
        }}> + Task</button>
      </Col>
      <Col md={size.add[3]} lg={size.add[3]} xl={size.add[3]} xxl={size.add[3]}>
        {info}
      </Col>
    </Row>
  );
}
export default MintAccount;