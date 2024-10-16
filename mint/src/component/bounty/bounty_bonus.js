import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import BountyApply from "./bounty_apply";
import BountyProgress from "./bounty_progress";
import BountyRedeem from "./bounty_redeem";


import tools from "../../lib/tools";
//import Local from "../../lib/local";
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

    let [bonus, setBonus] = useState([]);   //bonus list

    //`apply` and `redeem` buttons status 
    // data format: {INDEX:{apply:INFT_DETAIL,redeem:JUDGE_DETAIL,winner:[WINNER_ADDRESS]}}
    let [going, setGoing]= useState({});  
    let [status, setStatus]= useState({});  
    let [login, setLogin]= useState(false);     //wether login 

    const self = {
        clickApply:(index)=>{
            props.dialog(<BountyApply 
                dialog={props.dialog} 
                alink={props.alink} 
                bounty={props.bounty}
                index={index}
            />,"Bounty Apply");
        },
        clickRedeem:(index)=>{
            if(!going[index]) return false;
            const gs=going[index].going;
            const target=gs[0];     //dealing one by one, if there is more judged apply
            //console.log(gs);

            props.dialog(<BountyRedeem 
                dialog={props.dialog}
                bounty={props.bounty}
                inft={target.inft}
                judge={target.judge.alink}
            />,"Bounty Redeem");
        },
        clickProgress:(index)=>{
            props.dialog(<BountyProgress dialog={props.dialog} bounty={props.bounty} index={index}/>,"Apply Progress");
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
        getThumb: (index) => {
            //console.log(index);
            if(props.bounty){
                const all = props.bounty.template.series[index];
                if( props.bounty.template &&  
                    props.bounty.template.series && 
                    props.bounty.template.series[index]
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
        fresh:()=>{
            Account.address((addr)=>{
                if(addr.error) return setLogin(false);
                setLogin(true);
    
                if(props.bounty && props.bounty.system &&  props.bounty.system.apply) {
                    Bounty.group(tools.clone(props.bounty.system.apply),(map)=>{

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
        //console.log(props.bounty);
        console.log(props.alink);
        if (props.bounty && props.bounty.raw && props.bounty.raw.bonus){
            console.log(props.bounty.raw.bonus)
            setBonus(props.bounty.raw.bonus);
        } 
        self.fresh();

    }, [props.bounty]);

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
                                Prize: <strong className="text-info">{row.bonus}</strong> $ANK, <strong>{row.amount}</strong>P wanted
                            </Col>
                            <Col sm={size.row[0]} xs={size.row[0]}>
                                Rarity: 1 / <strong >{self.getRate(row.series).toLocaleString()}</strong> ( <strong className="text-warning">{self.getX(row.bonus,row.series).toLocaleString()}</strong> X )
                            </Col>
                            <Col sm={size.row[0]} xs={size.row[0]}>
                                Progress of bonus
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
                                    //console.log(going);
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