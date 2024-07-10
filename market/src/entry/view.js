import { Row, Col, Breadcrumb } from "react-bootstrap";
import { useEffect, useState } from "react";

import DetailINFT from "../component/inft_detail";

import INFT from "../system/inft";

function View(props) {
    const size = {
        row: [12],
        header: [5, 7],
        buy:[8,2,2],
    };

    let [data, setData] = useState();

    let [way, setWay] = useState("wallet");

    const payment={
        wallet:{},
        local:{},
    }

    const self = {
        checkName:(str)=>{
            const arr=str.split("@");
            if(arr.length===1) return {name:str};
            const network=arr.pop();
            return {name:arr.join("@"),network:network}
        },
        
    }

    useEffect(() => {
        if(props.extend  && props.extend.name){
            const dt=self.checkName(props.extend.name);
            INFT.single(dt.name,(res)=>{
                setData(res);
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
                <Row>
                    <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                        <img className="view_thumb" src={(!data||!data.bs64)?`${window.location.origin}/imgs/logo.png`:data.bs64}  alt="thumb"/>
                    </Col>
                    <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                        {!data || !data.local?"Network":"Local Cache"}
                    </Col>
                </Row>
            </Col>
            <Col md={size.header[1]} lg={size.header[1]} xl={size.header[1]} xxl={size.header[1]} >
                <DetailINFT data={data} link={props.link} />
                <Row className="pt-4">
                    <Col className="pt-4 text-end" md={size.buy[0]} lg={size.buy[0]} xl={size.buy[0]} xxl={size.buy[0]} >
                    </Col>
                    <Col className="pt-4 text-end" md={size.buy[1]} lg={size.buy[1]} xl={size.buy[1]} xxl={size.buy[1]} >
                        <select className="form-control">
                            <option value="wallet">Wallet</option>
                            <option value="local">Local</option>
                        </select>
                    </Col>
                    <Col className="pt-4 text-end" md={size.buy[2]} lg={size.buy[2]} xl={size.buy[2]} xxl={size.buy[2]} >
                        <button className="btn btn-md btn-primary">Buy It Now</button>
                    </Col>
                    <Col className="text-end" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                        <small>You can buy iNFT at the same network.</small>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default View;