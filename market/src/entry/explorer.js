import { Row, Col } from "react-bootstrap";

import { useEffect } from "react";

import SelectNetwork from "../component/select_network";

function Explorer(props) {

    const size = {
        row: [12],
        search: [6, 6],
        header: [4, 8]
    };
    //const navigate = useNavigate();

    useEffect(() => {
        //console.log(navigate("hello"));

        console.log(window.location);

    }, []);

    return (
        <Row className="pt-2">
            <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                <SelectNetwork />
            </Col>
        </Row>
    )
}

export default Explorer;