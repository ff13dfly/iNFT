import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import BountyApply from "./bounty_apply";

import tools from "../lib/tools";

function BonusProcess(props) {
  const size = {
    row: [12],
    head: [4, 8],
    half: [6],
    apply:[3,9]
  };

  let [list, setList] = useState([]);

  const self = {
    clickApply:()=>{
      props.dialog.close();
      setTimeout(()=>{
        props.dialog.show(<BountyApply data={props.data} index={props.index} dialog={props.dialog} />, "Bounty Apply");
      },200);
    },
    getTarget: () => {
      if (props.data.detail && props.data.detail.bonus) {
        const bs = props.data.detail.bonus;
        const target = bs[props.index];
        const ss = props.data.template.raw.series;
        const series = ss[target.series];
        return series.thumb[0];
      }
      return `${window.location.origin}/imgs/logo.png`;
    },
    applyList: (aps, index) => {
      //console.log(aps,index);
      const arr = [];
      for (let i = 0; i < aps.length; i++) {
        const row = aps[i];
        const atom = { inft: null, judge: null, distribute: null }
        if (row.record && row.record.raw && row.record.raw.bounty && row.record.raw.bounty.bonus === index) {
          atom.inft = row.link;

          if (row.judge && row.judge.raw) {
            atom.judge = row.judge;
          }

          if (row.distribute && row.distribute.raw) {
            atom.distribute = row.distribute;
          }

          arr.push(atom);
        }
      }
      console.log(arr);
      setList(arr)
    },
  }

  useEffect(() => {
    self.applyList(props.data.apply, props.index);
    console.log(props);
  }, [props.index]);

  return (
    <Row>
      <Col md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]} >
        <h5>Wanted</h5>
        <img src={self.getTarget()} className="apply_thumb" alt="" />
      </Col>
      <Col md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]} >
        <Row>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
            {props.data.detail.desc}
          </Col>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
            Bonus: 
          </Col>
          <Col className="text-end" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
            <button className="btn btn-md btn-primary" onClick={(ev)=>{
              self.clickApply();
            }}>Apply</button>
          </Col>
        </Row>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        <hr />
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        <h5>Applied List</h5>
      </Col>
      {list.map((row, index) => (
        <Col className="pt-2" key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          <Row>
            <Col md={size.apply[0]} lg={size.apply[0]} xl={size.apply[0]} xxl={size.apply[0]} >
              <img src={row.inft.bs64} className="apply_thumb" alt="" />
              <h6>anchor://{row.inft.name}/{row.inft.block}</h6>
            </Col>
            <Col md={size.apply[1]} lg={size.apply[1]} xl={size.apply[1]} xxl={size.apply[1]} >
              <Row>
                <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                  {row.judge.raw.result?"Acceptted":"Refused"}
                </Col>
                <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                  Judged by <strong>{tools.shorten(row.judge.owner,4)}</strong> on <strong>anchor://{row.judge.name}/{row.judge.block}</strong>
                </Col>
                <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                  {row.distribute!==null?"Payed":"Waiting for distributition"}
                </Col>
                <Col className="text-end" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                  <button className="btn btn-sm btn-primary">Divert</button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
}
export default BonusProcess;