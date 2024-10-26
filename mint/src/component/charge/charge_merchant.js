import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace } from "react-icons/fa";

import Account from "../account";

import ACCOUNT from "../../system/account";
import { FaAngleLeft, FaAngleRight,FaComments,FaCopy } from "react-icons/fa";

function ChargeMerchent(props) {
    const size = {
        row: [12],
        back: [9, 3],
        right:[3,7,2],
    };

    const router={
        USDT:"",
    };


    const self = {
        clickBack: (ev) => {
            if(props.callback) props.callback();
        },
    }
    useEffect(() => {
       console.log(props);
    }, []);

    return (
        <Row >
            <Col className="" sm={size.back[0]} xs={size.back[0]}>
                Market
            </Col>
            <Col className="pb-2 text-end" sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev) => {
                    self.clickBack(ev);
                }} />
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
               Chat here;
            </Col>
        </Row>
    )
}

export default ChargeMerchent;