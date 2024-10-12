import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import { FaBackspace } from "react-icons/fa";

import Bounty from "../bounty";
import Account from "../../system/account";

function BountyDivert(props) {
    const size = {
        row: [12],
        back: [9, 3],
        left:[8,4],
        half:[6],
        right:[3,9],
        target:[4,4,4]
    };

    const logo = `${window.location.origin}/image/logo.png`;
    let [password, setPassword] = useState("");
    let [disable, setDisable] =useState(true);
    let [iNFT, setINFT]= useState(logo);
    let [info, setInfo]= useState("");

    const self = {
        changePassword:(ev)=>{
            const pass=ev.target.value;
            setDisable(!pass?true:false);
            setPassword(pass);
        },
        clickBack: (ev) => {
            props.dialog(<Bounty dialog={props.dialog} alink={props.alink} />, "Bounty");
        }, 
        clickDivert:(ev)=>{
            Account.keyring(password,(pair)=>{
                if(pair.error){
                    setPassword("");
                    return setInfo(pair.error);
                }

                console.log(pair);
                console.log(props);
            });
        },
    }
    useEffect(() => {
       console.log(props);

    }, [props.inft]);

    return (
        <Row >
            <Col className="pt-2" sm={size.back[0]} xs={size.back[0]}>
                Your iNFT:
            </Col>
            <Col className="pb-2 text-end" sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev) => {
                    self.clickBack(ev);
                }} />
            </Col>
            <Col sm={size.right[0]} xs={size.right[0]}>
                <img alt="" src={iNFT} className="apply_thumb" />
            </Col>
            <Col sm={size.right[1]} xs={size.right[1]}>
                Name: <br />
                Block:<br/>
                Bounty:
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col className="text-center" sm={size.target[0]} xs={size.target[0]}>
                <h6>You</h6>
                <img alt="" src={iNFT} className="apply_thumb" />
                <h6>5ECZb...EjJjV</h6>
            </Col>
            <Col className="pt-4" sm={size.target[1]} xs={size.target[1]}>
                After diverting, you will get the bonus prize.
            </Col>
            <Col  className="text-center" sm={size.target[2]} xs={size.target[2]}>
                <h6>Receiver</h6>
                <img alt="" src={iNFT} className="apply_thumb" />
                <h6>5D5K7...hcePg</h6>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col className="pt-2" sm={size.left[0]} xs={size.left[0]}>
                <input 
                    type="password" 
                    className="form-control"
                    placeholder="Password to divert"
                    hidden={false}
                    value={password} 
                    onChange={(ev) => {
                        self.changePassword(ev);
                    }} />
            </Col>

            <Col className="pt-2 text-end" sm={size.left[1]} xs={size.left[1]}>
                <button className="btn btn-md btn-primary" disabled={disable} onClick={(ev)=>{
                    self.clickDivert(ev);
                }}>Divert</button>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                {info}
            </Col>
        </Row>
    )
}

export default BountyDivert;