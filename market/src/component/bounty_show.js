import { Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

import BountyComment from "./bounty_comment";
import BountyMinting from "./bounty_minting";
import BountyBonus from "./bounty_bonus";

import tools from "../lib/tools";
import { FaClock, FaPizzaSlice, FaQrcode } from "react-icons/fa";

function BountyShow(props) {
  const size = {
    row: [12],
    grid: [3, 4, 5],
    left: [3, 9],
  };

  let [ready, setReady] = useState(false);
  let [data, setData] = useState({});     //bounty raw data with template detail
  let [bonus, setBonus] = useState([]);
  let [coin, setCoin] = useState("");
  let [progress, setProgress] = useState([]);
  let [total, setTotal] = useState(0);

  let [block, setBlock] = useState(0);    //current block number

  let [qr, setQR] = useState(false);

  const self = {
    clickQR:()=>{
      setQR(!qr);
    },
    // clickApply: (index, alink) => {
    //   props.dialog.show(<BountyApply data={data} index={index} dialog={props.dialog} />, "Bounty apply");
    // },
    calcBonus: (list) => {
      let amount = 0;
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        amount += parseInt(row.amount) * row.bonus
      }
      return amount;
    },
    getThumb: (index) => {
      if (!data.template || !data.template.raw || !data.template.raw.series) return false;
      const dt = data.template.raw.series[index];
      return dt.thumb[0];
    },
    getCover: () => {
      return data.template && data.template.raw ? data.template.raw.image : `${window.location.origin}/imgs/logo.png`
    },
  }

  useEffect(() => {
    setReady(false);
    if (props.data && props.data.template) {
      const data = props.data;
      setData(data);
      setReady(true);

      if (data.detail && data.detail.bonus) {
        setBonus(data.detail.bonus);
        setTotal(self.calcBonus(data.detail.bonus));
      }
      if (data.coin) setCoin(data.coin);
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
            {/* <img src={`${window.location.origin}/imgs/minter.png`} alt="QR" style={{width:"100%"}} /> */}
            <QRCode 
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              title={"QR title"}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              // size={200}
              value={"https://inft.w3os.net/market/bounty_reglrwnf/146805"} 
              //viewBox={`0 0 256 256`}
              />
          </div>
          <div className="template_thumb pointer" style={{backgroundImage: `url(${self.getCover()})` }} onClick={(ev) => {
            props.link("bounty", [props.data.name, props.data.block]);
          }}></div>
          <Card.Body className="pointer" onClick={(ev) => {
            props.link("bounty", [props.data.name, props.data.block]);
          }}>
            <Card.Title>{data.detail && data.detail.title ? data.detail.title : ""}</Card.Title>
            <Card.Text>
              {data.detail && data.detail.desc ? data.detail.desc : ""}
            </Card.Text>
          </Card.Body>
        </Card>
        <h6 className="pt-1">{data && data.alink?data.alink:""}</h6>
        <p>
          <FaClock /> {parseInt(data.start).toLocaleString()} ~ {parseInt(data.end).toLocaleString()} ( current: {block.toLocaleString()} )<br />
          <FaPizzaSlice />{data && data.template && data.template.cid ?
            (<span className="pointer ml-5" onClick={(ev) => { props.link("playground", [data.template.cid]) }}>
              {tools.shorten(data.template.cid, 15)}
            </span>) : ""
          }
        </p>
      </Col>
      <Col className="bounty_title" md={size.grid[1]} lg={size.grid[1]} xl={size.grid[1]} xxl={size.grid[1]}>
        <h6>Bonus ( Total {total.toLocaleString()} ${coin.toUpperCase()} )</h6>
        <BountyBonus 
          data={bonus} 
          coin={coin} 
          bounty={props.data} 
          template={!data.template || !data.template.raw?{}:data.template.raw}
          dialog={props.dialog}
        />
      </Col>
      <Col className="bounty_live" md={size.grid[2]} lg={size.grid[2]} xl={size.grid[2]} xxl={size.grid[2]}>
        <Row className="pt-4">
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
            <BountyMinting template={props.data && props.data.template?props.data.template.cid:""} bounty={props.data && props.data.alink?props.data.alink:""}/>
          </Col>
        </Row>
        <BountyComment bounty={props.data && props.data.alink?props.data.alink:""}/>
      </Col>
    </Row>
  );
}
export default BountyShow;