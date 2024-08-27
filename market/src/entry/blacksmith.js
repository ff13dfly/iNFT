import {  Row, Col } from "react-bootstrap";
import { useState } from "react";

import tools from "../lib/tools";

import Minting from "../component/common/common_minting";
import MintNearby from "../component/blacksmith/mint_nearby";
import MintTask from "../component/blacksmith/mint_task";
import MintAccount from "../component/blacksmith/mint_account";

function Blacksmith(props) {
    const size = {
        row: [12],
        layout: [8,4]
    };

    let [list, setList]=useState([]);

    const self = {
        callbackAccount:(addr)=>{
            console.log(addr);
            const task={
                address:addr,
                stamp:0,
            }
            list.push(task);
            setList(tools.clone(list));
        },
    }

    return (
        <Row className="pt-2">
            <Col className="pt-2" md={size.layout[0]} lg={size.layout[0]} xl={size.layout[0]} xxl={size.layout[0]} >
                <MintAccount callback={(addr)=>{
                    self.callbackAccount(addr);
                }}/>
                {list.map((row, index) => (
                    <MintTask key={index} address={row.address} />
                ))}
            </Col>
            <Col className="pt-2" md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]} >
                <Minting uuid={"blacksmith_minting"} template={""}/>
                <MintNearby amount={10}/>
            </Col>
        </Row>
    )
}

export default Blacksmith;