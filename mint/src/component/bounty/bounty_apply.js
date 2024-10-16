import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace } from "react-icons/fa";

import Bounty from "../bounty";
import INFT from "../../system/inft";
import Apply from "../../system/apply";
import Account from "../../system/account";
import Network from "../../network/router";

/* Bounty apply page, need to check the iNFT status
*   @param  {number}    index       //bonus index to apply
*   @param  {object}    bounty      //bounty data from parent
*   @param  {string}    alink       //bounty anchor link of bounty
*   @param  {function}  dialog      //system dialog function
*/

function BountyApply(props) {
    const size = {
        row: [12],
        back: [9, 3],
        half: [6],
        left: [8, 4]
    };

    const logo = `${window.location.origin}/image/logo.png`;

    let [search, setSearch] = useState("");
    let [infoSearch, setInfoSearch] = useState(props.alink);
    let [wanted, setWanted] = useState(logo);       //wanted iNFT thumb
    let [mine, setMine] = useState(logo);           //your iNFT thumb
    let [disableSearch, setDisableSearch] = useState(false);   //search input disable
    let [disabeApply, setDisablApply] = useState(true);        //apply button disable
    let [password, setPassword] = useState("");       //password of account
    let [hidePassword, setHidePassword]=useState(true);
    let [info, setInfo] = useState("");           //apply infomation


    const self = {
        changeSearch: (ev) => {
            setSearch(ev.target.value);
            setInfoSearch(props.alink);
            self.search(ev.target.value);
        },
        changePassword:(ev)=>{
            const pass=ev.target.value;
            setDisablApply(!pass?true:false);
            setPassword(pass);
        },
        clickBack: (ev) => {
            props.dialog(<Bounty dialog={props.dialog} alink={props.alink} />, "Bounty");
        },
        clickApply:(ev)=>{
            //console.log(`ready to apply`);
            setInfo("");
            setDisableSearch(true);
            //1. write the apply on chain
            Account.keyring(password,(pair)=>{
                if(pair.error){
                    setPassword("");
                    return setInfo(pair.error);
                }

                self.getAnchor(search,(inft)=>{
                    if(inft.error){
                        setPassword("");
                        return setInfo(inft.error);
                    }

                    setPassword("");
                    setDisablApply(true);
                    Apply.submit(pair,inft,props.alink,props.index,(status)=>{
                        
                        if(status.error){
                            return setInfo(`Apply server error.`);
                        }
                    
                        setDisablApply(false);      //recover apply button
                        setInfo("Done");
                        setSearch("");
                        setTimeout(() => {
                            setInfo("");
                        }, 1500);
                    });
                });
            });
        },
        //ivnfxmtfhjbc_10
        search: (name) => {
            if (!name) {
                setMine(logo);
                return setInfoSearch(props.alink);
            }

            self.getAnchor(name,(inft)=>{
                if(inft.error){
                    setMine(logo);
                    return setInfoSearch(inft.error);
                }

                //inft.raw.hash = inft.hash;
                INFT.single.thumb(inft.name,inft.raw,inft.hash, (bs64) => {
                    setMine(bs64);
                });

                //2.check the applying iNFT validity.
                const parts=props.bounty.template.parts;
                const offset=inft.raw.offset;
                if(!self.checkRarity(parts,inft.hash,offset,props.index)){
                    return setInfoSearch(`Not wanted.`);
                }else{
                    setInfoSearch(`Great! Ready to apply`);
                    setHidePassword(false);
                }
            });
        },
        calcSelected:(hash,start,step,divide,offset)=>{
            const hex=hash.slice(start + 2, start + 2 + step);
            const val=parseInt(`0x${hex}`);
            return (val+offset)%divide;
        },
        getAnchor:(name,ck)=>{
            const chain = Network("anchor");
            chain.view({ name: name }, "anchor", (inft) => {
                if (inft === false) return ck && ck({error:"No such anchor."});
                if (!inft.protocol ||
                    !inft.protocol.fmt ||
                    !inft.protocol.tpl ||
                    inft.protocol.tpl !== "inft"
                ) return ck && ck({error:"Invalid iNFT."});

                return ck && ck(inft);
            });
        },
        checkRarity:(parts,hash,offset,index)=>{
            //return true;
            //console.log(parts,hash,offset,index);
            for(let i=0;i<parts.length;i++){
                const part=parts[i];
                const [start,step,divide,tpl_offset]=part.value;
                const noffset=tpl_offset+(offset!==undefined?offset[i]:0)
                const val=self.calcSelected(hash,start,step,divide,noffset);
                const arr_rare=part.rarity[index];      //rarity array
                if(!arr_rare.includes(val)) return false;
            }
            return true;
        },
        fresh: () => {
            const raw = props.bounty.template;
            const bs = props.bounty.raw.bonus;
            const series = bs[props.index].series;
            const target = raw.series[series];
            setWanted(target.thumb[0]);
        },
    }
    useEffect(() => {
        if (props.bounty) self.fresh();
    }, [props.index, props.alink]);

    return (
        <Row >
            <Col className="pt-2" sm={size.back[0]} xs={size.back[0]}>
                {infoSearch}
            </Col>
            <Col className="pb-2 text-end" sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev) => {
                    self.clickBack(ev);
                }} />
            </Col>

            <Col sm={size.row[0]} xs={size.row[0]}>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="iNFT name." 
                    disabled={disableSearch}
                    value={search} onChange={(ev) => {
                        self.changeSearch(ev);
                    }} />
            </Col>
            <Col className="text-center pt-4" sm={size.half[0]} xs={size.half[0]}>
                <h6>Yours</h6>
                <img alt="" src={mine} className="apply_thumb" />
            </Col>
            <Col className="text-center pt-4" sm={size.half[0]} xs={size.half[0]}>
                <h6>Wanted</h6>
                <img alt="" src={wanted} className="apply_thumb" />
            </Col>
            <Col className="pt-4" sm={size.left[0]} xs={size.left[0]}>
                <input 
                    type="password" 
                    className="form-control"
                    placeholder="Password of account to apply"
                    hidden={hidePassword}
                    value={password} 
                    onChange={(ev) => {
                        self.changePassword(ev);
                    }} />
            </Col>
            <Col className="pt-4 text-end" sm={size.left[1]} xs={size.left[1]}>
                <button className="btn btn-md btn-primary" disabled={disabeApply} onClick={(ev)=>{
                    self.clickApply(ev);
                }}>Apply</button>
            </Col>
            <Col className="" sm={size.row[0]} xs={size.row[0]}>
                {info}
            </Col>
            {/* <Col  sm={size.row[0]} xs={size.row[0]}>
               22/100 Progress of bonus.
            </Col> */}
            {/* <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                Approved iNFT list to divert
            </Col> */}
        </Row>
    )
}

export default BountyApply;