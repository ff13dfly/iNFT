import {  Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import Minting from "../component/common/common_minting";
import MintNearby from "../component/blacksmith/mint_nearby";
import MiniTask from "../component/blacksmith/mini_task";
import MintAccount from "../component/blacksmith/mint_account";

import Task from "../system/task";

function Blacksmith(props) {
    const size = {
        row: [12],
        layout: [8,4]
    };

    let [list, setList]=useState([]);
    let [info, setInfo]=useState("");

    const self = {
        callbackAccount:(addr)=>{
            setInfo("");
            Task.add(addr,(res)=>{
                if(res===true) return self.fresh();
                setInfo("Failed to add task to local indexedDB.");
            });
        },
        callbackRemove:(name)=>{
            Task.remove(name,(res)=>{
                if(res===true)  return self.fresh();
            });
        },
        fresh:()=>{
            Task.list((arr)=>{
                if(arr.length===0) setInfo("No task yet");
                setList(arr);
            });
        },
    }

    useEffect(() => {
        self.fresh();
    }, [props.extend]);

    return (
        <Row className="pt-2">
            
            <Col className="pt-2" md={size.layout[0]} lg={size.layout[0]} xl={size.layout[0]} xxl={size.layout[0]} >
                <MintAccount callback={(addr)=>{
                    self.callbackAccount(addr);
                }}/>
                <Row>
                    <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                        {info}
                    </Col>
                </Row>
                {list.map((row, index) => (
                    <MiniTask key={index} data={row} remove={(name)=>{
                        self.callbackRemove(name)
                    }}/>
                ))}
            </Col>
            <Col className="pt-2" md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]} >
                <Minting uuid={"blacksmith_minting"} template={""}/>
                <MintNearby depth={6}/>
            </Col>
        </Row>
    )
}

export default Blacksmith;