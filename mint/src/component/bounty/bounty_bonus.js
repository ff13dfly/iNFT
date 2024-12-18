import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import BountyApply from "./bounty_apply";
import BountyProgress from "./bounty_progress";
import BountyRedeem from "./bounty_redeem";
import Entry from "../bounty";

import tools from "../../lib/tools";
import Network from "../../network/router";
import Account from "../../system/account";
import Bounty from "../../system/bounty";

/* Bounty bonus list, the entry to apply and check the progress
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

    let [bounty, setBounty] = useState({});
    let [bonus, setBonus] = useState([]);   //bonus list

    let [going, setGoing]= useState({});  
    let [status, setStatus]= useState({});  
    let [login, setLogin]= useState(false);     //wether login 

    const self = {
        clickApply:(index)=>{
            props.dialog.show(<BountyApply 
                dialog={props.dialog} 
                alink={props.alink} 
                bounty={bounty}
                index={index}
            />,"Bounty Apply");
        },
        clickRedeem:(index)=>{
            if(!going[index]) return false;
            const gs=going[index].going;
            Account.address((addr)=>{
                const vs=[];
                for(let i=0;i<gs.length;i++){
                    const row=gs[i];
                    if(row.apply && row.apply.signer===addr) vs.push(row);
                }
                if(vs.length===0) return false;
                const target=vs[0];     //dealing one by one, if there is more judged apply
                props.dialog.show(<BountyRedeem 
                    dialog={props.dialog}
                    alink={props.alink}
                    bounty={bounty}
                    inft={target.inft}
                    judge={target.judge.alink}
                />,"Bounty Redeem");
            });
        },
        clickProgress:(index)=>{
            props.dialog.show(<BountyProgress 
                dialog={props.dialog} 
                alink={props.alink} 
                index={index}
                callback={()=>{
                    props.dialog.show(<Entry alink={props.alink} dialog={props.dialog} />,"Bounty")
                }}
            />,"Apply Progress");
        },
        
        calcRarity: (parts, index) => {
            //console.log(parts, index)
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
            if(!bounty || 
                !bounty.template ||
                !bounty.template.parts
            ) return "NaN";
            return self.calcRarity(bounty.template.parts,index);
        },
        getX:(prize,index)=>{
            const rate=self.getRate(index);
            if(rate==="NaN") return rate;
            const chain=Network("anchor");
            return parseInt(prize*chain.accuracy()/rate);
        },
        getThumb: (index) => {
            if(bounty){
                const all = bounty.template.series[index];
                if( bounty.template &&  
                    bounty.template.series && 
                    bounty.template.series[index]
                )return all.thumb[0];
                return "";
            }
            return "";
        },

        groupByAccount:(map,address)=>{
            const status={};
            for(let index in map){
                const going=map[index].going;
                if(going.length===0) continue;

                for(let i=0;i<going.length;i++){
                    const row=going[i];
                    if(row.apply && 
                        row.apply.signer===address && 
                        row.judge &&
                        row.judge.result===true
                    ){
                        status[index]={
                            redeem:true,
                        };
                    }
                }
            }
            return status;
        },
        fresh:(bt)=>{
            Account.address((addr)=>{
                if(addr.error) return setLogin(false);
                setLogin(true);
    
                if(bt && bt.system &&  bt.system.apply) {
                    Bounty.group(tools.clone(bt.system.apply),(map)=>{
                        if(map.error) return false;

                        setGoing(map);      //cache the grouped data;
                        const redeem=self.groupByAccount(map,addr);
                        setStatus(redeem);      //set reddeem status;
                    });
                }
            });
        },
    }
    useEffect(() => {
        //console.log(`Bonus:${props.alink}`)
        if(props.alink){
            Bounty.view(props.alink,(bt)=>{
                if(bt.error) return false;
                setBounty(bt);
                setBonus(bt.raw.bonus);

                self.fresh(bt);
            });
        }
    }, [props.alink]);

    return (
        <Col sm={size.row[0]} xs={size.row[0]}>
            <div className="bonus-container">
            {bonus.map((row, index) => (
                <Row key={index}>
                    <Col className="pt-2" sm={size.right[0]} xs={size.right[0]}>
                        <img alt="" src={self.getThumb(row.series)} className="series_thumb pointer" onClick={(ev)=>{
                            self.clickProgress(index);
                        }} />
                    </Col>
                    <Col className="pt-2" sm={size.right[1]} xs={size.right[1]}>

                        <Row>
                            <Col sm={size.row[0]} xs={size.row[0]}>
                                <strong className="text-warning">{self.getX(row.bonus,row.series).toLocaleString()}</strong>x return
                            </Col>
                            <Col sm={size.row[0]} xs={size.row[0]}>
                                Prize: <strong className="text-info">{row.bonus}</strong> $ANK, <strong>{row.amount}</strong>P wanted
                            </Col>
                            <Col sm={size.row[0]} xs={size.row[0]}>
                                Rarity: 1 / <strong >{self.getRate(row.series).toLocaleString()}</strong>
                            </Col>
                        </Row>

                        <Row hidden={login}>
                            <Col className="text-end" sm={size.row[0]} xs={size.row[0]}>
                                <button className="btn btn-sm btn-primary" onClick={(ev)=>{
                                    
                                }}>Login</button>
                            </Col>
                        </Row>

                        <Row hidden={!login || status[index]}>
                            <Col  sm={size.left[0]} xs={size.left[0]}>
                            </Col>
                            <Col className="text-end" sm={size.left[1]} xs={size.left[1]}>
                                <button className="btn btn-sm btn-primary" onClick={(ev)=>{
                                    self.clickApply(index);
                                }}>Apply</button>
                            </Col>
                        </Row>

                        <Row hidden={!login || !status[index]}>
                            <Col className="pt-1 text-info" sm={size.left[0]} xs={size.left[0]}>
                                Great! Get prize now!
                            </Col>
                            <Col className="text-end" sm={size.left[1]} xs={size.left[1]}>
                                <button className="btn btn-sm btn-primary" onClick={(ev)=>{
                                    self.clickRedeem(index);
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