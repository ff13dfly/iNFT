import { Row, Col, Breadcrumb } from "react-bootstrap";
import { useEffect, useState } from "react";

import DetailINFT from "../component/inft_detail";

import INFT from "../lib/inft";

function View(props) {
    const size = {
        row: [12],
        header: [5, 7]
    };

    let [data, setData] = useState();

    const self = {
    }

    useEffect(() => {
        if(props.extend  && props.extend.name){
            const anchor = props.extend.name;
            console.log(anchor);
            INFT.single(anchor,(dt)=>{
                console.log(dt);

                setData(dt);
            });
        }
    }, [props.update,props.extend]);

    return (
        <Row className="pt-2">
            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                <Breadcrumb>
                    <Breadcrumb.Item onClick={(ev)=>{props.link("home")}}>Home</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={(ev)=>{props.link("market")}}>Market</Breadcrumb.Item>
                    <Breadcrumb.Item active>iNFT</Breadcrumb.Item>
                </Breadcrumb>
            </Col>
            <Col md={size.header[0]} lg={size.header[0]} xl={size.header[0]} xxl={size.header[0]} >
                <img className="view_thumb" src={(!data||!data.bs64)?`${window.location.origin}/imgs/logo.png`:data.bs64}  alt="thumb"/>
            </Col>
            <Col md={size.header[1]} lg={size.header[1]} xl={size.header[1]} xxl={size.header[1]} >
                <DetailINFT data={data} />
                <Row className="pt-4">
                    <Col className="pt-4 text-end" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                        <button className="btn btn-md btn-primary">Buy It Now</button>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default View;