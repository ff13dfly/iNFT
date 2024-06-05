import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import { FaCode, FaAlignJustify } from "react-icons/fa";

/* iNFT mock offset
*   @param  {string}   hash     //hash needed to render the iNFT       
*   @param  {array}    parts    //iNFT parts raw data
*   @param  {function}  [callback]      //hash change callback
*/

function MockOffset(props) {

  const size = {
    row: [12],
    head: [8, 4],
    offset: [1, 8, 3],
    formulate:[1,2,1,1,1,2,1,1,1,1],
  };

  let [code, setCode] = useState(false);       //show code mode
  let [offset, setOffset] = useState([]);
  let [list, setList] = useState([]);

  const self = {
    switchCode: (ev) => {
      setCode(!code);
    },
    clickSingle:(index,value)=>{
      const divide=props.parts[index].value[2];
      const val=(value>=divide-1)?0:value+1;
      offset[index]=val;
      const noffset=JSON.parse(JSON.stringify(offset));
      setOffset(noffset);
      if(props.callback) props.callback(noffset);
    },
    getValueFromHash:(hash,start,step)=>{
      const pure=hash.substr(2);
      return  `0x${pure.substr(start,step)}`;
    },
    getSelected:(divide,hash,start,step,offset_templat,offset_user)=>{
      const pure=hash.substr(2);
      const val=parseInt(`0x${pure.substr(start,step)}`);
      const result=val+offset_templat+offset_user
      return result%divide;
    },
  }

  useEffect(() => {
    const arr=new Array(props.parts.length).fill(0);
    console.log(props.hash);
    setOffset(arr);
    setList(props.parts);
  }, [props.parts, props.active]);

  return (
    <Row className='pt-4'>
      <Col className='' md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]}>
        <h5>Mock Offset</h5>
      </Col>
      <Col className='text-end' md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]}>
        <button className='btn btn-sm btn-secondary' onClick={(ev) => {
          self.switchCode(ev);
        }}>
          {!code ? <FaAlignJustify /> : <FaCode />}
        </button>
      </Col>
      <Col hidden={!code} className='pt-2' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <textarea className='form-control' rows="1" disabled value={JSON.stringify(offset)}></textarea>
      </Col>
      <Col hidden={code} className='pt-2' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>

        {list.length !== 0 && list.map((row, index) => (
          <Row key={index}>
            <Col className='pt-2' md={size.offset[0]} lg={size.offset[0]} xl={size.offset[0]} xxl={size.offset[0]}>
              #{index+1}
            </Col>
            <Col className='pt-2' md={size.offset[1]} lg={size.offset[1]} xl={size.offset[1]} xxl={size.offset[1]}>
              <Row>
                <Col md={size.formulate[0]} lg={size.formulate[0]} xl={size.formulate[0]} xxl={size.formulate[0]}>{"("}</Col>
                <Col md={size.formulate[1]} lg={size.formulate[1]} xl={size.formulate[1]} xxl={size.formulate[1]}>
                  <button className='btn btn-sm btn-secondary'>
                    {self.getValueFromHash(props.hash,row.value[0],row.value[1])}
                  </button>
                </Col>
                <Col md={size.formulate[2]} lg={size.formulate[2]} xl={size.formulate[2]} xxl={size.formulate[2]}>+</Col>
                <Col md={size.formulate[3]} lg={size.formulate[3]} xl={size.formulate[3]} xxl={size.formulate[3]}>
                  {row.value[3]}
                </Col>
                <Col md={size.formulate[4]} lg={size.formulate[4]} xl={size.formulate[4]} xxl={size.formulate[4]}>+</Col>
                <Col md={size.formulate[5]} lg={size.formulate[5]} xl={size.formulate[5]} xxl={size.formulate[5]}>
                  <button className='btn btn-sm btn-warning' onClick={(ev)=>{
                    self.clickSingle(index,offset[index]);
                  }}>{offset[index]}</button>
                </Col>
                <Col md={size.formulate[6]} lg={size.formulate[6]} xl={size.formulate[6]} xxl={size.formulate[6]}>{")"}</Col>
                <Col md={size.formulate[7]} lg={size.formulate[7]} xl={size.formulate[7]} xxl={size.formulate[7]}>%</Col>
                <Col md={size.formulate[8]} lg={size.formulate[8]} xl={size.formulate[8]} xxl={size.formulate[8]}>
                  {row.value[2]}
                </Col>
                <Col md={size.formulate[9]} lg={size.formulate[9]} xl={size.formulate[9]} xxl={size.formulate[9]}>=</Col>
              </Row>
            </Col>
            <Col className='pt-2 text-end' md={size.offset[2]} lg={size.offset[2]} xl={size.offset[2]} xxl={size.offset[2]}>
              {self.getSelected(row.value[2],props.hash,row.value[0],row.value[1],row.value[3],offset[index])}
            </Col>
          </Row>
        ))}
      </Col>
    </Row>
  );
}
export default MockOffset;