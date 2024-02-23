import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import  Local from "../lib/local";

function Template(props) {
    const size = {
        row: [12],
        add: [8,4],
    };

    let [alink, setAlink]= useState("anchor://");

    const self = {
        changeAlink:(ev)=>{
            setAlink(ev.target.value.trim());
        },
        clickAdd:(ev)=>{
            console.log(`Add a template`);
            const tpls=Local.get("template");
            const list=!tpls?[]:JSON.parse(tpls);
            console.log(list);
        },
    }

    useEffect(() => {

    }, [props.update]);

    return (
        <Row>
            <Col sm={size.add[0]} xs={size.add[0]}>
                <input className="form-control" type="text" placeholder="The template anchor link" value={alink} onChange={(ev)=>{
                    self.changeAlink(ev);
                }}/>
            </Col>
            <Col className="text-end" sm={size.add[1]} xs={size.add[1]}>
                <button className="btn btn-md btn-primary" onClick={(ev)=>{
                    self.clickAdd(ev);
                }}>Add</button>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
        </Row>
    )
}

export default Template;