import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace } from "react-icons/fa";

import Bounty from "../bounty";
import Account from "../../system/account";
import Apply from "../../system/apply";
import INFT from "../../system/inft";
import BOUNTY from "../../system/bounty";

import Network from "../../network/router";
import tools from "../../lib/tools";


/* Bounty bonus redeem action
*   @param  {object}    bounty      //bounty data from parent
*   @param  {string}    alink       //bounty alink
*   @param  {string}    inft        //inft alink
*   @param  {string}    judge       //jugdement alink
*   @param  {number}    index       //bonus index
*   @param  {function}  dialog      //system dialog function
*/

function BountyRedeem(props) {
    const size = {
        row: [12],
        back: [9, 3],
        left:[8,4],
        half:[6],
        right:[3,9],
        target:[4,4,4]
    };

    const logo = `${window.location.origin}/image/logo.png`;        //iNFT logo url.
    let [password, setPassword] = useState("");
    let [disable, setDisable] =useState(true);

    let [iNFT, setINFT]= useState(logo);            //iNFT thumb
    let [from, setFrom]= useState("");              //iNFT owner to divert the anchor
    let [consignee, setConsignee]= useState("");    //accpet
    let [info, setInfo]= useState("");

    const self = {
        changePassword:(ev)=>{
            const pass=ev.target.value;
            setDisable(!pass?true:false);
            setPassword(pass);
        },
        clickBack: (ev) => {
            props.dialog(<Bounty dialog={props.dialog} alink={props.alink}/>, "Bounty");
        }, 
        clickDivert:(ev)=>{
            setDisable(true);  //avoid multi request
            if(!props.inft || !props.judge){
                setDisable(false);
                return setInfo("Invalid basic parameters.");
            }
            Account.keyring(password,(pair)=>{
                if(pair.error){
                    setPassword("");
                    return setInfo(pair.error);
                }
                const bounty_alink=`anchor://${props.bounty.name}/${props.bounty.block}`;
                const target=props.bounty.raw.consignee;
                Apply.divert(pair,props.inft,props.judge,bounty_alink,target,(done)=>{
                    if(done.error) return setInfo(done.error);
                    BOUNTY.view(props.alink,(bty)=>{
                        console.log(bty);
                        setDisable(true); 
                    },true);
                });
            });
        },
        getName:()=>{
            const ak=tools.decode(props.inft);
            return ak.name;
        },
        getBlock:()=>{
            const ak=tools.decode(props.inft);
            return ak.block;
        },
        renderINFT:(alink)=>{
            const ak=tools.decode(alink);
            const chain=Network("anchor");
            chain.view(ak,"anchor",(dt)=>{
                //console.log(dt);
                setFrom(dt.owner);
                INFT.single.thumb(dt.name,dt.raw,dt.hash,(bs64)=>{
                    setINFT(bs64);
                });
            });
        },
    }
    useEffect(() => {
        if(props.inft) self.renderINFT(props.inft);
        if(props.bounty){
            setConsignee(props.bounty.raw.consignee);
        }
    }, [props.inft]);

    return (
        <Row >
            <Col className="pt-2" sm={size.back[0]} xs={size.back[0]}>
                Your iNFT:
            </Col>
            <Col className="pb-2 text-end" sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev) => {
                    self.clickBack(ev);
                }} />
            </Col>
            <Col sm={size.right[0]} xs={size.right[0]}>
                <img alt="" src={iNFT} className="apply_thumb" />
            </Col>
            <Col sm={size.right[1]} xs={size.right[1]}>
                Name: {self.getName()}<br />
                Block: {self.getBlock()}
            </Col>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                Judgement:<strong>{props.judge}</strong>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col className="text-center" sm={size.target[0]} xs={size.target[0]}>
                <h6>You</h6>
                <img alt="" src={Account.avatar(from)} className="apply_thumb" />
                <h6>{tools.shorten(from,5)}</h6>
            </Col>
            <Col className="pt-4" sm={size.target[1]} xs={size.target[1]}>
                <p className="text-warning">After diverting, you will get the bonus prize.</p>
                <p>{"-------------->"}</p>
            </Col>
            <Col  className="text-center" sm={size.target[2]} xs={size.target[2]}>
                <h6>Consignee</h6>
                <img alt="" src={Account.avatar(consignee)} className="apply_thumb" />
                <h6>{tools.shorten(consignee,5)}</h6>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col className="pt-2" sm={size.left[0]} xs={size.left[0]}>
                <input 
                    type="password" 
                    className="form-control"
                    placeholder="Password to divert"
                    hidden={false}
                    value={password} 
                    onChange={(ev) => {
                        self.changePassword(ev);
                    }} />
            </Col>

            <Col className="pt-2 text-end" sm={size.left[1]} xs={size.left[1]}>
                <button className="btn btn-md btn-primary" disabled={disable} onClick={(ev)=>{
                    self.clickDivert(ev);
                }}>Redeem</button>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                {info}
            </Col>
        </Row>
    )
}

export default BountyRedeem;