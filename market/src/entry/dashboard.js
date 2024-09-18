import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Minting from "../component/common/common_minting";
import MintNearby from "../component/blacksmith/mint_nearby";

function Dashboard(props) {
    const size={
        row:[12],
        layout:[9,3]
    }

    const self={

    }

    let [info, setInfo]=useState("");

    useEffect(() => {

    }, []);
    

    return (
        <Row className="pt-2" >
            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                {info}
            </Col>
            <Col md={size.layout[0]} lg={size.layout[0]} xl={size.layout[0]} xxl={size.layout[0]}>
                <MintNearby depth={6} grid={3}/>
            </Col>
            <Col md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]}>
                <Minting uuid={"dashboard_container"} amount={12}  grid={4}/>

            </Col>
      </Row> 
    )
}

export default Dashboard;