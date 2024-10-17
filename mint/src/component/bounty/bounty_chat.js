import { Row, Col, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { FaComments } from "react-icons/fa";

import BountyBoard from "./bounty_board";

import Account from "../../system/account";

function BountyChat(props) {
    const size = {
        row: [12],
        left: [10, 2],
        comment: [2,10],
    };


    const self = {
        clickChat: (ev) => {
            props.dialog(<BountyBoard
                dialog={props.dialog}
                alink={props.alink}
            />, "Bounty Comments");
        }
    }
    useEffect(() => {

    }, []);

    return (
        <Row hidden={false}>
            <Col sm={size.left[0]} xs={size.left[0]}>
                <Row>
                    <Col sm={size.comment[0]} xs={size.comment[0]}>
                        <Image
                            className="avatar_mini"
                            src={Account.avatar("abc")}
                            roundedCircle
                            width="100%"
                        />
                    </Col>
                    <Col sm={size.comment[1]} xs={size.comment[1]}>
                        <div className="bounty_chat">{"hello world"}</div>
                    </Col>
                </Row>
            </Col>
            <Col className="text-end" sm={size.left[1]} xs={size.left[1]}>
                <button className="btn btn-sm btn-secondary" onClick={(ev) => {
                    self.clickChat(ev)
                }}>
                    <FaComments className="text-info" size={24} />
                </button>
            </Col>
        </Row>
    )
}

export default BountyChat;