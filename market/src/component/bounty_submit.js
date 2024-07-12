import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import BountyTarget from './bounty_target';

import TPL from "../system/tpl";

function BountySubmit(props) {
  const size = {
    row: [12],
    half: [6],
    step: [2, 10],
    head: [4, 8],
    normal: [9, 3],
  };

  //submission details
  let [title, setTitle] = useState("");
  let [start, setStart] = useState(0);
  let [end, setEnd] = useState(0);
  let [template, setTemplate] = useState("");

  //step enable
  let [ready, setReady] = useState(false);
  let [pay,setPay]=useState(false);

  //sub component params
  let [series, setSeries]= useState([]);

  const self = {
    changeTitle: (ev) => {
      setTitle(ev.target.value);
    },
    changeStart: (ev) => {
      setStart(ev.target.value);
    },
    changeEnd: (ev) => {
      setEnd(ev.target.value);
    },
    changeTemplate: (ev) => {
      setTemplate(ev.target.value);
    },
    clickLoad: (ev) => {
      TPL.view(template, (res) => {
        console.log(res);
        setReady(true);
      });
    },
  }

  useEffect(() => {
  }, []);

  return (
    <Row>

      <Col md={size.step[0]} lg={size.step[0]} xl={size.step[0]} xxl={size.step[0]}>
        <h4>Step 1</h4>
      </Col>
      <Col md={size.step[1]} lg={size.step[1]} xl={size.step[1]} xxl={size.step[1]}>
        Select a template for bounty which is storage on IPFS.
      </Col>

      <Col className='pt-2' md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
        <input type="text" className='form-control' placeholder='Input template CID'
          value={template} onChange={(ev) => {
            self.changeTemplate(ev);
          }} />
      </Col>
      <Col className='pt-2 text-end' md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
        <button className='btn btn-md btn-primary' onClick={(ev) => {
          self.clickLoad(ev);
        }}>Load</button>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <hr />
      </Col>

      <Col hidden={!ready} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col md={size.step[0]} lg={size.step[0]} xl={size.step[0]} xxl={size.step[0]}>
            <h4>Step 2</h4>
          </Col>
          <Col md={size.step[1]} lg={size.step[1]} xl={size.step[1]} xxl={size.step[1]}>
            Setup the details about the bounty and write on chain.
          </Col>

          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <small>The title of bounty</small>
            <input type="text" className='form-control' placeholder='Input the title of bounty'
              value={title} onChange={(ev) => {
                self.changeTitle(ev);
              }} />
          </Col>

          <Col className='pt-2' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <small>The title of bounty</small>
            <textarea className='form-control' cols={4}></textarea>
          </Col>

          <Col md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <small>Bounty start at block</small>
            <input type="number" className='form-control' placeholder='Start of bounty'
              value={start} onChange={(ev) => {
                self.changeStart(ev);
              }} />
          </Col>

          <Col md={size.half[0]} lg={size.half[0]} xl={size.half[0]} xxl={size.half[0]}>
            <small>Bounty end at block</small>
            <input type="number" className='form-control' placeholder='End of bounty'
              value={end} onChange={(ev) => {
                self.changeEnd(ev);
              }} />
          </Col>

          <Col className='' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            Current block number: {0}, {6}s per block.
          </Col>

          <Col className='' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <BountyTarget series={series} callback={() => { }} />
          </Col>


          <Col className='' md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
          </Col>
          <Col className='text-end' md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
            <button className='btn btn-md btn-primary'>Submit</button>
          </Col>

          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <hr />
          </Col>
        </Row>
      </Col>

      <Col hidden={pay} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <Row>
          <Col md={size.step[0]} lg={size.step[0]} xl={size.step[0]} xxl={size.step[0]}>
            <h4>Step 3</h4>
          </Col>
          <Col md={size.step[1]} lg={size.step[1]} xl={size.step[1]} xxl={size.step[1]}>
            Pay the coins to target account.
          </Col>

          <Col className='' md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
          </Col>
          <Col className='text-end' md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
            <button className='btn btn-md btn-primary'>Pay</button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
export default BountySubmit;