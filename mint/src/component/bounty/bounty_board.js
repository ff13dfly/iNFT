import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace,FaRegCommentDots } from "react-icons/fa";

import Bounty from "../bounty";

function BountyBoard(props) {
    const size = {
        row: [12],
        back:[9,3],
        left: [10,2],
    };


    const self = {
        clickBack:(ev)=>{
            props.dialog(<Bounty dialog={props.dialog} alink={props.alink}/>,"Bounty");
        },
    }
    useEffect(() => {
       
    }, []);

    return (
        <Row hidden={false}>
            <Col className="pt-2" sm={size.back[0]} xs={size.back[0]}>
                {props.alink}
            </Col>
            <Col className="pb-2 text-end" sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev) => {
                    self.clickBack(ev);
                }} />
            </Col>

            <Col className="" sm={size.left[0]} xs={size.left[0]}>
                <input type="text" className="form-control" placeholder="Message about bounty..." />
            </Col>
            <Col className="text-end" sm={size.left[1]} xs={size.left[1]}>
               <button className="btn btn-sm btn-secondary">
                    <FaRegCommentDots className="text-info" size={24}/>
                </button>
            </Col>
        </Row>
    )
}

export default BountyBoard;