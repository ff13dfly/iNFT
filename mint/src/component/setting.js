import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

function Setting(props) {
    const size = {
        row: [12],
        offset:[1,9,2],
        multi:[4,4,4]
    };

    let [list,setList]=useState([]);

    const self={

    }

    useEffect(() => {
        setList([1,2,3,4])
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col sm={size.row[0]} xs={size.row[0]}>
                Mock hash: 0x000000000000000000000000000000
            </Col>
            {list.map((row, index) => (        
                <Col key={index} className="pt-1" sm={size.row[0]} xs={size.row[0]}>
                    <Row>
                        <Col className="pt-2" sm={size.offset[0]} xs={size.offset[0]}>
                            <h5>#{index+1}</h5>
                        </Col>
                        
                        <Col className="pt-2" sm={size.offset[1]} xs={size.offset[1]}>
                            Value:
                        </Col>
                        <Col className="text-end" sm={size.offset[2]} xs={size.offset[2]}>
                            <button className="btn btn-md btn-secondary">1</button> 
                        </Col>
                    </Row>
                </Col>
            ))}
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                Set the mint times, 10 times max.
            </Col>
            <Col className="pt-2 text-end" sm={size.multi[0]} xs={size.multi[0]}>
                <button className="btn btn-md btn-secondary">-</button>
            </Col>
            <Col className="pt-3 text-center" sm={size.multi[1]} xs={size.multi[1]}>
                <h3>1</h3>
            </Col>
            <Col className="pt-2" sm={size.multi[2]} xs={size.multi[2]}>
                <button className="btn btn-md btn-secondary">+</button>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                On progress panel.
            </Col>
        </Row>
    )
}

export default Setting;