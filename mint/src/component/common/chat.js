import { Row, Col,Image } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace,FaRegCommentDots } from "react-icons/fa";

//import Bounty from "../bounty";
import Account from "../../system/account";

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


    const self = {
        clickBack:(ev)=>{
            props.callback();
            //props.dialog(<Bounty dialog={props.dialog} alink={props.alink}/>,"Bounty");
        },
    }
    useEffect(() => {
       
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
                <Row>
                    <Col className="pt-1" sm={size.comment[0]} xs={size.comment[0]}>
                        <Image
                            className="avatar_bounty"
                            src={Account.avatar("abc")}
                            roundedCircle
                            width="100%"
                        />
                    </Col>
                    <Col className="pt-2" sm={size.comment[1]} xs={size.comment[1]}>
                        <div className="bounty_chat">{"hello world"}</div>
                    </Col>
                </Row>
                <Row className="pt-2">
                    <Col className="pt-1" sm={size.comment[0]} xs={size.comment[0]}>
                        <Image
                            className="avatar_bounty"
                            src={Account.avatar("aaa")}
                            roundedCircle
                            width="100%"
                        />
                    </Col>
                    <Col className="pt-2"  sm={size.comment[1]} xs={size.comment[1]}>
                        <div className="bounty_chat">{"Really? No more words? This is such a good bounty to join. 1000X return."}</div>
                    </Col>
                </Row>

                </div>
            </Col>

            <Col className="pt-4" sm={size.left[0]} xs={size.left[0]}>
                <input type="text" className="form-control" placeholder="Message about bounty..." />
            </Col>
            <Col className="pt-4 text-end" sm={size.left[1]} xs={size.left[1]}>
               <button className="btn btn-sm btn-secondary">
                    <FaRegCommentDots className="text-info" size={24}/>
                </button>
            </Col>
        </Row>
    )
}

export default Chat;