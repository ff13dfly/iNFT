import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { FaComments } from "react-icons/fa";

import BountyBoard from "./bounty_board";

function BountyChat(props) {
    const size = {
        row: [12],
        left: [8, 4],
    };


    const self = {
        clickChat:(ev)=>{
            props.dialog(<BountyBoard 
                dialog={props.dialog} 
                alink={props.alink}
            />,"Bounty Comments");
        }
    }
    useEffect(() => {
       
    }, []);

    return (
        <Row hidden={false}>
            <Col className="pt-2" sm={size.left[0]} xs={size.left[0]}>
                chat fresh here.
            </Col>
            <Col className="text-end" sm={size.left[1]} xs={size.left[1]}>
                <button className="btn btn-sm btn-secondary" onClick={(ev)=>{
                    self.clickChat(ev)
                }}>
                    <FaComments className="text-info" size={24} />
                </button>
            </Col>
        </Row>
    )
}

export default BountyChat;