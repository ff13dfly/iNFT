import { Row, Col, Image } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaLightbulb,FaPencilAlt,FaBalanceScale,FaFunnelDollar,FaPaperPlane } from "react-icons/fa";

import { FaCopy } from "react-icons/fa";

import BountyApply from "./bounty_apply";

import Account from "../../system/account";
import API from "../../system/api";
import Network from "../../network/router";
import RUNTIME from "../../system/runtime";

import tools from "../../lib/tools";

/* Show the progress of bonus
*   @param  {object}    props.raw         //raw bounty data from backend, the anchor data is docked on key "orgin"
*   @param  {object}    props.template    //template data 
*   @param  {number}    props.index       //index of bonus
*   @param  {function}  props.dialog      //system dialog 
*/

function BonusProcess(props) {
  const size = {
    row: [12],
    head: [4, 8],
    half: [6],
    apply: [3,9],
    winner:[3],
    divert:[9,3],
  };

  let [list, setList] = useState([]);
  let [winners,setWinners] = useState([]);
  let [password, setPassword] = useState({});
  let [info, setInfo]= useState({});

  const self = {
    changePassword:(ev,name)=>{
      password[name]=ev.target.value;
      setPassword(tools.clone(password));
    },
    clickApply: () => {
      props.dialog.close();
      setTimeout(() => {
        props.dialog.show(<BountyApply data={props.data} index={props.index} dialog={props.dialog} fresh={props.fresh} />, "Bounty Apply");
      }, 200);
    },
    clickDivert:(name,addr,index)=>{
      const chain=Network("anchor");
      const ak=tools.decode(props.data.alink);
      chain.view(ak,"anchor",(dt)=>{
        const target=props.data.orgin.raw.consignee;
        Account.get(addr,(file)=>{
          try {
            chain.load(JSON.stringify(file[0]), password[name], (pair) => {
              chain.divert(pair,name,target,(res)=>{
                //fresh target 
                info[ak.name]=res.message;
                setInfo(tools.clone(info));

                if(res.status==="Finalized"){
                  API.bounty.divert(props.data.alink,index,res.hash,(final)=>{
                    if(final.success){
                      info[ak.name]="";
                      setInfo(tools.clone(info));   //set messsage

                      if(props.fresh) props.fresh();    //fresh bounty data
                    }
                  });
                }
              });
            });
          }catch (error) {
            
          }
        });
      });
    },
    
    getTarget: () => {
      if (props.data.orgin && props.data.orgin.raw && props.data.orgin.raw.bonus) {
        const bs = props.data.orgin.raw.bonus;
        const target = bs[props.index];
        const ss = props.template.series;
        const series = ss[target.series];
        return series.thumb[0];
      }
      return `${window.location.origin}/imgs/logo.png`;
    },
    getCreateStamp:(stamp)=>{
      const dd=new Date(stamp);
      return dd.toLocaleDateString();
    },
    getApplyStatus: (row) => {
      //console.log(row);
      const judge=row.judge;
      const distribute=row.distribute;
      if(distribute!==null) return "Distribute";
      if (judge === null) return "Pending, waiting for judgement.";
      if(judge.raw.result===false) return  "Refused, try more, :-)";
      if(row.divert!=="") return  "Congratulation, waiting for prize!";
      return "Acceptted, please divert the iNFT."
    },
    disabeDivert:(row)=>{
      if(!Account.exsist(row.inft.owner)) return true;
      if(row.divert!=="") return true;
      if(!password[row.inft.name]) return true;
      return false;
    },
    //check wether hide the divert operation part
    hideDivert:(row)=>{
      if(row.judge===null) return true;
      if(row.distribute!==null) return true;
      if(row.divert!=="") return true;
      if(row.judge.raw.result===false) return true;   //if refused, hide divert operation
      return false;
    },
    applyList: (aps, index) => {
      //1.filter out the bonus submissions
      const arr = [];
      for (let i = 0; i < aps.length; i++) {
        const row = aps[i];
        const atom = { inft: null, judge: null, distribute: null,divert:"",index:i }
        if (row.record && row.record.raw && row.record.raw.bounty && row.record.raw.bounty.bonus === index) {
          atom.inft = row.link;
          atom.record=row.record;
          if (row.judge && row.judge.raw) {
            atom.judge = row.judge;
          }

          if (row.distribute && row.distribute.raw) {
            atom.distribute = row.distribute;
          }

          if(row.divert) atom.divert=row.divert

          arr.push(atom);
        }
      }
      setList(arr.reverse());   //put the latest on top of the list

      //2.filter out the winners;
      const ws=self.getWinners(arr);
      setWinners(ws);
    },
    getWinners:(arr)=>{
      const nlist=[];
      for (let i = 0; i < arr.length; i++) {
        const row=arr[i];
        if(row.judge!==null && row.judge.raw && row.judge.raw.result){
          nlist.push({
            address:row.record.raw.receiver.address,
          });
        }
      }
      return nlist;
    },
    getAnchorLink:(data)=>{
      if(data===null) return "Not yet.";
      return `anchor://${data.name}/${data.block}`
    },
    calcRarity: (parts, index) => {
      let n = 1;    //target
      let m = 1;    //sum
      for (let i = 0; i < parts.length; i++) {
        const row = parts[i];
        const rt = row.rarity[index];
        const divide = row.value[2];
        n = n * rt.length;
        m = m * divide;
      }
      return parseInt(m / n).toLocaleString();
    },
    getSeriesOption:()=>{
      const series=props.template.series;
      const target=series[props.index];
      return target.count.toLocaleString();
    },
  }

  useEffect(() => {
    //need to map the local account first, then the Account.exsist is aync
    Account.map((res)=>{
      self.applyList(props.data.apply, props.index);
    });
  }, [props.raw,props.template]);

  return (
    <Row>
      <Col md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]} >
        <h5>Wanted</h5>
        <img src={self.getTarget()} className="apply_thumb" alt="" />
        <span>Create on {self.getCreateStamp(parseInt(props.data.ctime)*1000)}</span>
      </Col>
      <Col md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]} >
        <Row>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
            <strong>Bonus #{props.index}</strong>, {props.data.orgin.raw.desc}
          </Col>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
            <strong>Prize</strong>: <strong className="text-warning mr-5">{props.data.orgin.raw.bonus[props.index].bonus}</strong>
            ${props.data.orgin.raw.coin.toUpperCase()}
          </Col>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
            Gene series {props.data.orgin.raw.bonus[props.index].series}, 
            total <strong>{self.getSeriesOption()}</strong> options, 
            rarity <strong>1/{self.calcRarity(props.template.parts,props.index)}</strong>.  
          </Col>
          <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
            Progress: {props.data.orgin.raw.bonus[props.index].amount} wanted, {list.length} submission
          </Col>
          <Col className="text-end" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
            <button className="btn btn-md btn-primary" onClick={(ev) => {
              self.clickApply();
            }}>Apply</button>
          </Col>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
            Winners
          </Col>
          <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
            <Row>
            {winners.map((row, index) => (
              <Col key={index} className="text-center"  md={size.winner[0]} lg={size.winner[0]} xl={size.winner[0]} xxl={size.winner[0]} >
                
                <Image
                  src={RUNTIME.account.avatar(row.address)}
                  rounded
                  width="100%"
                  style={{ minHeight: "80px" }}
                />
                {tools.shorten(row.address,4)}
              </Col>
            ))}
            </Row>
          </Col>
        </Row>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        <hr />
      </Col>
      <Col md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]} >
        <h5>Submission</h5>
      </Col>
      <Col className="text-end" md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]} >
        Total {list.length} iNFTs
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        <Row className="container_apply">
          {list.map((row, index) => (
            <Col className="pb-3" key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
              <Row>
                <Col md={size.apply[0]} lg={size.apply[0]} xl={size.apply[0]} xxl={size.apply[0]} >
                  <img src={row.inft.bs64} className="apply_thumb" alt="" />
                  <strong>anchor://{row.inft.name}/{row.inft.block}</strong>
                </Col>
                <Col md={size.apply[1]} lg={size.apply[1]} xl={size.apply[1]} xxl={size.apply[1]} >
                  <Row>
                    
                    <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                      Owned by <strong>{tools.shorten(row.inft.owner)}</strong>
                      <span className="pointer ml-10"><FaCopy size={20}/></span>
                    </Col>
                    <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                      <FaLightbulb className="text-secondary mr-5" size={18}/> <strong className="text-info">{self.getApplyStatus(row)}</strong>
                    </Col>
                    <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                      <FaPencilAlt className="text-secondary mr-5" size={18}/> {self.getAnchorLink(row.record)}
                    </Col>
                    <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                      <FaBalanceScale className="text-secondary mr-5" size={18}/> {self.getAnchorLink(row.judge)}
                    </Col>
                    <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                      <FaPaperPlane className="text-secondary mr-5" size={18}/> {!row.divert?"Not yet.":tools.shorten(row.divert,20)}
                    </Col>
                    <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                      <FaFunnelDollar className="text-secondary mr-5" size={18}/> {self.getAnchorLink(row.distribute)}
                    </Col>
                    <Col hidden={self.hideDivert(row)} className="text-end pt-1" md={size.divert[0]} lg={size.divert[0]} xl={size.divert[0]} xxl={size.divert[0]} >
                      <input type="password"  className="form-control" 
                        placeholder={`Password of ${tools.shorten(row.inft.owner)}`} onChange={(ev)=>{
                          self.changePassword(ev,row.inft.name);
                        }}/>
                      <small>{!info[row.inft.name]?"":info[row.inft.name]}</small>
                    </Col>
                    <Col hidden={self.hideDivert(row)} className="text-end pt-1" md={size.divert[1]} lg={size.divert[1]} xl={size.divert[1]} xxl={size.divert[1]} >
                      <button 
                        disabled={self.disabeDivert(row)}
                        className={!self.disabeDivert(row)?"btn btn-md btn-primary":"btn btn-sm btn-default"} 
                        onClick={(ev)=>{
                          self.clickDivert(row.inft.name,row.inft.owner,row.index);
                        }}>Divert</button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      </Col>
      <Col className="pt-4" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
        Bounty start from {props.data.start && parseInt(props.data.start).toLocaleString()} to {props.data.end && parseInt(props.data.end).toLocaleString()}
      </Col>
    </Row>
  );
}
export default BonusProcess;