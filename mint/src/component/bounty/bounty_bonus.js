import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import BountyApply from "./bounty_apply";
import BountyProgress from "./bounty_progress";
import BountyRedeem from "./bounty_redeem";

import Network from "../../network/router";
import Account from "../../system/account";
import tools from "../../lib/tools";
import Local from "../../lib/local";

/* Bounty bonus list, the entry to apply and check the progress
*   @param  {array}     data        //bonus list
*   @param  {object}    bounty      //bounty data from parent
*   @param  {string}    alink       //bounty anchor link of bounty
*   @param  {boolean}   ticket      //wether bounty ticket exsist
*   @param  {function}  dialog      //system dialog function
*/

function BountyBonus(props) {
    const size = {
        row: [12],
        right: [3, 9],
        left:[8,4],
    };

    let [bonus, setBonus] = useState([]);   //bonus list
    let [show,setShow] = useState(false);   //wether show apply button
    let [divert, setDivert]= useState({});  //divert buttons 
    let [judge, setJudge]= useState({});  //divert buttons 

    const self = {
        clickApply:(index)=>{
            props.dialog(<BountyApply 
                dialog={props.dialog} 
                alink={props.alink} 
                bounty={props.bounty}
                index={index}
            />,"Bounty Apply");
        },
        clickDivert:(inft,judge_alink)=>{
            props.dialog(<BountyRedeem 
                dialog={props.dialog}
                bounty={props.bounty}
                inft={inft}
                judge={judge_alink}
            />,"Bounty Redeem");
        },
        clickProgress:(ev)=>{
            props.dialog(<BountyProgress dialog={props.dialog} alink={props.alink}/>,"Apply Progress");
        },
        getThumb: (index) => {
            if(props.bounty){
                const all = props.bounty.template.series[index];
                return all.thumb[0];
            }
            return "";
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
            return parseInt(m / n);
        },
        getRate:(index)=>{
            if(!props.bounty || 
                !props.bounty.template ||
                !props.bounty.template.parts
            ) return "NaN";
            return self.calcRarity(props.bounty.template.parts,index);
        },
        getX:(prize,index)=>{
            const rate=self.getRate(index);
            if(rate==="NaN") return rate;
            const chain=Network("anchor");
            return parseInt(prize*chain.accuracy()/rate);
        },

        checkApply:()=>{
            if(props.ticket!==undefined && props.ticket===false) return setShow(true);
            Account.address((addr)=>{
                if(addr.error) return setShow(false);

                const ak=tools.decode(props.alink);
                const chain=Network("anchor");
                chain.bounty.check(ak.name,ak.block,addr,(bought)=>{
                    if(bought===false) return setShow(false);
                    setShow(true);
                });
            })
        },
        getApplyRecord:()=>{
            const str=Local.get("apply");
            if(!str) return false;
            try {
                return JSON.parse(str);
            } catch (error) {
                return false;
            }
        },
        getAnchor:(alink,ck)=>{
            const ak=tools.decode(alink);
            const chain=Network("anchor");
            chain.view(ak,"anchor",ck);
        },
        checkDivert:(apls,ck)=>{
            const map=self.getApplyRecord();
            for(let i=0;i<apls.length;i++){
                const row=apls[i];
                if(map[row.apply] && row.judge){
                    //console.log(row.judge);
                    //console.log(`Got apply, ready to check. ${row.apply}`,row);
                    self.getAnchor(row.judge,(judge)=>{
                        if(judge && judge.raw && judge.raw.result===true){

                            divert[judge.raw.bonus]=judge.raw.inft;
                            setDivert(tools.clone(divert));

                            judge[judge.raw.bonus]=row.judge;
                            setJudge(tools.clone(judge));
                        }
                    });
                }
            }
        },
    }
    useEffect(() => {
        //console.log(props.bounty);
        self.checkApply();
        if(props.bounty.system)  self.checkDivert(props.bounty.system.apply,()=>{

        });

        if (props.data) setBonus(props.data);
    }, [props.bounty,props.ticket,props.alink]);

    return (
        <Col sm={size.row[0]} xs={size.row[0]}>
            <div className="bonus-container">

            
            {bonus.map((row, index) => (
                <Row key={index}>
                    <Col className="pt-2" sm={size.right[0]} xs={size.right[0]}>
                        <img alt="" src={self.getThumb(row.series)} className="series_thumb pointer" onClick={(ev)=>{
                            self.clickProgress(ev);
                        }} />
                    </Col>
                    <Col className="pt-2" sm={size.right[1]} xs={size.right[1]}>
                        <Row>
                            <Col sm={size.row[0]} xs={size.row[0]}>
                                Prize: <strong className="text-info">{row.bonus}</strong> $ANK, <strong>{row.amount}</strong>P wanted
                            </Col>
                            <Col sm={size.row[0]} xs={size.row[0]}>
                                Rarity: 1 / <strong >{self.getRate(row.series).toLocaleString()}</strong> ( <strong className="text-warning">{self.getX(row.bonus,row.series).toLocaleString()}</strong> X )
                            </Col>
                            <Col sm={size.row[0]} xs={size.row[0]}>
                                Progress of bonus
                            </Col>

                            <Col hidden={divert[index]} sm={size.left[0]} xs={size.left[0]}>
                                {/* {"<--"} click to check */}
                            </Col>
                            <Col hidden={divert[index]} className="text-end" sm={size.left[1]} xs={size.left[1]}>
                                <button className="btn btn-sm btn-primary" hidden={!show} onClick={(ev)=>{
                                    self.clickApply(index);
                                }}>Apply</button>
                            </Col>

                            <Col hidden={!divert[index]} className="pt-1 text-info" sm={size.left[0]} xs={size.left[0]}>
                                Great! Get prize now!
                            </Col>
                            <Col hidden={!divert[index]} className="text-end" sm={size.left[1]} xs={size.left[1]}>
                                <button className="btn btn-sm btn-primary" hidden={!show} onClick={(ev)=>{
                                    self.clickDivert(divert[index],judge[index]);
                                }}>Redeem</button>
                            </Col>

                        </Row>
                    </Col>
                    <Col sm={size.row[0]} xs={size.row[0]}>
                        <hr />
                    </Col>
                </Row>
            ))}
            </div>
        </Col>
    )
}

export default BountyBonus;