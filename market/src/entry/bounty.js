import { Row, Col } from "react-bootstrap";
import { useState } from "react";

import BountyList from "../component/bounty_list";
import BountySubmit from "../component/bounty_submit";

function Bounty(props) {
    const size = {
        row: [12],
        head: [10, 2]
    };

    let [update, setUpdate] = useState(0);

    const self = {
        clickAdd:(ev)=>{
            props.dialog(<BountySubmit />,"Bounty Submission");
        },
        fresh: () => {
            setUpdate(update + 1);
        },
    }
    return (
        <Row className="pt-2">
            <Col md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]} >
                Information of bounty here.
            </Col>
            <Col className="text-end" md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]} >
                <button className="btn btn-md btn-primary" onClick={(ev)=>{
                    self.clickAdd(ev);
                }}> + Bounty </button>
            </Col>
            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                <BountyList update={update} fresh={self.fresh} />
            </Col>
        </Row>
    )
}

export default Bounty;