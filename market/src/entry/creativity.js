import { Row, Col } from "react-bootstrap";
import { useState } from "react";

import CreativityNav from "../component/creativity/creativity_nav"
import CreativityMock from "../component/creativity/creativity_mock";

function Creativity(props) {
    const size = {
        row: [12],
        layout: [2,10]
    };

    let [content, setContent]= useState("");

    const self = {
        updateContent:(ctx)=>{
            setContent(ctx);
        },
    }

    return (
        <Row className="pt-2">
            <Col md={size.layout[0]} lg={size.layout[0]} xl={size.layout[0]} xxl={size.layout[0]} >
                <CreativityNav update={self.updateContent} />
            </Col>
            <Col md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]} >
                Operation here.
                {content}
                <CreativityMock />
            </Col>
        </Row>
    )
}

export default Creativity;