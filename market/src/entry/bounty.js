import { Row, Col } from "react-bootstrap";
import { useState,useEffect } from "react";

import BountyList from "../component/bounty_list";
import BountySubmit from "../component/bounty_submit";

function Bounty(props) {
    const size = {
        row: [12],
        head: [10, 2]
    };


    let [ active, setActive ]= useState("basic");
    let [ content, setContent] =useState("");

    const map={
        "basic":<BountyList />,
        "404":"404 page",
    }

    const self = {
        clickAdd:(ev)=>{
            props.dialog(<BountySubmit />,"Bounty Submission");
        },
    }

    useEffect(() => {
        console.log(props);
        // if(props.extend && props.extend.mod){
        //     const mod=props.extend.mod;
        //     if(mod!==active){
        //         setActive(mod);
        //         if(map[mod]){
        //             setContent(map[mod]);
        //         }else{
        //             setContent(map["404"]);
        //         }
        //     }
        // }else{
        //     setContent(map[active]);
        // }
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