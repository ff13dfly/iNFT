import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import BountyApply from "./bounty_apply";

import API from "../system/api";
import TPL from "../system/tpl";

function BountyBonus(props) {
  const size = {
    row: [12],
    grid: [4, 4, 4],
    left: [3,9],
  };
  let [data, setData]= useState({});
  let [list, setList] = useState([]);
  let [progress, setProgress] = useState([]);

  const self = {
    clickApply: (index, alink) => {
      props.dialog.show(<BountyApply data={data} index={index} dialog={props.dialog} />, "Bounty apply");
    },
    getThumb: (index) => {
      if (!props.template || !props.template.series) return false;
      const all = props.template.series[index];
      return all.thumb[0];
    },
  }

  useEffect(() => {
    if(props.bounty){
      if((typeof props.bounty)==="string"){
        API.bounty.view(props.bounty,(res)=>{
          if(!res.success) return false;    //FIXME, more operation here.

          const row=res.data;
          TPL.view(row.template.cid,(dt)=>{
            row.template.raw=dt;
            setData(row);
          });
        });
      }else{
        setData(props.bounty);
      }
    }
    if(props.data){
      //console.log(props.data);
      setList(props.data);
    }
  }, [props.data]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {list.map((row, index) => (
          <Row key={index} className="pt-2">
            <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
              <img alt="" src={self.getThumb(row.series)} className="series_thumb pointer" />
            </Col>
            <Col md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
              <Row>
                <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                  <strong>{row.bonus.toLocaleString()}</strong> ${props.coin.toUpperCase()} ( {!progress[row.series] ? 0 : progress[row.series]}/{row.amount} ) <br />
                  Applying:
                </Col>
                <Col className="text-end" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                  <button className="btn btn-md btn-primary" onClick={(ev) => {
                    self.clickApply(index, props.bounty);
                  }}>Apply</button>
                </Col>
              </Row>
            </Col>
          </Row>
        ))}
      </Col>
    </Row>
  )
}
export default BountyBonus;