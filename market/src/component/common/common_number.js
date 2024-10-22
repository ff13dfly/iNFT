import { Row, Col, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import { useEffect, useState } from "react";

/* common input with inc/dec buttons
*   @param  {string}    title      //title of the input
*   @param  {number}    value     //value 
*   @param  {function}  callback  //ck && ck(value)
*   @param  {boolean}   [disable]   //wether disable the input
*   @param  {number}    [step]     //wether disable the input
*/

function CommonNumber(props) {
  const size = {
    row: [12],
    input: [3, 6, 3]
  };

  let [val, setVal] = useState(props.value);

  const self = {
    changeInput: (ev) => {
      const cur = ev.target.value;
      setVal(cur);
      if (props.callback) props.callback(cur);
    },
    clickInc: () => {
      const data=props.step?(val+props.step):(val+1);
      setVal(data);
      if (props.callback) props.callback(data);
    },
    clickDec: () => {
      const data=props.step?(val-props.step):(val-1);
      setVal(data);
      if (props.callback) props.callback(data);
    },
  }

  useEffect(() => {
    setVal(props.value);
  }, [props.value]);

  return (
    <Row className="pt-2">
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <small>{props.title}</small>
      </Col>
      <Col className="pt-1 text-center" md={size.input[0]} lg={size.input[0]} xl={size.input[0]} xxl={size.input[0]}>
        <button className="btn btn-sm btn-default" onClick={(ev)=>{
          self.clickDec(ev);
        }}>-</button>
      </Col>
      <Col className="pt-1 text-center" md={size.input[1]} lg={size.input[1]} xl={size.input[1]} xxl={size.input[1]}>
        <input
          className="text-center form-control"
          type="number"
          value={val}
          disabled={props.disable!==undefined?props.disable:false}
          onChange={(ev) => {
            self.changeInput(ev);
          }} />
      </Col>
      <Col className="pt-1  text-center" md={size.input[2]} lg={size.input[2]} xl={size.input[2]} xxl={size.input[2]}>
        <button className="btn btn-sm btn-default" onClick={(ev)=>{
          self.clickInc(ev);
        }}>+</button>
      </Col>
    </Row>
  );
}
export default CommonNumber;