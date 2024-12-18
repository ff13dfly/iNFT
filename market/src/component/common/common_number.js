import { Row, Col  } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaPlus,FaMinus } from "react-icons/fa";

/* common input with inc/dec buttons
*   @param  {string}    props.title      //title of the input
*   @param  {number}    props.value     //value 
*   @param  {function}  props.callback  //ck && ck(value)
*   @param  {boolean}   [props.disable]   //wether disable the input
*   @param  {number}    [props.step]     //wether disable the input
*   @param  {array}     [props.range]     //[min,max], the input range
*/

function CommonNumber(props) {
  const size = {
    row: [12],
    input: [3, 6, 3]
  };

  let [val, setVal] = useState(props.value);

  const self = {
    changeInput: (ev) => {
      let cur = parseFloat(ev.target.value);
      if(props.range!==undefined){
        const [min,max]=props.range;
        if(cur>max) cur=max;
        if(cur<min) cur=min;
      }
      setVal(cur);
      if (props.callback) props.callback(cur);
    },
    clickInc: () => {
      let data=props.step?(val+props.step):(val+1);
      if(props.range!==undefined){
        const [min,max]=props.range;
        if(data>max) data=max;
        if(data<min) data=min;
      }
      setVal(data);
      if (props.callback) props.callback(data);
    },
    clickDec: () => {
      let data=props.step?(val-props.step):(val-1);
      if(props.range!==undefined){
        const [min,max]=props.range;
        if(data>max) data=max;
        if(data<min) data=min;
      }
      setVal(data);
      if (props.callback) props.callback(data);
    },
    getIncDisable:()=>{
      if(props.disable!==undefined) return props.disable;
      if(props.range){
        const [min,max]=props.range;
        if(val >= max) return true;
      }
      return false;
    },
    getDecDisable:()=>{
      if(props.disable!==undefined) return props.disable;
      if(props.range){
        const [min,max]=props.range;
        if(val <= min) return true;
      }
      return false;
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
        <button className="btn btn-sm btn-default" disabled={self.getDecDisable()} onClick={(ev)=>{
          self.clickDec(ev);
        }}><FaMinus className="text-secondary"/></button>
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
        <button className="btn btn-sm btn-default" disabled={self.getIncDisable()} onClick={(ev)=>{
          self.clickInc(ev);
        }}><FaPlus className="text-secondary"/></button>
      </Col>
    </Row>
  );
}
export default CommonNumber;