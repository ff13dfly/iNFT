import {  Row, Col } from "react-bootstrap";
import { useState } from "react";

import FilterMarket from "../component/filter_market";
import ListMarket from "../component/list_market";
import SearchMarket from "../component/search_market";

function Market(props) {
    const size = {
        row: [12],
        head: [5,7]
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
            <Col md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]} >
                <FilterMarket update={update} fresh={self.fresh} filter={self.filter}/>
            </Col>
            <Col md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]} >
                <SearchMarket />
            </Col>
            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <ListMarket fresh={self.fresh} link={props.link} filter={filter}/>
            </Col>
        </Row>
    )
}

export default Market;