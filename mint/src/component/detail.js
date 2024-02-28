import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Account from "./account";
import Template from "./template";
import Mine from "./mine";


import { FaBackspace } from "react-icons/fa";

function Detail(props) {
    const size = {
        row: [12],
        title:[2,7,3]
    };

    const dialog=props.dialog;

    const self={
        clickBack:()=>{
            dialog(<Template fresh={props.fresh} dialog={props.dialog} />,"Template");
        },
    }
    useEffect(() => {
       
    }, [props.update]);

    return (
        <Row className="pt-1">
             <Col className="pb-2 text-end" hidden={!props.back} sm={size.row[0]} xs={size.row[0]}>
                <FaBackspace size={30} onClick={(ev)=>{
                    self.clickBack(ev);
                }}/>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>Template details</Col>
        </Row>
    )
}

export default Detail;