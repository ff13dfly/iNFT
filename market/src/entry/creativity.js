import { Row, Col } from "react-bootstrap";
import { useState } from "react";

import CreativityNav from "../component/creativity/creativity_nav"
import CreativityPreview from "../component/creativity/creativity_preview";

import { FaExpandArrowsAlt } from "react-icons/fa";


function Creativity(props) {
    const size = {
        row: [12],
        layout: [10, 2],
        head:[10,2],
        parts:[4,4,4],
        left:[9,3]
    };

    let [content, setContent] = useState("");
    let [sidebar, setSidebar] = useState(true);                     //wether show the sidebar
    let [title, setTitle] = useState("Gene template editor.");

    const self = {
        clickSidebar:(ev)=>{
            setSidebar(!sidebar);
        },
        updateContent: (ctx) => {
            setContent(ctx);
        },
        fullscreen:()=>{
            return !sidebar;
        },
        fresh:(memo)=>{
            setTitle(memo);
        },
    }

    return (
        <Row className="pt-2">
            <Col className="pt-2" md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]} >
                {title}
            </Col>
            <Col className="text-end" md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]} >
                <button 
                    className={sidebar?"btn btn-md btn-default":"btn btn-md btn-default text-warning"} 
                    onClick={(ev)=>{
                        self.clickSidebar(ev);
                    }}><FaExpandArrowsAlt size={20}/></button>
            </Col>
            <Col className="pt-2" 
                md={sidebar?size.layout[0]:size.row[0]} 
                lg={sidebar?size.layout[0]:size.row[0]} 
                xl={sidebar?size.layout[0]:size.row[0]} 
                xxl={sidebar?size.layout[0]:size.row[0]}>
                {content}
            </Col>
            <Col className="pt-2" hidden={!sidebar} md={size.layout[1]} lg={size.layout[1]} xl={size.layout[1]} xxl={size.layout[1]} >
                <CreativityNav 
                    show={self.updateContent} 
                    fullscreen={self.fullscreen}
                    fresh={self.fresh}
                />
            </Col>
            <CreativityPreview/>
        </Row>
    )
}

export default Creativity;