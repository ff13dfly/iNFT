import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Minting from "../component/common/common_minting";
import MintNearby from "../component/blacksmith/mint_nearby";
import DashboardNearby from "../component/dashboard/dashboard_nearby";
import DocumentINFT from "../component/dashboard/document_inft";
import Ads from "../component/dashboard/ads";

import ChartAmount from "../component/dashboard/chart_amount";
import ChartVolume from "../component/dashboard/chart_volume";
import ChartMarket from "../component/dashboard/chart_market";

import API from "../system/api";

function Dashboard(props) {
    const size={
        row:[12],
        layout:[9,3],
        chart:[4],
    }

    const self={

    }

    let [info, setInfo]=useState("");

    useEffect(() => {
        API.trend.overview((dt)=>{
            console.log(dt);
        });
    }, []);
    

    return (
        <Row className="pt-2" >
            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                {info}
            </Col>
            <Col md={size.layout[0]} lg={size.layout[0]} xl={size.layout[0]} xxl={size.layout[0]}>
                {/* <Row>
                    <Col md={size.chart[0]} lg={size.chart[0]} xl={size.chart[0]} xxl={size.chart[0]}>
                        <ChartAmount />
                    </Col>
                    <Col md={size.chart[0]} lg={size.chart[0]} xl={size.chart[0]} xxl={size.chart[0]}>
                        <ChartVolume />
                    </Col>
                    <Col md={size.chart[0]} lg={size.chart[0]} xl={size.chart[0]} xxl={size.chart[0]}>
                        <ChartMarket />
                    </Col>
                </Row> */}
                <DashboardNearby depth={6} grid={3}/>
            </Col>
            <Col md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]}>
                <Ads show={true}/>
                <ChartAmount />
                
                <Minting uuid={"dashboard_container"} amount={12}  grid={4}/>
                <hr />
                <DocumentINFT />
                
            </Col>
      </Row> 
    )
}

export default Dashboard;