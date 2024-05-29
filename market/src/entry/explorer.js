import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../component/common_header";
import SelectNetwork from "../component/select_network";

function Explorer(props) {
    let { cid } = useParams();
    console.log(cid);

    const size = {
        row: [12],
        search:[6,6],
        header: [4,8]
    };

    let [update, setUpdate]=useState(0);

    const self={
        fresh:()=>{
            setUpdate(update+1);
        },
    }
    return (
        <div>
            <Header active={"explorer"} />
            <Container>
                <Row className="pt-2">
                    <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                        <SelectNetwork />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Explorer;