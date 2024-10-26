import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace } from "react-icons/fa";

import Account from "../account";
import ChargeMerchent from "./charge_merchant";

import ACCOUNT from "../../system/account";
import { FaAngleLeft, FaAngleRight,FaComments,FaCopy } from "react-icons/fa";

function ChargeMarket(props) {
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
            props.dialog.show(<Account dialog={props.dialog}/>, "Account Management");
        },
        clickMerchant:()=>{
            props.dialog.show(<ChargeMerchent dialog={props.dialog} callback={()=>{
                props.dialog.show(<ChargeMarket dialog={props.dialog} />,"");
            }}/>, "Account Management");
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
                <Row>
                    <Col className="" sm={size.right[0]} xs={size.right[0]}>
                        <img className="avatar_redeem"  src={ACCOUNT.avatar("abc")} alt="" />
                    </Col>
                    <Col className="" sm={size.right[1]} xs={size.right[1]}>
                        1~3 $ANK<br/>
                        Warrant 1000U
                    </Col>
                    <Col sm={size.row[0]} xs={size.row[0]}>
                        <hr/>
                    </Col>
                </Row>

                <Row>
                    <Col className="" sm={size.right[0]} xs={size.right[0]}>
                        <img className="avatar_redeem"  src={ACCOUNT.avatar("bbb")} alt="" />
                    </Col>
                    <Col className="" sm={size.right[1]} xs={size.right[1]}>
                        1~5 $ANK<br/>
                        Warrant 1000U
                    </Col>
                    <Col className="" sm={size.right[2]} xs={size.right[2]}>
                        <button className="btn btn-sm btn-secondary" onClick={()=>{
                            self.clickMerchant("ADDRESS_OF_MERCHANT");
                        }}>
                            <FaComments className="" size={24}/>
                        </button>
                    </Col>
                    <Col sm={size.row[0]} xs={size.row[0]}>
                        <hr/>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default ChargeMarket;