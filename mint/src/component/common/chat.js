import { Row, Col,Image } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace,FaRegCommentDots } from "react-icons/fa";

import Account from "../../system/account";
import API from "../../system/api";
import tools from "../../lib/tools";

/* Chat on alink
*   @param  {string}    alink       //bounty anchor link of bounty
*   @param  {function}  callback    //callback to close dailog
*   @param  {function}  dialog      //system dialog function
*/

function Chat(props) {
    const size = {
        row: [12],
        back:[9,3],
        comment: [2,10],
        left: [10,2],
    };

    let [message, setMessage]=useState("");

    let [page, setPage]=useState(1);     //chat page
    let [list, setList]=useState([]);    //chat list;

    const self = {
        changeMessage:(ev)=>{
            setMessage(ev.target.value);
        },
        clickBack:(ev)=>{
            props.callback();
        },
        clickSent:(ev)=>{
            if(!message) return false;
            Account.address((addr)=>{
                if(!addr || !props.alink) return false;
                API.comment.submit(addr,message,props.alink,(res)=>{
                    console.log(res);
                    if(res.success) return self.fresh(props.alink);
                });
            });
        },
        fresh:(alink)=>{
            API.comment.list(alink,(dt)=>{
                if(!dt.success) return false;
                if(dt.data) setList(dt.data);
            },page);
        },
    }
    useEffect(() => {
        if(props.alink) self.fresh(props.alink);
    }, []);

    return (
        <Row hidden={false}>
            <Col className="pt-2" sm={size.back[0]} xs={size.back[0]}>
                {props.alink}
            </Col>
            <Col className="pb-2 text-end" sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev) => {
                    self.clickBack(ev);
                }} />
            </Col>
            <Col className="" sm={size.row[0]} xs={size.row[0]}>
                <div className="chat-container" onScroll={(ev)=>{
                    console.log("here");
                }}>
                {list.map((row, index) => (
                    <Row key={index}>
                        <Col className="pt-1" sm={size.comment[0]} xs={size.comment[0]}>
                            <Image
                                className="avatar_bounty"
                                src={Account.avatar(row.address)}
                                roundedCircle
                                width="100%"
                            />
                        </Col>
                        <Col className="pt-2" sm={size.comment[1]} xs={size.comment[1]}>
                            <div className="bounty_chat">{tools.decodeHtml(row.memo)}</div>
                        </Col>
                    </Row>
                ))}
                </div>
            </Col>

            <Col className="pt-4" sm={size.left[0]} xs={size.left[0]}>
                <input type="text" className="form-control" 
                    placeholder="Message about bounty..." 
                    value={message}
                    onChange={(ev)=>{
                        self.changeMessage(ev)
                    }}
                />
            </Col>
            <Col className="pt-4 text-end" sm={size.left[1]} xs={size.left[1]}>
               <button className="btn btn-sm btn-secondary" onClick={(ev)=>{
                    self.clickSent(ev);
               }}>  
                    <FaRegCommentDots className="text-info" size={24}/>
                </button>
            </Col>
        </Row>
    )
}

export default Chat;