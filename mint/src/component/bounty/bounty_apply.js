import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace } from "react-icons/fa";

import Bounty from "../bounty";
import INFT from "../../system/inft";
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
        back:[9,3],
        half:[6],
        left:[9,3]
    };

    let [search, setSearch]=useState("");
    let [infoSearch, setInfoSearch]=useState("");
    let [wanted, setWanted]=useState(`${window.location.origin}/image/logo.png`);       //wanted iNFT thumb
    let [mine, setMine]=useState(`${window.location.origin}/image/logo.png`);           //your iNFT thumb
    let [disabe, setDisable]=useState(true);
    let [info, setInfo]=useState("");           //apply infomation

    const self = {
        changeSearch:(ev)=>{
            setSearch(ev.target.value);
            setInfoSearch("");
            self.search(ev.target.value);
        },
        clickBack:(ev)=>{
            props.dialog(<Bounty dialog={props.dialog} alink={props.alink}/>,"Bounty");
        },

        //ivnfxmtfhjbc_10
        search:(name)=>{
            const chain=Network("anchor");
            chain.view({name:name},"anchor",(inft)=>{
                //console.log(inft);
                if(inft===false) return setInfoSearch("No such iNFT");
                if (!inft.protocol || 
                    !inft.protocol.fmt || 
                    !inft.protocol.tpl || 
                    inft.protocol.tpl !== "inft"
                ) return setInfoSearch(`Invalid iNFT`);

                //1.get the thumb to show
                inft.raw.hash=inft.hash;
                INFT.single.thumb(inft.raw,(dt)=>{
                    console.log(dt);
                });

                //2.check the applying iNFT validity.

            });
        },
        getThumb:()=>{

        },
        fresh:()=>{
            const raw=props.bounty.template.raw;
            const bs=props.bounty.orgin.raw.bonus;
            const series=bs[props.index].series;
            const target=raw.series[series];
            setWanted(target.thumb[0]);

            console.log(target);
        },
    }
    useEffect(() => {
       if(props.bounty) self.fresh();
    }, [props.index,props.alink]);

    return (
        <Row >
            <Col className="pt-2" sm={size.back[0]} xs={size.back[0]}>
                {props.alink}
            </Col>
            <Col className="pb-2 text-end" sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev) => {
                    self.clickBack(ev);
                }} />
            </Col>

            <Col sm={size.row[0]} xs={size.row[0]}>
                <input type="text" className="form-control" placeholder="iNFT name." value={search} onChange={(ev)=>{
                    self.changeSearch(ev);
                }}/>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>{infoSearch}</Col>
            
            <Col className="text-center pt-4" sm={size.half[0]} xs={size.half[0]}>
                <h6>Yours</h6>
                <img alt="" src={mine} className="apply_thumb"/>
            </Col>
            <Col className="text-center pt-4" sm={size.half[0]} xs={size.half[0]}>
                <h6>Wanted</h6>
                <img alt="" src={wanted} className="apply_thumb"/>
            </Col>
            <Col className="pt-4" sm={size.left[0]} xs={size.left[0]}>
               {info}
            </Col>
            <Col className="pt-4 text-end"  sm={size.left[1]} xs={size.left[1]}>
                <button className="btn btn-md btn-primary" disabled={disabe}>Apply</button>
            </Col>
            {/* <Col  sm={size.row[0]} xs={size.row[0]}>
               22/100 Progress of bonus.
            </Col> */}
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                Approved iNFT list to divert
            </Col>
        </Row>
    )
}

export default BountyApply;