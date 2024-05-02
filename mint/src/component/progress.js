import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaIdBadge } from "react-icons/fa";

function Progress(props) {
    const size = {
        row: [12],
        bar:[2,8,2],
        step:[1,2,2,1,2],
    };

    let [list,setList]=useState([]);

    const self={

    }

    useEffect(() => {
        setList([1,2,3,4])
    }, [props.update]);

    return (
        <Row>
            <Col sm={size.row[0]} xs={size.row[0]}>10 mint, 4 done.</Col>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col className="pt-1" sm={size.bar[0]} xs={size.bar[0]}>
                        <h5>#1</h5>
                    </Col>
                    <Col className="pt-1" sm={size.bar[1]} xs={size.bar[1]}>
                        <Row className="pt-2">
                            <Col className="pt-3 done" sm={size.step[0]} xs={size.step[0]}></Col>
                            <Col className="pt-3 done" sm={size.step[1]} xs={size.step[1]}></Col>
                            <Col className="pt-3 done" sm={size.step[2]} xs={size.step[2]}></Col>
                            <Col className="pt-3 done" sm={size.step[3]} xs={size.step[3]}></Col>
                            <Col className="pt-3 done" sm={size.step[4]} xs={size.step[4]}></Col>
                            <Col className="pt-3 done"></Col>
                        </Row>
                    </Col>
                    <Col className="pt-1 text-end" sm={size.bar[2]} xs={size.bar[2]}>
                        <button className="btn btn-sm btn-secondary"><FaIdBadge /></button>
                    </Col>
                </Row>
            </Col>

            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col className="pt-1" sm={size.bar[0]} xs={size.bar[0]}>
                        <h5>#2</h5>
                    </Col>
                    <Col className="pt-1" sm={size.bar[1]} xs={size.bar[1]}>
                        <Row className="pt-2">
                            <Col className="pt-3 done" sm={size.step[0]} xs={size.step[0]}></Col>
                            <Col className="pt-3 done" sm={size.step[1]} xs={size.step[1]}></Col>
                            <Col className="pt-3 going" sm={size.step[2]} xs={size.step[2]}></Col>
                            <Col className="pt-3 waiting" sm={size.step[3]} xs={size.step[3]}></Col>
                            <Col className="pt-3 waiting" sm={size.step[4]} xs={size.step[4]}></Col>
                            <Col className="pt-3 waiting"></Col>
                        </Row>
                    </Col>
                    <Col className="pt-1 text-end" sm={size.bar[2]} xs={size.bar[2]}>
                        <button className="btn btn-sm btn-secondary"><FaIdBadge /></button>
                    </Col>
                </Row>
            </Col>

            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col className="pt-1" sm={size.bar[0]} xs={size.bar[0]}>
                        <h5>#3</h5>
                    </Col>
                    <Col className="pt-1" sm={size.bar[1]} xs={size.bar[1]}>
                        <Row className="pt-2">
                            <Col className="pt-3 waiting" sm={size.step[0]} xs={size.step[0]}></Col>
                            <Col className="pt-3 waiting" sm={size.step[1]} xs={size.step[1]}></Col>
                            <Col className="pt-3 waiting" sm={size.step[2]} xs={size.step[2]}></Col>
                            <Col className="pt-3 waiting" sm={size.step[3]} xs={size.step[3]}></Col>
                            <Col className="pt-3 waiting" sm={size.step[4]} xs={size.step[4]}></Col>
                            <Col className="pt-3 waiting"></Col>
                        </Row>
                    </Col>
                    <Col className="pt-1 text-end" sm={size.bar[2]} xs={size.bar[2]}>
                        <button className="btn btn-sm btn-secondary"><FaIdBadge /></button>
                    </Col>
                </Row>
            </Col>

            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col className="pt-1" sm={size.bar[0]} xs={size.bar[0]}>
                        <h5>#4</h5>
                    </Col>
                    <Col className="pt-1" sm={size.bar[1]} xs={size.bar[1]}>
                        <Row className="pt-2">
                            <Col className="pt-3 waiting" sm={size.step[0]} xs={size.step[0]}></Col>
                            <Col className="pt-3 waiting" sm={size.step[1]} xs={size.step[1]}></Col>
                            <Col className="pt-3 waiting" sm={size.step[2]} xs={size.step[2]}></Col>
                            <Col className="pt-3 waiting" sm={size.step[3]} xs={size.step[3]}></Col>
                            <Col className="pt-3 waiting" sm={size.step[4]} xs={size.step[4]}></Col>
                            <Col className="pt-3 waiting"></Col>
                        </Row>
                    </Col>
                    <Col className="pt-1 text-end" sm={size.bar[2]} xs={size.bar[2]}>
                        <button className="btn btn-sm btn-secondary"><FaIdBadge /></button>
                    </Col>
                </Row>
            </Col>

            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                Info: every mint takes about 36 seconds to finalize.
            </Col>
            {/* <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col className="pt-1" sm={size.bar[0]} xs={size.bar[0]}></Col>
                    <Col className="pt-1" sm={size.bar[1]} xs={size.bar[1]}>
                        <Row className="pt-2">
                            <Col className="text-center" sm={size.step[0]} xs={size.step[0]}>1</Col>
                            <Col className="text-center" sm={size.step[1]} xs={size.step[1]}>2</Col>
                            <Col className="text-center" sm={size.step[2]} xs={size.step[2]}>3</Col>
                            <Col className="text-center" sm={size.step[3]} xs={size.step[3]}>4</Col>
                            <Col className="text-center" sm={size.step[4]} xs={size.step[4]}>5</Col>
                            <Col className="text-center">6</Col>
                        </Row>
                    </Col>
                    <Col className="pt-1 text-end" sm={size.bar[2]} xs={size.bar[2]}></Col>
                </Row>
            </Col> */}
        </Row>
    )
}

export default Progress;