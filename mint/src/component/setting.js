import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

function Setting(props) {
    const size = {
        row: [12],
        flow:[3,6,3]
    };

    const self={

    }

    useEffect(() => {
        // setInterval(()=>{
        //     font += 0.1;
        //     setCmap([{fontSize:font},{fontSize:font},{fontSize:font}]);
        // },100)
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col className="text-center" sm={size.flow[0]} xs={size.flow[0]}>
                <span style={cmap[0]}>Offset setting here.</span>
            </Col>
        </Row>
    )
}

export default Setting;