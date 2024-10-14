import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace } from "react-icons/fa";

import Account from "../account";

function ChargeHome(props) {
    const size = {
        row: [12],
        back: [9, 3],
    };

    const router={
        USDT:"",
    };


    const self = {
        clickBack: (ev) => {
            props.dialog(<Account dialog={props.dialog}/>, "Account Management");
        },
    }
    useEffect(() => {
       
    }, []);

    return (
        <Row >
            <Col className="" sm={size.back[0]} xs={size.back[0]}>
                <select className="form-control">
                    <option value="eth_usdt">USDT (Ethereum Network)</option>
                </select>
            </Col>
            <Col className="pb-2 text-end" sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev) => {
                    self.clickBack(ev);
                }} />
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                
            </Col>
        </Row>
    )
}

export default ChargeHome;