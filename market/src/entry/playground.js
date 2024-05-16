import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../component/common_header";
import PriveiwINFT from "../component/inft_preview";
import PartsINFT from "../component/inft_parts";

function Playground(props) {
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
            <Header active={"playground"} />
            <Container>
                <Row className="pt-2">
                    <Col md={size.search[0]} lg={size.search[0]} xl={size.search[0]} xxl={size.search[0]} >
                        <small></small>
                        <input className="form-control" type="text" placeholder="The template IPFS cid to load"/>
                    </Col>
                    <Col md={size.search[1]} lg={size.search[1]} xl={size.search[1]} xxl={size.search[1]} >
                        Network information.
                    </Col>
                    <Col className="pt-2" md={size.header[0]} lg={size.header[0]} xl={size.header[0]} xxl={size.header[0]} >
                        <PriveiwINFT id={"iNFT_view"} hash={"0x"}/>
                        <PartsINFT />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Playground;