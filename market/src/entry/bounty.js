import { Row, Col } from "react-bootstrap";
import { useState,useEffect } from "react";

import BountyList from "../component/bounty_list";
import BountySubmit from "../component/bounty_submit";
import BountyPreview from "../component/bounty_preview";

function Bounty(props) {
    const size = {
        row: [12],
        head: [10, 2]
    };

    let [data,setData]= useState({});
    let [ active, setActive ]= useState("basic");
    let [ content, setContent] =useState("");

    const map={
        "basic":<BountyList />,
        "view": <BountyPreview data={data}/>,
        "404":"404 page",
    }

    const self = {
        clickAdd:(ev)=>{
            props.dialog(<BountySubmit />,"Bounty Submission");
        },
    }

    useEffect(() => {
        //console.log(props);
        if(!props.extend){
            setContent(map.basic);
        }else if(props.extend.anchor && props.extend.block){
            console.log(`Here to show bounty details.`);
            setContent(map.view);
            setData(props.extend);
        }else{
            setContent(map.basic);
        }
    }, [props.extend]);

    return (
        <Row className="pt-2">
            <Col md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]} >
                Information of bounty here.
            </Col>
            <Col className="text-end" md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]} >
                <button className="btn btn-md btn-primary" onClick={(ev)=>{
                    self.clickAdd(ev);
                }}> + Bounty </button>
            </Col>
            <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                
                {content}
            </Col>
        </Row>
    )
}

export default Bounty;