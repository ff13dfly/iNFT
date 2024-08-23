import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import BountyApply from "./bounty_apply";
import BonusProcess from "./bonus_process";

import Network from "../network/router";
import API from "../system/api";
import TPL from "../system/tpl";
import INFT from "../system/inft";

function BountyBonus(props) {
  const size = {
    row: [12],
    grid: [4, 4, 4],
    left: [3,9],
  };
  let [data, setData]= useState({});
  let [list, setList] = useState([]);
  let [progress, setProgress] = useState({});
  let [refuse, setRefuse]= useState({});

  const self = {
    clickApply: (index, alink) => {
      props.dialog.show(<BountyApply data={data} index={index} dialog={props.dialog} />, "Bounty Apply");
    },
    clickProcess:(index)=>{
      props.dialog.show(<BonusProcess data={data} index={index} dialog={props.dialog} />, `Bonus Process ( ${data.alink} )`);
    },
    getThumb: (index) => {
      if (!props.template || !props.template.series) return false;
      const all = props.template.series[index];
      return all.thumb[0];
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
    decodeProgress:(aps,bouns)=>{
      //console.log(aps,bouns)
      const map={}
      const rmap={};
      for(let i=0;i<aps.length;i++){
        const single=aps[i];
        if(single.judge && single.judge.name){
          const raw=single.judge.raw;
          if(bouns[raw.bonus]){
            const ser=bouns[raw.bonus].series;
            if(map[ser]===undefined) map[ser]=0;
            if(rmap[ser]===undefined) rmap[ser]=0;

            if(raw.result===true){
              map[ser]+=1;
            }else{
              rmap[ser]+=1;
            }
          }
        }
      }

      setProgress(map);
      setRefuse(rmap);
    },
    freshProgress:(apples)=>{
      self.getFullData(apples,(map)=>{
        const arr=[];
        for(let i=0;i<apples.length;i++){
          //regroup data by anchor data
          const single=apples[i];
          if(map[single.link]!==undefined) single.link=map[single.link];
          if(map[single.record]!==undefined) single.record=map[single.record];
          if(map[single.judge]!==undefined) single.judge=map[single.judge];
          if(map[single.distribute]!==undefined) single.distribute=map[single.distribute];
          arr.push(single);
        }
        //console.log(arr);
        self.decodeProgress(arr,props.data);
        //console.log(pg);
      });
    },
  }

  useEffect(() => {
    //console.log(props.bounty)
    if(props.bounty){
      if((typeof props.bounty)==="string"){
        API.bounty.view(props.bounty,(res)=>{
          if(!res.success) return false;    //FIXME, more operation here.
          const row=res.data;

          self.freshProgress(row.apply);
          TPL.view(row.template.cid,(dt)=>{
            row.template.raw=dt;
            setData(row);
          });
        });
      }else{
        setData(props.bounty);
        if(props.bounty && props.bounty.apply) self.freshProgress(props.bounty.apply);
      }
    }

    //3.show list of bonus
    if(props.data) setList(props.data);
    
  }, [props.data]);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        {list.map((row, index) => (
          <Row key={index} className="pt-2">
            <Col md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
              <img alt="" src={self.getThumb(row.series)} className="series_thumb pointer" onClick={(ev) => {
                self.clickProcess(index);
              }}/>
            </Col>
            <Col md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
              <Row>
                <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                  <strong>{row.bonus.toLocaleString()}</strong> ${props.coin.toUpperCase()} ( {!progress[row.series] ? 0 : progress[row.series]}/{row.amount} ) <br />
                  Left {row.amount-(!progress[row.series] ? 0 : progress[row.series])} wanted.
                </Col>
                <Col className="text-end" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                  <button className="btn btn-md btn-primary" hidden={row.amount===(!progress[row.series] ? 0 : progress[row.series])} onClick={(ev) => {
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