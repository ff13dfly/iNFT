import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace } from "react-icons/fa";

import Bounty from "../bounty";


import Network from "../../network/router";

function BountyApply(props) {
    const size = {
        row: [12],
        back:[9,3],
        half:[6],
    };

    let [search, setSearch]=useState("");

    const self = {
        changeSearch:(ev)=>{
            setSearch(ev.target.value);
            self.search(ev.target.value,(dt)=>{
                console.log(dt);
            });
        },
        clickBack:(ev)=>{
            props.dialog(<Bounty dialog={props.dialog} alink={props.alink}/>,"Bounty");
        },
        search:(name,ck)=>{
            const chain=Network("anchor");
            chain.view({name:name},"anchor",(dt)=>{
                console.log(dt);
            });
        },
    }
    useEffect(() => {
       console.log(props);
    }, []);

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

            <Col  sm={size.row[0]} xs={size.row[0]}>
               22/100 Progress of bonus.
            </Col>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <input type="text" className="form-control" placeholder="iNFT name." value={search} onChange={(ev)=>{
                    self.changeSearch(ev);
                }}/>
            </Col>
            <Col className="" sm={size.half[0]} xs={size.half[0]}>
                Your iNFT
            </Col>
            <Col className="" sm={size.half[0]} xs={size.half[0]}>
                Wanted
            </Col>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                Winner Thumb List
            </Col>
        </Row>
    )
}

export default BountyApply;