import {Container, Row, Col } from "react-bootstrap";
import { useState,useEffect } from "react";
import Header from "../component/common_header";
import FilterTemplate from "../component/filter_template";
import ListTemplate from "../component/list_template";

import API from "../lib/api";

function Template(props) {
    const size = {
        row: [12],
        side:[2,10],
    };

    let [update, setUpdate]=useState(0);
    let [page, setPage]=useState(1);

    const self={
        fresh:()=>{
            setUpdate(update+1);
        },
    }

    useEffect(() => {
        API.template(page,(res)=>{
            console.log(res);
        });
    }, [props.update]);

    return (
        <div>
            <Header active="template"/>
            <Container>
                <Row className="pt-2">
                    <Col md={size.side[0]} lg={size.side[0]} xl={size.side[0]} xxl={size.side[0]} >
                        <FilterTemplate update={update} fresh={self.fresh}/>
                    </Col>
                    <Col md={size.side[1]} lg={size.side[1]} xl={size.side[1]} xxl={size.side[1]}>
                       <ListTemplate update={update} fresh={self.fresh}/>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Template;