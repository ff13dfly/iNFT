import {  Row, Col } from "react-bootstrap";
import { useState } from "react";

import FilterMarket from "../component/filter_market";
import ListMarket from "../component/list_market";

function Market(props) {
    const size = {
        row: [12],
        side: [2, 12]
    };

    let [update ,setUpdate]=useState(0);
    let [filter, setFilter]=useState();
    
    const self = {
        fresh: (target) => {
            setUpdate(update+1);
        },
        filter:(map)=>{
            setFilter(map);
        },
    }
    return (
        <Row className="pt-2">
            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                <FilterMarket update={update} fresh={self.fresh} filter={self.filter}/>
            </Col>
            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <ListMarket fresh={self.fresh} link={props.link} filter={filter}/>
            </Col>
        </Row>
    )
}

export default Market;