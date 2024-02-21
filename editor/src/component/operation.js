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
    let [writeable,setWriteable]=useState(true);
    let [encryFile,setEncryFile]=useState(null);
    let [anchor, setAnchor]=useState("");
    let [password,setPassword]=useState("");

    const self={
        clickWrite:(ev)=>{
            console.log(encryFile,anchor,password);
            console.log(`Ready to write to anchor`);
        },
        changeJSON:(ev)=>{
            setEncryFile(ev.target.value);
            props.fresh();
        },
        changePassword:(ev)=>{
            setPassword(ev.target.value);
            props.fresh();
        },
        changeAnchor:(ev)=>{
            setAnchor(ev.target.value.trim());
            props.fresh();
        },
    }

    useEffect(() => {
        const bs64=Data.get("template");
        const NFT=Data.get("NFT");
        const basic=Data.get("size");
        if(bs64!==null && NFT!==null && basic!==null){
            setDisable(false);
            if(encryFile!==null && anchor!=="" && password!==""){
                setWriteable(false);
            }else{
                setWriteable(true);
            }
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
                <button disabled={writeable} className="btn btn-md btn-primary" onClick={(ev)=>{
                    self.clickWrite(ev);
                }}>Write iNFT Template</button>
            </Col>
        </Row>
    )
}

export default Operation;