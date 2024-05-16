import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";

import Header from "../components/header";
import FilterMarket from "../components/filter_market";
import ListMarket from "../components/list_market";

function Market(props) {
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
                    <Col md={size.side[0]} lg={size.side[0]} xxl={size.side[0]} >
                        <FilterMarket update={update} fresh={self.fresh}/>
                    </Col>
                    <Col md={size.side[1]} lg={size.side[1]} xxl={size.side[1]}>
                        <ListMarket update={update} fresh={self.fresh}/>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Market;