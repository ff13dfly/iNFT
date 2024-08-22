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
    decode:(alink)=>{
      const str=alink.replace("anchor://","");
      const arr=str.split("/");
      const block=parseInt(arr.pop());
      if(isNaN(block)) return false;
      return {name:arr.join("/"),block:block};
    },
    decodeAlinks:(list)=>{
      const arr=[];
      for(let i=0;i<list.length;i++){
        const row=list[i];
        arr.push(self.decode(row));
      }
      return arr;
    },
    getAnchors:(list,ck,map)=>{
      if(map===undefined) map={};
      if(list.length===0) return ck && ck(map);
      const sinlge=list.pop();
      const chain=Network("anchor");
      chain.view(sinlge,"anchor",(dt)=>{
        if(dt!==false){
          const key=`anchor://${sinlge.name}/${sinlge.block}`;
          map[key]=dt;
        }
        return self.getAnchors(list,ck,map)
      }); 
    },
    getFullData:(list,ck)=>{
      const map={};   //cache for anchors

      //1.group different anchors
      const alinks=[],anks=[];
      for(let i=0;i<list.length;i++){
        const row=list[i];
        alinks.push(row.link);
        if(row.record) anks.push(row.record);
        if(row.judge) anks.push(row.judge);
        if(row.distribute) anks.push(row.distribute);
      }

      //2.get all iNFT datas
      const ins=self.decodeAlinks(alinks);
      INFT.auto(ins,(dt)=>{
        for(let i=0;i<dt.length;i++){
          const row=dt[i];
          const key=`anchor://${row.name}/${row.block}`;
          map[key]=row;
        }

        //3.get all anchors
        const ans=self.decodeAlinks(anks);
        self.getAnchors(ans,(dts)=>{
          for(let k in dts) map[k]=dts[k];
          return ck && ck(map);
        });
      });
    },

    autoCache: (ck) => {
      const alink = self.getAlink();
      API.bounty.view(alink, (res) => {
        if (!res.success || !res.data) return ck && ck(false);
        if (res.data.apply){
          self.getFullData(res.data.apply,(map)=>{
            //console.log(map);
            const arr=[];
            for(let i=0;i<res.data.apply.length;i++){
              //regroup data by anchor data
              const single=res.data.apply[i];
              if(map[single.link]!==undefined) single.link=map[single.link];
              if(map[single.record]!==undefined) single.record=map[single.record];
              if(map[single.judge]!==undefined) single.judge=map[single.judge];
              if(map[single.distribute]!==undefined) single.distribute=map[single.distribute];
              arr.push(single);
            }
            console.log(arr);
            //setApply(arr);
          });
        } 
      });

      Bounty.get(alink, (bt) => {
        if (bt.error) return ck && ck(bt);
        if (bt.template && bt.template.cid) {
          TPL.view(bt.template.cid, (dt) => {
            setData(dt);
            setBonus(bt.bonus);
            return ck && ck(true);
          });
        }
      });
    },
  }

  useEffect(() => {
    self.autoCache(() => {
      //console.log(data);
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
              value={"https://inft.w3os.net/market/bounty/bounty_reglrwnf/146805"}
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

        {/* <h5 className="pt-4">Apply Progress</h5>
        {apply.map((row, index) => (
          <Row key={index} className="pt-2">
            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
              Target: <strong>{row.link}</strong><br />
              on-chain record: <strong>{row.record}</strong><br />
              Stamp: <strong>{self.getDate(row.stamp)}</strong>
            </Col>
            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
              <hr />
            </Col>
          </Row>
        ))} */}
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