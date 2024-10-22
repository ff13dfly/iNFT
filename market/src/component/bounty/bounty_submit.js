import { Row, Col, Tabs, Tab } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";

import BountyTarget from "./bounty_target";
import BountyTemplate from "./bounty_template";
import BountyDetail from "./bounty_detail";
import BountyMore from "./bounty_more";
import RouterPayment from "../payment/router_payment";

import Network from "../../network/router";

import TPL from "../../system/tpl";
import RUNTIME from "../../system/runtime";
import Config from "../../system/config";
import Bounty from "../../system/bounty";
import API from "../../system/api";

import tools from "../../lib/tools";

/* Bounty submission entry
*   @param  {function}  props.dialog      //system dialog 
*/

function BountySubmit(props) {
  const size = {
    row: [12],
    half: [5],
    step: [2, 10],
    head: [4, 8],
    normal: [9, 3],
  };

  const loadRef = useRef(null);

  //submission details
  let [template, setTemplate] = useState({});       //template details
  let [search, setSearch] = useState("");           //template hash search value
  let [bonus, setBonus] = useState([]);             //bonus setting

  //step enable
  let [ready, setReady] = useState(false);          //when template is valid, set to true  
  let [bounty, setBounty] = useState({});           //when editing, get the bounty data from frontend
  let [more, setMore] = useState({});               //more parameter from sub component, set here.

  let [enableLoad, setEnableLoad] = useState(true);         //wether `load template` disabled, for editing mode
  let [enableSubmit, setEnableSubmit] = useState(false);    //wether `submit` disabled, for editing mode

  //UI improvement
  let [tabs, setTabs] = useState({      //tabs title
    "step_1": <span><strong className="text-secondary">Step 1 : </strong><strong>Template</strong></span>,
    "step_2": <span><strong className="text-secondary">Step 2 : </strong><strong className="text-secondary">Bonus</strong></span>,
    "step_3": <span><strong className="text-secondary">Step 3 : </strong><strong className="text-secondary">Payment</strong></span>,
  });
  let [enable, setEnable] = useState({  //tabs enable values
    "step_1": true,
    "step_2": false,
    "step_3": false,
  });

  //sub component params
  let [anchor, setAnchor] = useState(!props.name?"":props.name);     //alink of bounty
  let [info, setInfo] = useState("");         //writing status
  let [infoLoad,setInfoLoad]= useState("");    //writing status
  //let [payInfo, setPayInfo] = useState("");     //paying status

  const self = {
    changeSearch: (ev) => {
      setSearch(ev.target.value);
    },
    changeTabTitle: (active) => {
      const ts = {
        step_1: { index: 1, title: "Template" },
        step_2: { index: 2, title: "Bonus" },
        step_3: { index: 3, title: "Payment" },
      }

      const ntabs = {}
      for (var k in ts) {
        const row = ts[k];
        if (k === active) {
          ntabs[k] = <span><strong className="text-secondary">Step {row.index} : </strong><strong className="text-warning">{row.title}</strong></span>
        } else {
          ntabs[k] = <span><strong className="text-secondary">Step {row.index} : </strong><strong className="text-secondary">{row.title}</strong></span>
        }
      }
      setTabs(ntabs);
    },
    clickLoad: (ev) => {
      self.cleanTemplate();
      if(search.length!==59){
        return setInfoLoad("Invalid template cid.");
      }
      TPL.view(search, (dt) => {
        if (dt === false) {
          setSearch("");
          return setInfoLoad("Invalid template cid.");
        }

        setTemplate(dt);
        setReady(true);

        enable["step_2"] = true;
        setEnable(tools.clone(enable));

        setTimeout(() => {

        }, 500);
      });
    },
    clickRegister: () => {
      //console.log(JSON.stringify(more));
      RUNTIME.auto((addr) => {
        if (!addr) return setInfo("No valid account yet.");
        //1.write bounty on chain
        const name = Bounty.format.name("submit");
        more.bonus = bonus;   //update bonus detail
        if(!more.consignee) more.consignee=addr;
        const raw = Bounty.format.raw.submit(addr, more);
        const protocol = Bounty.format.protocol.submit();
        const dapp = Config.get(["system", "name"]);
        const obj = {
          anchor: name,
          raw: raw,
          protocol: protocol,
          dapp: dapp,
        }
        const chain = Network("anchor");
        chain.sign(obj, (res) => {
          setInfo(res.msg);
          if (res.status === "Finalized") {
            setTimeout(() => {
              setInfo("");
            }, 1500);
            //const hash = res.hash;    //get the transaction hash
            chain.view({ name: name }, "anchor", (adata) => {
              if (!adata) return setInfo("Failed to get the bounty anchor data.");

              //2.register the bounty on portal
              const alink = `anchor://${name}/${adata.block}`;
              API.bounty.register(alink, (portal) => {
                if (!portal.success) return setInfo("Failed to regoster on portal.");

                //3. save the bounty on local
                const row = Bounty.format.local(alink, addr, raw);
                row.register = true;

                Bounty.insert(row, (res) => {

                  setAnchor(alink);

                  enable["step_3"] = true;
                  setEnable(tools.clone(enable));

                  props.dialog.close();
                  return true;
                });
              });
            });
          }
        });
      });
    },
    callbackBonus: (list) => {
      const arr = [];
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        delete row.thumb;
        delete row.name;
        arr.push(row);
      }
      setBonus(arr);
    },
    callbackMore: (more) => {
      more.template = {
        cid:template.cid,
        origin:!template.orgin?"web3.storage":template.orgin,
      };
      //console.log(JSON.stringify(more));
      setMore(tools.clone(more));
    },
    load: (bt) => {
      //console.log(bt);
      setSearch(bt.template.cid);
      setTimeout(() => {
        loadRef.current.click();
        setEnableLoad(false);
      }, 200);

      if (bt.bonus) setBonus(bt.bonus);
    },
    cleanTemplate:()=>{
      setInfoLoad("");
      setTemplate({});
      setReady(false);
    },
    setEditMode:()=>{
      setAnchor(props.name);
      self.changeTabTitle("step_3");
      enable["step_2"] = true;
      enable["step_3"] = true;
      setEnable(tools.clone(enable));
    },
  }

  useEffect(() => {
    if (props.name) {
      //console.log(props.name);
      //1.edit mode, need to set all the parameters
      self.setEditMode();
      Bounty.get(props.name, (bty) => {
        if (bty.error) return false;
        self.load(bty);
        setBounty(bty);
        setAnchor(props.name);    //set alink of bounty
      });
    } else {

      //2.adding mode, enable submit button
      self.changeTabTitle("step_1");
      setEnableSubmit(true);
    }
  }, [props.name]);

  return (
    <Tabs
      defaultActiveKey="step_1"
      id="uncontrolled-tab-example"
      className="mb-3"
      fill
      onSelect={(active) => {
        self.changeTabTitle(active);
      }}
    >
      <Tab eventKey="step_1" disabled={!enable["step_1"]} title={tabs.step_1}>
        <Row>
          <Col className="text-info" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            Select a template for bounty which is storage on IPFS.
          </Col>

          <Col className="pt-2" md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
            <input type="text" disabled={!enableLoad} className="form-control" placeholder="Input template CID"
              value={search} onChange={(ev) => {
                self.changeSearch(ev);
              }} />
          </Col>
          <Col className="pt-2 text-end" md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
            <button disabled={!enableLoad} className="btn btn-md btn-primary" ref={loadRef} onClick={(ev) => {
              self.clickLoad(ev);
            }}>Load</button>
          </Col>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            {infoLoad}
          </Col>
          <Col hidden={!ready} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <BountyTemplate template={template} />
          </Col>
        </Row>
      </Tab>
      <Tab eventKey="step_2" disabled={!enable["step_2"]} title={tabs.step_2}>
        <Row>
          <Col hidden={!ready} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <Row>
              <Col className="text-info" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                Setup the details about the bounty and write on chain.
              </Col>
              <Col className="" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <BountyMore bounty={bounty} callback={(more) => {
                  self.callbackMore(more);
                }} />
              </Col>
              <Col className="" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <BountyTarget template={template} bounty={props.name} callback={(dt) => {
                  self.callbackBonus(dt);
                }} />
              </Col>
              <Col className="" md={size.normal[0]} lg={size.normal[0]} xl={size.normal[0]} xxl={size.normal[0]}>
                {info}
              </Col>
              <Col className="text-end" md={size.normal[1]} lg={size.normal[1]} xl={size.normal[1]} xxl={size.normal[1]}>
                <button disabled={!enableSubmit} className="btn btn-md btn-primary" onClick={(ev) => {
                  self.clickRegister();
                }}>Submit</button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Tab>
      <Tab eventKey="step_3" disabled={!enable["step_3"]} title={tabs.step_3}>
        <Row>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <Row>
              <Col className="text-info" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                Payment details.
              </Col>
              <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <BountyDetail bounty={anchor} template={template} />
              </Col>
            </Row>
          </Col>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <RouterPayment bounty={anchor} callback={(amount,from_to,more)=>{
              console.log(amount,from_to,more);
            }}/>
          </Col>
        </Row>
      </Tab>
    </Tabs>
  );
}
export default BountySubmit;