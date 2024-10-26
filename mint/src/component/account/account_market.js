import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import ChargeMarket from "../charge/charge_market";

import tools from "../../lib/tools";

import { FaBalanceScale } from "react-icons/fa";

function AccountMarket(props) {
    const size = {
        row: [12],
        left:[9,3],
    };

    const default_info="$ANK exchange market.";
    let [info, setInfo]=useState(default_info);
    let [recover, setRecover] = useState({});

    const self = {
        clickRecover: (key, at) => {
            if (!recover[key]) {
                recover[key] = "text-info";
                setRecover(tools.copy(recover));
                setTimeout(() => {
                    delete recover[key];
                    setRecover(tools.copy(recover));
                }, !at ? 1000 : at);
            }
        },
        clickMarket:(ev)=>{
            props.dialog.show(<ChargeMarket dialog={props.dialog} />,"Charge Market");
        },
    }
    useEffect(() => {
       
    }, []);

    return (
        <Row className="pt-4">
            <Col sm={size.left[0]} xs={size.left[0]}>{info}</Col>
            <Col className="text-end" sm={size.left[1]} xs={size.left[1]}>
                <button className="btn btn-md btn-secondary" disabled={recover.faucet} style={{ marginLeft: "10px"}} onClick={(ev) => {
                    self.clickRecover("market");
                    self.clickMarket(ev);
                }}>
                    <FaBalanceScale className={!recover.faucet ? "pb-1" : `pb-1 ${recover.faucet}`} size={24}/>
                </button>
            </Col>
        </Row>
    )
}

export default AccountMarket;