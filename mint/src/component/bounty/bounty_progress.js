import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace } from "react-icons/fa";

import Bounty from "../bounty";

function BountyProgress(props) {
    const size = {
        row: [12],
        back:[9,3],
    };


    const self = {
        clickBack:(ev)=>{
            props.dialog(<Bounty dialog={props.dialog} alink={props.alink}/>,"Bounty");
        },
    }
    useEffect(() => {
       
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

            <Col sm={size.row[0]} xs={size.row[0]}>
                Bounty progress list.
            </Col>
        </Row>
    )
}

export default BountyProgress;