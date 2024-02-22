import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { FaList,FaRegUser,FaRegImage } from "react-icons/fa";

function Header(props) {
    const size = {
        row: [12],
        title:[2,7,3]
    };

    const self={

    }
    useEffect(() => {
       
    }, [props.update]);

    return (
        <Row className="pt-3">
            <Col sm={size.title[0]} xs={size.title[0]}>
                <FaList size={30} />
            </Col>
            <Col sm={size.title[1]} xs={size.title[1]}>
               <h3>iNFT Minter</h3> 
            </Col>
            <Col className="text-end" sm={size.title[2]} xs={size.title[2]}>
                <FaRegImage size={30} />
                <FaRegUser size={30} style={{marginLeft:"15px"}} />
            </Col>
        </Row>
    )
}

export default Header;