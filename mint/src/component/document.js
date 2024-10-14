import { Row, Col } from "react-bootstrap";
import { useEffect } from "react";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function Document(props) {
    const size = {
        row: [12],
        page: [4, 4, 4],
    };

    const docs=[
        {title:"What?",content:""},
        {title:"Ticket",content:""},
    ]

    const self={
        clickPrevious:(ev)=>{

        },
        clickNext:(ev)=>{

        },
    }
    useEffect(() => {
       
    }, [props.update]);

    return (
        <Row>
            <Col className="pt-4 text-center" sm={size.row[0]} xs={size.row[0]}>
                iNFT document
            </Col>

            <Col className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col className="" sm={size.page[0]} xs={size.page[0]}>
                        <FaAngleLeft className="pointer" size={36} onClick={(ev) => {
                            self.clickPrevious(ev);
                        }} />
                    </Col>
                    <Col className="text-center unselect" sm={size.page[1]} xs={size.page[1]}>
                        <h4> </h4>
                    </Col>
                    <Col className="text-end" sm={size.page[2]} xs={size.page[2]}>
                        <FaAngleRight className="pointer" size={36} onClick={(ev) => {
                            self.clickNext(ev);
                        }} />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Document;