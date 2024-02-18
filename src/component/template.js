import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import  Data from "../lib/data";

function Template(props) {
    const size = {
        row: [12],
    };

    const self={
        changeTemplate:(ev)=>{
            try {
                const fa = ev.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(fa);
                reader.onload = (e) => {
                  try {
                    const fa = e.target.result;
                    Data.set("template",fa);
                    props.fresh();
                  } catch (error) {
                    console.log(error);
                  }
                };
                reader.readAsText(fa);
            } catch (error) {
            
            }
        },
    };

    useEffect(() => {

    }, []);

    return (
        <Row>
            <Col xs={size.row[0]} sm={size.row[0]} >
                <h5>iNFT Template</h5>
            </Col>
            <Col xs={size.row[0]} sm={size.row[0]} >
                <small>Select the template png file.</small>
                <input type="file" className="form-control" placeholder="The template file." onChange={(ev)=>{
                    self.changeTemplate(ev);
                }}/>
            </Col>
        </Row>
    )
}

export default Template;