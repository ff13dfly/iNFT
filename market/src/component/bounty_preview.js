import { Row, Col, Breadcrumb } from "react-bootstrap";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

import CommentList from "./commnet_list";
import CommentSubmit from "./commnet_submit";
import BountyBonus from "./bounty_bonus";
import BountyMinting from "./bounty_minting";

import Network from "../network/router";

import Bounty from "../system/bounty";
import TPL from "../system/tpl";
import INFT from "../system/inft";
import API from "../system/api";

function BountyPreview(props) {
  const size = {
    row: [12],
    grid: [4, 8],
    left: [5, 7],
  };

  let [data, setData] = useState({});

  let [bonus, setBonus] = useState([]);
  let [coin, setCoin] = useState("");
  let [total, setTotal] = useState(0);

  let [update, setUpdate] = useState(0);

  const self = {
    getAlink: () => {
      return `anchor://${self.getAnchor()}/${self.getBlock()}`;
    },
    getAnchor: () => {
      if (props.data && props.data.anchor) return props.data.anchor
      if (props.extend && props.extend.anchor) return props.extend.anchor
      return "";
    },
    getBlock: () => {
      if (props.data && props.data.block) return props.data.block
      if (props.extend && props.extend.block) return props.extend.block
      return "";
    },
    getThumb: (index) => {
      if (!data || !data.series) return false;
      const all = data.series[index];
      return all.thumb[0];
    },
    getDate: (stamp) => {
      const dd = new Date(stamp * 1000);
      return dd.toDateString() + " " + dd.toLocaleTimeString();
    },
    calcTotal:(bs)=>{
      let amount=0;
      for(let i=0;i<bs.length;i++){
        const row=bs[i];
        amount+=row.amount*row.bonus;
      }
      return amount;
    },

    autoCache: (ck) => {
      const alink = self.getAlink();
      API.bounty.view(alink, (res) => {
        if (!res.success || !res.data) return ck && ck(false);
        
        setCoin(res.data.coin);   //set the bonus coin symbol
        
        // if (res.data.apply){
        //   self.getFullData(res.data.apply,(map)=>{
        //     const arr=[];
        //     for(let i=0;i<res.data.apply.length;i++){
        //       //regroup data by anchor data
        //       const single=res.data.apply[i];
        //       if(map[single.link]!==undefined) single.link=map[single.link];
        //       if(map[single.record]!==undefined) single.record=map[single.record];
        //       if(map[single.judge]!==undefined) single.judge=map[single.judge];
        //       if(map[single.distribute]!==undefined) single.distribute=map[single.distribute];
        //       arr.push(single);
        //     }
        //     console.log(arr);
        //   });
        // } 
        return ck && ck(res.data);
      });

      Bounty.get(alink, (bt) => {
        if (bt.error) return ck && ck(bt);
        //console.log(bt);
        if(bt.bonus){
          const n=self.calcTotal(bt.bonus);
          setTotal(n.toLocaleString());
        }

        if (bt.template && bt.template.cid) {
          TPL.view(bt.template.cid, (dt) => {
            setData(dt);
            setBonus(bt.bonus);
            return ck && ck(true);
          });
        }
      });
    },

    getBountyURL:()=>{
      const base="https://inft.w3os.net/bounty";
      if(props.data && props.data.anchor && props.data.block) return `${base}/${props.data.anchor}/${props.data.block}`;
      return base;
    },
  }

  useEffect(() => {
    //console.log(JSON.stringify(props));
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
              value={self.getBountyURL()}
            />
          </Col>
          <Col md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
            Start from
          </Col>
        </Row>

        <h5 className="pt-4">Bonus ( Total {total.toLocaleString()} ${coin.toUpperCase()} )</h5>
        <BountyBonus
          data={bonus}
          coin={coin}
          template={data}
          dialog={props.dialog}
          bounty={self.getAlink()}
        />
        <Row>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
            <hr />
          </Col>
        </Row>
        <BountyMinting template={data && data.cid ? data.cid : ""} bounty={self.getAlink()} amount={20}/>
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