import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import  Data from "../lib/data";

function Operation(props) {
    const size = {
        row: [12],
        encry:[6,6],
        write:[7,5],
    };

    let [disable, setDisable]=useState(true);
    let [encryFile,setEncryFile]=useState(null);
    let [anchor, setAnchor]=useState("");
    let [password,setPassword]=useState("");

    const self={
        clickWrite:(ev)=>{

        },
        changeJSON:(ev)=>{

        },
        changePassword:(ev)=>{

        },
        changeAnchor:(ev)=>{

        },
    }

    useEffect(() => {
        const bs64=Data.get("template");
        const NFT=Data.get("NFT");
        const basic=Data.get("size");

        console.log(basic);

        if(bs64!==null && NFT!==null && basic!==null){
            setDisable(false);
            console.log(`Data ready.`);
        }
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col lg={size.encry[0]} xl={size.encry[0]} xxl={size.encry[0]} >
                <small>Encry JSON file</small>
                <input disabled={disable} className="form-control" type="file" onChange={(ev)=>{
                    self.changeJSON(ev);
                }}/>
            </Col>
            <Col lg={size.encry[1]} xl={size.encry[1]} xxl={size.encry[1]} >
                <small>Password</small>
                <input disabled={disable} className="form-control" type="password" placeholder="Password..." onChange={(ev)=>{
                    self.changePassword(ev);
                }}/>
            </Col>
            <Col className="pt-4" lg={size.write[0]} xl={size.write[0]} xxl={size.write[0]} >
                <input disabled={disable} className="form-control" type="text" placeholder="Anchor Name..." onChange={(ev)=>{
                    self.changeAnchor(ev);
                }}/>
            </Col>
            <Col className="pt-4 text-end" lg={size.write[1]} xl={size.write[1]} xxl={size.write[1]} >
                <button disabled={disable} className="btn btn-md btn-primary" onClick={(ev)=>{

                }}>Write iNFT Template</button>
            </Col>
        </Row>
    )
}

export default Operation;