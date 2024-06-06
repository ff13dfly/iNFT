import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";

import Header from "../component/common_header";
import FilterMarket from "../component/filter_market";
import ListMarket from "../component/list_market";

import API from "../lib/api";

function Market(props) {

    //CORS test
    // const url="http://localhost/inFT/service/api/?mod=system&act=new";
    // const getData=async ()=>{
    //     const response = await fetch(url);
    //     //console.log(response);
    //     const ctx = await response.text();
    //     console.log(ctx);
    // }
    // getData();

    API.template(1,(res)=>{
        console.log(res);
        API.template(2,(res)=>{
            console.log(res);
        });
    });

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
            <Header active={"market"} />
            <Container>
                <Row className="pt-2">
                    <Col md={size.side[0]} lg={size.side[0]} xl={size.side[0]} xxl={size.side[0]} >
                        <FilterMarket update={update} fresh={self.fresh}/>
                    </Col>
                    <Col md={size.side[1]} lg={size.side[1]} xl={size.side[1]} xxl={size.side[1]}>
                        <ListMarket update={update} fresh={self.fresh}/>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Market;