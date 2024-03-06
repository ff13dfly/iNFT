import { Row, Col } from "react-bootstrap";
import { useEffect, useState,useRef } from "react";
import { FaDownload,FaFileUpload } from "react-icons/fa";

import  Data from "../lib/data";
import  tools from "../lib/tools";

function Template(props) {

    const size = {
        row: [12],
        title:[8,4],
    };

    const fileUpload = useRef(null);

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
        clickDownload:()=>{
            //console.log("Download template image");
            const img=Data.get("template");
            if(img===null) return false;

            //window.location.href=img;

            tools.download("full.png",img,"image");
        },
    };

    useEffect(() => {

    }, []);

    return (
        <Row className="pt-4">
            <Col lg={size.title[0]} xl={size.title[0]} xxl={size.title[0]}>
                <h5>iNFT Image</h5>
            </Col>
            <Col className="text-end" lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]}>
                <FaFileUpload style={{ color: "rgb(13, 110, 253)", cursor: "pointer"}} onClick={(ev)=>{
                    fileUpload.current.click()
                }}/>  
                <FaDownload style={{ color: "rgb(13, 110, 253)", cursor: "pointer",marginLeft:"10px" }} onClick={(ev)=>{
                    self.clickDownload();
                }}/>
            </Col>
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <input hidden={true} ref={fileUpload} type="file" className="form-control" placeholder="The template file." onChange={(ev)=>{
                    self.changeTemplate(ev);
                }}/>
            </Col>
        </Row>
    )
}

export default Template;