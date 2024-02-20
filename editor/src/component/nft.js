import { Row, Col } from "react-bootstrap";
import { useEffect, useState,useRef } from "react";
import { FaDownload,FaFileUpload } from "react-icons/fa";

import  Data from "../lib/data";
import  tools from "../lib/tools";

function NFT(props) {
    const size = {
        row: [12],
        title:[8,4],
    };

    const fileUpload = useRef(null);

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
        },
        clickDownload:(ev)=>{
            //console.log("Download iNFT definition.");

            const def=Data.get("NFT");
            if(def===null) return false;

            tools.download("def.json",JSON.stringify(def));
        },
    };

    useEffect(() => {

    }, []);

    return (
        <Row>
            <Col lg={size.title[0]} xl={size.title[0]} xxl={size.title[0]}>
                <h5>iNFT Instance</h5>
            </Col>
            <Col className="text-end" lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]}>
                <FaFileUpload style={{ color: "rgb(13, 110, 253)", cursor: "pointer"}} onClick={(ev)=>{
                    //self.clickDownload();
                    fileUpload.current.click()
                }}/>  
                <FaDownload style={{ color: "rgb(13, 110, 253)", cursor: "pointer",marginLeft:"10px" }} onClick={(ev)=>{
                    self.clickDownload();
                }}/>  
            </Col>
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                {/* <small>Select the iNFT definition JSON file.</small> */}
                <input hidden={true} ref={fileUpload} type="file" className="form-control" placeholder="The iNFT definition." onChange={(ev)=>{
                    self.changeDef(ev);
                }}/>
            </Col>
        </Row>
    )
}

export default NFT;