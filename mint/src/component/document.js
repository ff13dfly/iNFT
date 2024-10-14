import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

import DocumentWhat from "./document/what";
import DocumentTicket from "./document/ticket";
import DocumentAccount from "./document/account";
import DocumentCharge from "./document/charge";
import DocumentERC20 from "./document/erc20";

/* Entry of document
*   @param  {number}    index       //document index to show, if here, need to setPage and show.
*   @param  {function}  dialog      //system dialog function
*/


function Document(props) {
    const size = {
        row: [12],
        page: [4, 4, 4],
    };

    const docs={
        en:[
            {title:"What?",content:<DocumentWhat dialog={props.dialog}/>},
            {title:"Ticket",content:<DocumentTicket dialog={props.dialog}/>},
            {title:"Account",content:<DocumentAccount dialog={props.dialog}/>},
            {title:"Charge",content:<DocumentCharge dialog={props.dialog}/>},
            {title:"ERC20",content:<DocumentERC20 dialog={props.dialog}/>},
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