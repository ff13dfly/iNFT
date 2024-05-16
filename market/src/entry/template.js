import {Container, Row, Col } from "react-bootstrap";
import { useState,useEffect } from "react";
import Header from "../components/header";
import FilterTemplate from "../components/filter_template";
import ListTemplate from "../components/list_template";

function Template(props) {
    const size = {
        row: [12],
        side:[2,10],
    };

    let [update, setUpdate]=useState(0);

    const self={
        fresh:()=>{
            setUpdate(update+1);
        },
    }

    useEffect(() => {
        // setInterval(()=>{
        //     font += 0.1;
        //     setCmap([{fontSize:font},{fontSize:font},{fontSize:font}]);
        // },100)
    }, [props.update]);

    return (
        <div>
            <Header active="template"/>
            <Container>
                <Row className="pt-2">
                    <Col md={size.side[0]} lg={size.side[0]} xxl={size.side[0]} >
                        <FilterTemplate update={update} fresh={self.fresh}/>
                    </Col>
                    <Col md={size.side[1]} lg={size.side[1]} xxl={size.side[1]}>
                       <ListTemplate update={update} fresh={self.fresh}/>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Template;