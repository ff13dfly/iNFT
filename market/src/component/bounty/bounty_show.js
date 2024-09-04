import { Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

import BountyComment from "./bounty_comment";
import BountyMinting from "./bounty_minting";
import BountyBonus from "./bounty_bonus";

import Config from "../../system/config";
import tools from "../../lib/tools";

import { FaClock, FaPizzaSlice, FaQrcode } from "react-icons/fa";

/* Mint result of nearby blocks
*   @param  {object}    data        //raw anchor data of bounty
*   @param  {object}    template    //template raw data
*   @param  {function}  fresh       //fresh the bounty list function
*/

function BountyShow(props) {
  const size = {
    row: [12],
    grid: [3, 4, 5],
    left: [3, 9],
  };

  let [ready, setReady] = useState(false);
  let [coin, setCoin] = useState("");
  let [total, setTotal] = useState(0);

  let [qr, setQR] = useState(false);
  let [qrURL, setQrURL] = useState(window.location.origin);

  const self = {
    clickQR:()=>{
      setQR(!qr);
    },
    calcBonus: (list) => {
      let amount = 0;
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        amount += parseInt(row.amount) * row.bonus
      }
      return amount;
    },
    getThumb: (index) => {
      const dt = props.template.raw.series[index];
      return dt.thumb[0];
    },
    getCover: () => {
      return props.template && props.template.raw ? props.template.raw.image : `${window.location.origin}/imgs/logo.png`
    },

    getQrURL:(alink)=>{
      //`${window.location.origin}/bounty/${alink.replace("anchor://","")}`;
      const minter=Config.get(["system","minter"]);
      return `${minter}#${props.template.cid}`;
    },

    getTemplateCID:()=>{
      if(props.template && props.template.cid) return props.template.cid;
      return "";
    },
    getBountyAlink:()=>{
      if(props.data && props.data.alink)return props.data.alink;
      return false;
    },
    getPeriod:()=>{
      if(!props.data.orgin || !props.data.orgin.raw || !props.data.orgin.raw.period) return "Invalid period.";
      const tdata=props.data.orgin.raw.period;
      return `From ${tdata.start===0?"now":tdata.start.toLocaleString()} to ${tdata.end===0?"all done":tdata.start.toLocaleString()}`;
    },
    getTitle:()=>{

    },
    getDesc:()=>{

    },
  }

  useEffect(() => {
    //in order to avoid fake list show
    //console.log(props.data);
    if(props.data && props.data.alink){
      setReady(false);
      const raw = props.data.orgin.raw;
      setQrURL(self.getQrURL(props.data.alink));
      setReady(true);
      if (raw.bonus) {
        setTotal(self.calcBonus(raw.bonus));
      }
      if (raw.coin) setCoin(raw.coin);
    }
    
  }, [props.data]);

  return (
    <Row hidden={!ready} className="pb-4">
      <Col className="bounty_title" md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
        <Card style={{ width: "100%" }}>
          <FaQrcode hidden={qr} className="qr_button pointer bg-default" size={30} onClick={(ev) => {
            self.clickQR();
          }}/>
          <div className="qr pointer" hidden={!qr} onClick={(ev) => {
            self.clickQR();
          }}>
            <Row style={{background:"#F0FAF0",borderRadius: "5px",}}>
              <Col className="pt-3" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <QRCode 
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                title={"QR title"}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={qrURL} 
                />
              </Col>
              <Col className="pb-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                Scan to mint target iNFT.
              </Col>
            </Row>
          </div>
          <div className="template_thumb pointer" style={{backgroundImage: `url(${self.getCover()})` }} onClick={(ev) => {
            props.link("bounty", [props.data.orgin.name, props.data.orgin.block]);
          }}></div>
          <Card.Body className="pointer" onClick={(ev) => {
            props.link("bounty", [props.data.orgin.name, props.data.orgin.block]);
          }}>
            <Card.Title>{self.getTitle()}</Card.Title>
            <Card.Text>
              {self.getDesc()}
            </Card.Text>
          </Card.Body>
        </Card>
        <h6 className="pt-1">{self.getBountyAlink()}</h6>
        <p className="pt-1">
          <FaClock /> {self.getPeriod()}<br />
          <FaPizzaSlice />{(<span className="pointer ml-5" onClick={(ev) => { props.link("playground", [self.getTemplateCID()]) }}>
              {tools.shorten(self.getTemplateCID(), 15)}
            </span>)}
        </p>
      </Col>
      <Col className="bounty_title" md={size.grid[1]} lg={size.grid[1]} xl={size.grid[1]} xxl={size.grid[1]}>
        <h5>Bonus ( Total {total.toLocaleString()} ${coin.toUpperCase()} )</h5>
        <BountyBonus 
          raw={props.data}
          coin={coin} 
          template={props.template && props.template.raw}
          dialog={props.dialog}
          fresh={props.fresh}     //force to fresh the bounty list
        />
        <p className="pt-2">Click thumb to view detail or divert iNFT.</p>
      </Col>
      <Col className="bounty_live" md={size.grid[2]} lg={size.grid[2]} xl={size.grid[2]} xxl={size.grid[2]}>
        <Row className="pt-4">
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <BountyMinting template={self.getTemplateCID()} bounty={self.getBountyAlink()}/>
          </Col>
        </Row>
        <BountyComment bounty={self.getBountyAlink()} link={props.link}/>
      </Col>
    </Row>
  );
}
export default BountyShow;