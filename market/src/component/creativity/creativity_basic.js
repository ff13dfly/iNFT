import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaAngleDoubleUp, FaAngleDoubleDown } from "react-icons/fa";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/
function CreativityBasic(props) {
  const size = {
    row: [12],
    head:[11,1],
    basic: [2, 1, 2, 2, 1, 2, 2],
    info:[2,10]
  };

  const pages=["basic","info"];

  let [width, setWidth] = useState(900);
  let [height, setHeigth] = useState(900);
  let [cellX, setCellX] = useState(100);
  let [cellY, setCellY] = useState(100);
  let [active, setActive] = useState(0);

  //tag for the first running of creativity.
  const self = {
    changeWidth: (ev) => {
      setWidth(ev.target.value);
    },
    changeHeight: (ev) => {
      setHeigth(ev.target.value);
    },
    changeCellX: (ev) => {
      setCellX(ev.target.value);
    },
    changeCellY: (ev) => {
      setCellY(ev.target.value);
    },
    clickMoreUp: (ev) => {
      setActive(active>0?active-1:pages.length-1);      
    },
    clickMoreDown: (ev) => {
      setActive(active===(pages.length-1)?0:active+1);
    },
  }

  useEffect(() => {
    console.log(active,pages[active],!(pages[active]==="basic"))
  }, []);

  return (
    <Row>
      <Col className="pt-1" md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]}>
        <Row hidden={!(pages[active]==="basic")} style={{height:"65px"}}>
          <Col className="pt-1" md={size.basic[0]} lg={size.basic[0]} xl={size.basic[0]} xxl={size.basic[0]}>
            <h5>Basic Parameter</h5>
          </Col>
          <Col className="pt-4 text-center" md={size.basic[1]} lg={size.basic[1]} xl={size.basic[1]} xxl={size.basic[1]}>
            Size
          </Col>
          <Col md={size.basic[2]} lg={size.basic[2]} xl={size.basic[2]} xxl={size.basic[2]}>
            <small>iNFT Width</small>
            <input type="number" className="form-control" value={width} onChange={(ev) => {
              self.changeWidth(ev);
            }} />
          </Col>
          <Col md={size.basic[3]} lg={size.basic[3]} xl={size.basic[3]} xxl={size.basic[3]}>
            <small>iNFT Height</small>
            <input type="number" className="form-control" value={height} onChange={(ev) => {
              self.changeHeight(ev);
            }} />
          </Col>
          <Col className="pt-4 text-center" md={size.basic[4]} lg={size.basic[4]} xl={size.basic[4]} xxl={size.basic[4]}>
            Cell
          </Col>
          <Col md={size.basic[5]} lg={size.basic[5]} xl={size.basic[5]} xxl={size.basic[5]}>
            <small>Cell Width</small>
            <input type="number" className="form-control" value={cellX} onChange={(ev) => {
              self.changeCellX(ev);
            }} />
          </Col>
          <Col md={size.basic[6]} lg={size.basic[6]} xl={size.basic[6]} xxl={size.basic[6]}>
            <small>Cell Height</small>
            <input type="number" className="form-control" value={cellY} onChange={(ev) => {
              self.changeCellY(ev);
            }} />
          </Col>
        </Row>
        <Row hidden={!(pages[active]==="info")} style={{height:"65px"}}>
          <Col className="pt-1" md={size.info[0]} lg={size.info[0]} xl={size.info[0]} xxl={size.info[0]}>
            <h5>Gene Information</h5>
          </Col>
          <Col className="pt-1" md={size.info[1]} lg={size.info[1]} xl={size.info[1]} xxl={size.info[1]}>
            <p>
              Basic information of iNFT<br /> 
              Create stamp and more infomation.
            </p>
          </Col>
        </Row>
      </Col>
      <Col className="text-end" md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]}>
        <button className="btn btn-sm btn-default" onClick={(ev)=>{
          self.clickMoreUp(ev);
        }}><FaAngleDoubleUp /></button><br />
        <button className="btn btn-sm btn-default"onClick={(ev)=>{
          self.clickMoreDown(ev);
        }}><FaAngleDoubleDown /></button>
      </Col>
    </Row>
  );
}
export default CreativityBasic;