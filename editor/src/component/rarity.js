import { Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";

import { FaPlus,FaDownload,FaFileUpload } from "react-icons/fa";

function Rarity(props) {
    const size = {
        row: [12],
        title: [8, 4],
        select:[2,10],
        button:[2],
    };

    let [ series, setSeries]=useState([]);

    const self={
        getMatrix:(rarity,sum)=>{

        },
    }

    useEffect(() => {
        const sample=[
            [0,1,2],
            [3,4,5,6],
            [7]
        ];
        const rare=[
            [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1],
        ]
        setSeries(rare)
    }, []);

    return (
        <Row className="pt-4">
            <Col lg={size.title[0]} xl={size.title[0]} xxl={size.title[0]}>
                <h5>iNFT Rarity</h5>
            </Col>
            <Col className="text-end" lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]}>
                <FaPlus style={{ color: "rgb(13, 110, 253)", cursor: "pointer" }} onClick={(ev)=>{
                    //self.clickAdd(ev);
                }}/>
            </Col>
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                {series.map((row, index) => (
                    <Row className="" key={index}>
                        <Col lg={size.select[0]} xl={size.select[0]} xxl={size.select[0]}>
                            #{index} series
                        </Col>
                        <Col lg={size.select[1]} xl={size.select[1]} xxl={size.select[1]}>
                            <Row className="">
                                {row.map((single, skey) => (
                                    <Col key={skey} lg={size.button[0]} xl={size.button[0]} xxl={size.button[0]}>
                                        <button className={single?"btn btn-md btn-primary":"btn btn-md btn-default"}>{skey}</button>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                ))}
            </Col>
        </Row>
    )
}

export default Rarity;