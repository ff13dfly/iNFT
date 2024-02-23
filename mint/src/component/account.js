import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import { mnemonicGenerate } from "@polkadot/util-crypto";

import  Local from "../lib/local";

function Account(props) {
    const size = {
        row: [12],
        user:[4,8],
    };

    let [avatar,setAvatar] = useState("image/empty.png");
    let [amount,setAmount]  = useState(0);

    const self = {
        newAccount:()=>{
            const mnemonic = mnemonicGenerate();
            console.log(mnemonicGenerate);
            console.log(`Create new account: ${mnemonic}`);
        },
        clickNewAccount:(ev)=>{
            
        },
    }

    useEffect(() => {

    }, [props.update]);


    const amap = {
        width: "60px",
        height: "60px",
        borderRadius: "30px",
        background: "#FFAABB",
    };

    return (
        <Row>
            <Col sm={size.user[0]} xs={size.user[0]}>
                <img style={amap} src={avatar} alt="user logo" />
            </Col>
            <Col sm={size.user[1]} xs={size.user[1]}>
                <p>{amount} unit</p>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                JSON file select
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                Password to login
            </Col>
            <Col className="text-center pt-4" sm={size.row[0]} xs={size.row[0]}>
                <button className="btn btn-md btn-primary" onClick={(ev)=>{
                    self.clickNewAccount(ev)
                }}>New Account</button>
            </Col>
        </Row>
    )
}

export default Account;