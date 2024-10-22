import { Row, Col, Breadcrumb } from "react-bootstrap";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

import CommentList from "../comment/commnet_list";
import CommentSubmit from "../comment/commnet_submit";
import BountyBonus from "./bounty_bonus";
import BountyMinting from "./bounty_minting";
import BountyTicket from "./bounty_ticket";

import TPL from "../../system/tpl";
import API from "../../system/api";

import tools from "../../lib/tools";
import Network from "../../network/router";

import { FaHeart, FaRegHeart } from "react-icons/fa";

/* Bounty Preview, entry of view
*   @param  {function}    props.link        //system link function
*   @param  {function}    props.dailog      //system dialog 
*   @param  {string[]}    props.extent      //input from url without entry
*/


function BountyPreview(props) {
  const size = {
    row: [12],
    grid: [4, 8],
    left: [5, 7],
  };

  let [template, setTemplate] = useState({});   //template data
  let [raw, setRaw] = useState({});     //bounty data from backend

  let [coin, setCoin] = useState("");
  let [total, setTotal] = useState(0);
  let [desc, setDesc] = useState("");

  let [update, setUpdate] = useState(0);

  let [fav, setFav] = useState(true);  //wether faved by user

  const self = {
    getAlink: () => {
      return `anchor://${self.getAnchor()}/${self.getBlock()}`;
    },
    getAnchor: () => {
      if (props.data && props.data.anchor) return props.data.anchor
      return "";
    },
    getBlock: () => {
      if (props.data && props.data.block) return props.data.block;
      return "";
    },
    getThumb: (index) => {
      if (!template || !template.series) return false;
      const all = template.series[index];
      return all.thumb[0];
    },
    getDate: (stamp) => {
      const dd = new Date(stamp * 1000);
      return dd.toDateString() + " " + dd.toLocaleTimeString();
    },
    calcTotal: (bs) => {
      let amount = 0;
      for (let i = 0; i < bs.length; i++) {
        const row = bs[i];
        amount += row.amount * row.bonus;
      }
      return amount;
    },

    autoCache: (ck) => {
      const alink = self.getAlink();
      const chain=Network("anchor");
      chain.view(tools.decode(alink),"anchor",(res)=>{
        const bs=res.raw.bonus;
        const n = self.calcTotal(bs);
        setTotal(n.toLocaleString());
        setCoin(res.raw.coin);

        const cid=res.raw.template.cid;
        TPL.view(cid,(gene)=>{
          setTemplate(gene);

          API.bounty.view(alink, (dt) => {
            if(dt.error) return console.log(dt);
            const bounty=dt.data;
            bounty.orgin=res;
            bounty.template=gene;

            setRaw(bounty);
          });

          return ck && ck(true);
        });
      });
    },

    getBountyURL: () => {
      const base = `${window.location.origin}/bounty`;
      if (props.data && props.data.anchor && props.data.block) return `${base}/${props.data.anchor}/${props.data.block}`;
      return base;
    },
  }

  useEffect(() => {
    //console.log(self.getBountyURL())
    self.autoCache(() => {

    });
  }, [props.data, props.extend]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        <Breadcrumb>
          <Breadcrumb.Item onClick={(ev) => { props.link("home") }}>Home</Breadcrumb.Item>
          <Breadcrumb.Item onClick={(ev) => { props.link("bounty") }}>Bounty</Breadcrumb.Item>
          <Breadcrumb.Item active>{self.getAlink()}</Breadcrumb.Item>
        </Breadcrumb>
      </Col>
      <Col md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
        <Row>
          <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
            <QRCode
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              title={"QR title"}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              // value={self.getBountyURL()}
              value={"https://minter.inft.w3os.net"}
            />
          </Col>
          <Col md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
            <Row>
              <Col className="text-end" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                <button className="btn btn-sm btn-default">
                  <FaRegHeart hidden={fav} className="text-warning" size={20} />
                  <FaHeart hidden={!fav} className="text-warning" size={20} />
                </button>
              </Col>
              <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                <p>{desc}</p>
                <p>~</p>
              </Col>
            </Row>
          </Col>
        </Row>

        <h5 className="pt-4">Bonus ( Total {total.toLocaleString()} ${coin.toUpperCase()} )</h5>
        <BountyBonus
          raw={raw}
          template={template}
          coin={coin}
          dialog={props.dialog}
        />
        <p className="pt-2">Click thumb to view detail or divert iNFT.</p>
        <BountyTicket  bounty={self.getAlink()}/>
        <Row>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
            <hr />
          </Col>
        </Row>
        <BountyMinting template={template && template.cid ? template.cid : ""} bounty={self.getAlink()} amount={20} />
      </Col>
      <Col md={size.grid[1]} lg={size.grid[1]} xl={size.grid[1]} xxl={size.grid[1]}>
        <CommentList alink={self.getAlink()} update={update} />
        <CommentSubmit alink={self.getAlink()} callback={() => {
          setUpdate(update + 1);
        }} />
      </Col>

    </Row>
  );
}
export default BountyPreview;