import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import  Data from "../lib/data";

function NFT(props) {
    const size = {
        row: [12],
    };

    const self={
        changeDef:(ev)=>{
            try {
                const fa = ev.target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                  try {
                    const NFT = JSON.parse(e.target.result);
                    Data.set("NFT",NFT);
                    props.fresh();
                  } catch (error) {
                    
                  }
                };
                reader.readAsText(fa);
            } catch (error) {
            
            }
        }
    };

    useEffect(() => {

    }, []);

    return (
        <Row>
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <h5>iNFT Instance</h5>
            </Col>
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <small>Select the iNFT definition JSON file.</small>
                <input type="file" className="form-control" placeholder="The iNFT definition." onChange={(ev)=>{
                    self.changeDef(ev);
                }}/>
            </Col>
        </Row>
    )
}

export default NFT;