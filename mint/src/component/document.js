import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

import DocumentWhat from "./document/what";
import DocumentTicket from "./document/ticket";

function Document(props) {
    const size = {
        row: [12],
        page: [4, 4, 4],
    };

    const docs={
        en:[
            {title:"What?",content:<DocumentWhat />},
            {title:"Ticket",content:<DocumentTicket />},
            {title:"Charge",content:"Good topic"},
            {title:"ERC20",content:"About ERC20"},
        ],
    }
    
    let [lang, setLang]=useState("en");
    let [index,setIndex]=useState(0);
    let [title, setTitle]=useState("");
    let [content, setContent]=useState("");

    const self={
        clickPrevious:(ev)=>{
            self.show(index-1);
            setIndex(index-1);
        },
        clickNext:(ev)=>{
            self.show(index+1);
            setIndex(index+1);
        },
        show:(page)=>{
            if(!docs[lang][page]){
                setTitle("");
                setContent("Error: no such page.");
                return false;
            }
            const data=docs[lang][page];
            setTitle(data.title);
            setContent(data.content);
        },
    }

    useEffect(() => {

       self.show(index);

    }, [props.update]);

    return (
        <Row>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <div className="doc-container">
                    {content}
                </div>
            </Col>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col className=""  sm={size.page[0]} xs={size.page[0]}>
                        <FaAngleLeft className="pointer" hidden={index===0} size={36} onClick={(ev) => {
                            self.clickPrevious(ev);
                        }} />
                    </Col>
                    <Col className="pt-2 text-center unselect" sm={size.page[1]} xs={size.page[1]}>
                        <h4>{title}</h4>
                    </Col>
                    <Col className="text-end" sm={size.page[2]} xs={size.page[2]}>
                        <FaAngleRight className="pointer" hidden={index>=(docs[lang].length-1)} size={36} onClick={(ev) => {
                            self.clickNext(ev);
                        }} />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Document;