import { useParams } from "react-router-dom";

import { Container,Row, Col,Breadcrumb } from "react-bootstrap";
import { useEffect, useState } from "react";

import Header from "../component/common_header";

function Preview(props) {

    let { cid } = useParams();
    console.log(cid);

    const size = {
        row: [12],
        header: [5, 7]
    };

    const self={

    }

    useEffect(() => {

    }, [props.update]);

    return (
        <div>
            <Header active={"template"}/>
            <Container>
                <Row className="pt-2">
                    <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]}  xxl={size.row[0]} >
                        <Breadcrumb>
                            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                            <Breadcrumb.Item href={`/template/${!props.page?1:props.page}`}>Template</Breadcrumb.Item>
                            <Breadcrumb.Item active>Name of template</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col md={size.header[0]} lg={size.header[0]} xl={size.header[0]} xxl={size.header[0]} >
                        iNFT render and manual operation
                    </Col>
                    <Col md={size.header[1]} lg={size.header[1]} xl={size.header[1]} xxl={size.header[1]} >
                       Details of template
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Preview;