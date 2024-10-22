import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import CommonNumber from "../common/common_number";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function ImageParameter(props) {
  const size = {
    row: [12],
    amount: [3, 6, 3],
    half: [6],
  };

  let [amount, setAmount] = useState(8);
  let [ex, setEX] = useState(0);
  let [ey, setEY] = useState(0);
  let [offset, setOffset] = useState(0);

  const self = {
    changeAmount: (ev) => {
      setAmount(ev.target.value);
    },
    changeEX: (ev) => {
      setEX(ev.target.value);
    },
    changeEY: (ev) => {
      setEY(ev.target.value);
    },
    changeOffset: (ev) => {
      setOffset(ev.target.value);
    },
  }

  useEffect(() => {
    //console.log(props.name, props.index);
  }, [props.name, props.index]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Image Parameter</h5>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <CommonNumber value={ex} title={"Start Line"} callback={(val) => {
          console.log(val);
        }} />
      </Col>
      <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <CommonNumber value={ey} title={"Start Row"} callback={(val) => {
          console.log(val);
        }} />
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <CommonNumber value={amount} title={"Part Options"} callback={(val) => {
          console.log(val);
        }} />
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <CommonNumber value={ex} title={"Part X Extend"} callback={(val) => {
          console.log(val);
        }} />
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <CommonNumber value={ey} title={"Part Y Extend"} callback={(val) => {
          console.log(val);
        }} />
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <CommonNumber value={offset} title={"Offset"} callback={(val) => {
          console.log(val);
        }} />
      </Col>
    </Row>
  );
}
export default ImageParameter;