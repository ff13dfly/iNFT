import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaChevronUp, FaChevronDown } from "react-icons/fa";

/* Component Sample
*   @param  {string}    name        //gene template name
*   @param  {number}    index       //parts index
*/

function PartsDetail(props) {
  const size = {
    row: [12],
    head: [9, 3],
    half: [6],
  };

  let [start, setStart] = useState(24);
  let [step, setStep] = useState(2);
  let [divide, setDivide] = useState(8);
  let [offset, setOffset] = useState(0);

  let [expandHash, setExpandHash] = useState(true);
  let [expandImage, setExpandImage] = useState(true);

  const self = {
    changeStart: (ev) => {
      setStart(ev.target.value);
    },
    changeStep: (ev) => {
      setStep(ev.target.value);
    },
    changeDivde: (ev) => {
      setDivide(ev.target.value);
    },
    changeOffset: (ev) => {
      setOffset(ev.target.value);
    },
    clickExpandImage: (ev) => {
      setExpandImage(!expandImage);
    },
    clickExpandHash: (ev) => {
      setExpandHash(!expandHash);
    },
  }

  useEffect(() => {
    // const arr = [{ part: 1 }, { part: 2 }]
    // setList(arr);
  }, []);


  return (
    <Row>
      <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col className="pt-2" md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]}>
            <h5>Hash Setting</h5>
          </Col>
          <Col className="pt-2 text-end" md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]}>
            <button className="btn btn-sm btn-default" onClick={(ev) => {
              self.clickExpandHash()
            }}>
              {expandHash ? <FaChevronDown /> : <FaChevronUp />}
            </button>
          </Col>
        </Row>
        <Row hidden={!expandHash}>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <small>Start of hash to cut</small>
            <input type="number" className="form-control" value={start} onChange={(ev) => {
              self.changeStart(ev);
            }} />
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <small>Step after start to cut</small>
            <input type="number" className="form-control" value={step} onChange={(ev) => {
              self.changeStep(ev);
            }} />
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <small>Options to select image part</small>
            <input type="number" className="form-control" value={divide} onChange={(ev) => {
              self.changeDivide(ev);
            }} />
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <small>Offset of gene template</small>
            <input type="number" className="form-control" value={offset} onChange={(ev) => {
              self.changeOffset(ev);
            }} />
          </Col>
        </Row>
        
        <Row>
          <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <hr />
          </Col>
        </Row>
        
        <Row>
          <Col className="pt-2" md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]}>
            <h5>Image Setting</h5>
          </Col>
          <Col className="pt-2 text-end" md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]}>
            <button className="btn btn-sm btn-default" onClick={(ev) => {
              self.clickExpandImage()
            }}>
              {expandImage ? <FaChevronDown /> : <FaChevronUp />}
            </button>
          </Col>
        </Row>

        <Row hidden={!expandImage}>
          <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            Image cut parameters.
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <small>Start row to cut image</small>
            <input type="number" className="form-control" value={start} onChange={(ev) => {
              self.changeStart(ev);
            }} />
          </Col>
          <Col className="pt-2" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <small>Start line to cut image</small>
            <input type="number" className="form-control" value={step} onChange={(ev) => {
              self.changeStep(ev);
            }} />
          </Col>
          <Col className="pt-4" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            Image combining parameters.
          </Col>
          <Col className="pt-1" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <small>Part position X on iNFT</small>
            <input type="number" className="form-control" value={start} onChange={(ev) => {
              self.changeStart(ev);
            }} />
          </Col>
          <Col className="pt-1" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <small>Part position Y on iNFT</small>
            <input type="number" className="form-control" value={step} onChange={(ev) => {
              self.changeStep(ev);
            }} />
          </Col>
          <Col className="pt-1" md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <small>Part rotation on iNFT</small>
            <input type="number" className="form-control" value={start} onChange={(ev) => {
              self.changeStart(ev);
            }} />
          </Col>
          
        </Row>

      </Col>
    </Row>
  );
}
export default PartsDetail;