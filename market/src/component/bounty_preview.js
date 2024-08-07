import { Row, Col, Breadcrumb } from "react-bootstrap";
import { useEffect, useState } from "react";

import CommentList from "./commnet_list";
import CommentSubmit  from "./commnet_submit";
import BountyBonus from "./bounty_bonus";
import BountyMinting from "./bounty_minting";

import tools from "../lib/tools";
import Bounty from "../system/bounty";
import TPL from "../system/tpl";

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

  let [apply, setApply] = useState([]);
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
    autoCache: (ck) => {
      const alink = self.getAlink();
      API.bounty.view(alink, (res) => {
        if (!res.success || !res.data) return false;

        if (res.data.apply) setApply(res.data.apply);
      });

      Bounty.get(alink, (local) => {
        if (!local || local.length === 0) return false;
        const bt = local[0];
        if (bt.template && bt.template.cid) {
          TPL.view(bt.template.cid, (dt) => {
            setData(dt);
            // console.log(`Bonus update?`);
            setBonus(bt.bonus);
          });
        }
      });
    },
  }

  useEffect(() => {
    //console.log("Bounty preview:"+JSON.stringify(props));
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
            <img src={`${window.location.origin}/imgs/minter.png`} alt="QR" style={{width:"100%"}} />
          </Col>
          <Col md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
            Start from
          </Col>
        </Row>
        
        <h5 className="pt-4">Bonus ( Total {total.toLocaleString()} ${coin.toUpperCase()} )</h5>
        <BountyBonus data={bonus} coin={coin} template={data} />

        <BountyMinting template={""}/>

        <h5 className="pt-4">Bounty Detail</h5>
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
            ))}
      </Col>
      <Col md={size.grid[1]} lg={size.grid[1]} xl={size.grid[1]} xxl={size.grid[1]}>
        
        <CommentList />
        <CommentSubmit />
      </Col>
      
    </Row>
  );
}
export default BountyPreview;