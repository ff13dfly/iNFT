import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";

import Header from "../component/common_header";
import ListBounty from "../component/list_bounty";

function Bounty(props) {
    const size = {
        row: [12],
        side:[2,10]
    };

    let [update, setUpdate]=useState(0);

    const self={
        fresh:()=>{
            setUpdate(update+1);
        },
    }
    return (
        <div>
            <Header active={"bounty"} />
            <Container>
                <Row className="pt-2">
                    <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]}  xxl={size.row[0]} >
                        <ListBounty update={update} fresh={self.fresh}/>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Bounty;