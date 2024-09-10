import { Row, Col, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import { useEffect, useState } from "react";

/* common input with inc/dec buttons
*   @param  {string}    title      //title of the input
*   @param  {number}    value     //value 
*   @param  {function}  callback  //ck && ck(value)
*   @param  {boolean}   [disable]   //wether disable the input
*   @param  {number}   [step]     //wether disable the input
*/

function CommonNumber(props) {
  const size = {
    row: [12],
    input: [3, 6, 3]
  };

  let [val, setVal] = useState(props.value);
  let [step, setStep] = useState(!props.step ? 1 : props.step);

  const self = {
    changeInput: (ev) => {
      const cur = ev.target.value;
      setVal(cur);
      if (props.callback) props.callback(cur);
    },
    clickInc: () => {

    },
    clickDec: () => {

    },
  }

  useEffect(() => {

  }, [props.value,]);

  return (
    <Row className="pt-2">
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <small>{props.title}</small>
      </Col>
      <Col className="pt-1 text-center" md={size.input[0]} lg={size.input[0]} xl={size.input[0]} xxl={size.input[0]}>
        <button className="btn btn-sm btn-default">-</button>
      </Col>
      <Col className="pt-1 text-center" md={size.input[1]} lg={size.input[1]} xl={size.input[1]} xxl={size.input[1]}>
        <input
          className="text-center form-control"
          type="number"
          value={val}
          onChange={(ev) => {
            self.changeInput(ev);
          }} />
      </Col>
      <Col className="pt-1  text-center" md={size.input[2]} lg={size.input[2]} xl={size.input[2]} xxl={size.input[2]}>
        <button className="btn btn-sm btn-default">+</button>
      </Col>
    </Row>
  );
}
export default CommonNumber;