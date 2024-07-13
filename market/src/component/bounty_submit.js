import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';

import BountyTarget from './bounty_target';
import BountyTemplate from './bounty_template';

import TPL from "../system/tpl";

function BountySubmit(props) {
  const size = {
    row: [12],
    half: [5],
    step: [2, 10],
    head: [4, 8],
    normal: [9, 3],
  };

  //submission details
  let [template, setTemplate] = useState("");
  let [title, setTitle] = useState("");
  let [desc, setDesc] = useState("");
  let [start, setStart] = useState(0);
  let [end, setEnd] = useState(0);
  let [bonus, setBonus]=useState([]);
  let [publisher,setPublisher]=useState("");
  let [coin, setCoin]=useState("ank");            //the coin type for bounty

  //step enable
  let [ready, setReady] = useState(false);
  let [pay, setPay] = useState(false);

  //sub component params
  //let [series, setSeries] = useState([]);
  let [data, setData] = useState({});

  

  const self = {
    changeTitle: (ev) => {
      setTitle(ev.target.value);
    },
    changeStart: (ev) => {
      setStart(parseInt(ev.target.value));
    },
    changeEnd: (ev) => {
      setEnd(parseInt(ev.target.value));
    },
    changeTemplate: (ev) => {
      setTemplate(ev.target.value);
    },
    clickLoad: (ev) => {
      TPL.view(template, (dt) => {
        setData(dt);
        setReady(true);
      });
    },
    clickSubmit:()=>{
      const raw=self.getBountyData();
      const protocol={fmt:"json",type:"data",tpl:"bounty"};
      console.log(raw,protocol);
    },
    callbackBonus:(list)=>{
      const arr=[];
      for(let i=0;i<list.length;i++){
        const row=list[i];
        delete row.thumb;
        delete row.name;
        arr.push(row);
      }
      setBonus(arr);
    },
    getBountyData:()=>{
      return {
        title:title,
        desc:desc,
        publisher:publisher,
        coin:coin,
        template:{
          cid:template,
          orgin:"web3.storage",
        },
        period:{
          start:start,
          end:end,
        },
        bonus:bonus
      }
    }
  }

  useEffect(() => {
    
  }, []);

  return (
    <Tabs
      defaultActiveKey="step_1"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="step_1" title="Step 1">
        <Row>
          <Col className='text-info' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
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
          <Col hidden={!ready} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <BountyTemplate data={data} />
          </Col>
        </Row>
      </Tab>
      <Tab eventKey="step_2" title="Step 2">
        <Row>
          <Col hidden={!ready} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <Row>
              <Col className='text-info' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                Setup the details about the bounty and write on chain.
              </Col>

              <Col md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
                <small>The title of bounty</small>
                <input type="text" className='form-control' placeholder='Input the title of bounty'
                  value={title} onChange={(ev) => {
                    self.changeTitle(ev);
                  }} />
              </Col>
              <Col md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
              </Col>

              <Col className='pt-2' md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
                <small>Details about the bounty.</small>
                <textarea className='form-control' cols={4}></textarea>
              </Col>
              <Col md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
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
                <BountyTarget data={data} callback={(dt) => {
                  self.callbackBonus(dt);
                }} />
              </Col>


              <Col className='' md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>

              </Col>
              <Col className='text-end' md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
                <button className='btn btn-md btn-primary' onClick={(ev)=>{
                  self.clickSubmit();
                }}>Submit</button>
              </Col>

              <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <hr />
              </Col>
            </Row>
          </Col>
        </Row>
      </Tab>
      <Tab eventKey="step_3" title="Step 3">
        <Row>
          <Col hidden={pay} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <Row>
              <Col className='text-info' md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
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
      </Tab>
    </Tabs>

  );
}
export default BountySubmit;