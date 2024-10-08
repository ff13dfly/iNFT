import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";


function BountyTicket(props) {
    const size = {
        row: [12],
    };

    let [price, setPrice]=useState(0);

    let [title, setTitle]=useState("Join to mint");
    let [password, setPassword]=useState("");
    let [show, setShow]=useState(false);
    let [info, setInfo]=useState("");

    const self = {
        changePassword:(ev)=>{
            setPassword(ev.target.value);
        },
        clickJoin:()=>{
            setShow(true);
        },
        clickBuy:()=>{
            console.log(password);
            setInfo("Ready to buy ticket")
        },
    }
    useEffect(() => {

    }, []);

    return (
        <Row>
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                <small>Ticket ( {price} $ANK )</small>
            </Col>
            <Col hidden={show} className="text-center" sm={size.row[0]} xs={size.row[0]}>
                <button className="btn btn-md btn-warning" onClick={(ev)=>{
                    self.clickJoin(ev);
                }}>Join to mint</button>
            </Col>
            <Col hidden={!show} className="text-center" sm={size.row[0]} xs={size.row[0]}>
                <button className="btn btn-md btn-warning" onClick={(ev)=>{
                    self.clickBuy(ev);
                }}>Buy Ticket</button>
            </Col>
            <Col hidden={!show} className="pt-2 text-center" sm={size.row[0]} xs={size.row[0]}>
                <input type="password" className="form-control" placeholder="Password"  value={password} onChange={(ev)=>{
                    self.changePassword(ev);
                }}/>
            </Col>
            <Col hidden={!show} sm={size.row[0]} xs={size.row[0]}>
                {info}
            </Col>
        </Row>
    )
}

export default BountyTicket;