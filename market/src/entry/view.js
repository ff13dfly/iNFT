import { useParams } from "react-router-dom";

import { Container, Row, Col, Breadcrumb } from "react-bootstrap";
import { useEffect, useState } from "react";

import Header from "../component/common_header";
import PriveiwINFT from "../component/inft_preview";

function View(props) {

    let { anchor } = useParams();
    console.log(anchor);

    const size = {
        row: [12],
        header: [4, 8]
    };

    const self = {

    }

    useEffect(() => {

    }, [props.update]);

    return (
        <div>
            <Header active={"market"} />
            <Container>
                <Row className="pt-2">
                    <Col md={size.row[0]} lg={size.row[0]} xxl={size.row[0]} >
                        <Breadcrumb>
                            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                            <Breadcrumb.Item href={`/market/${!props.page?1:props.page}`}>Market</Breadcrumb.Item>
                            <Breadcrumb.Item active>iNFT</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col md={size.header[0]} lg={size.header[0]} xxl={size.header[0]} >
                        <PriveiwINFT />
                    </Col>
                    <Col md={size.header[1]} lg={size.header[1]} xxl={size.header[1]} >
                        Basic information
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default View;