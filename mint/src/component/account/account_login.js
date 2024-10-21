import { Row, Col, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";

import Local from "../../lib/local";
import Data from "../../lib/data"
import Network from "../../network/router";
import INFT from "../../system/inft";
import Seed from "./seed";


/* Login options
*   @param  {function}   [callback]          //callback
*/

function AccountLogin(props) {
    const size = {
        row: [12],
        left: [9, 3]
    };

    let [info, setInfo]=useState("");
    let [password, setPassword]=useState("");
    let [disable, setDisable]=useState(true);

    const self = {
        changePassword: (ev) => {
            setPassword(ev.target.value);
            setDisable(!ev.target.value ? true : false);
        },
        clickNewAccount: (ev) => {
            setDisable(true);
            const cur=Data.getHash("cache","network");
            Network(cur).generate(password,(fa,mnemonic)=>{
                Local.set("login", JSON.stringify(fa));
                INFT.auto();

                props.dialog.show(<Seed fresh={props.fresh} dialog={props.dialog} mnemonic={mnemonic} address={fa.address}/>,"Seed Details");
                props.fresh();

                if(props.callback) props.callback();
            })
        },
        changeFile: (ev) => {
            try {
                const fa = ev.target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const sign = JSON.parse(e.target.result);
                        if (!sign.address || !sign.encoded)
                            return setInfo("Error encry JSON file");
                        if (sign.address.length !== 48)
                            return setInfo("Error SS58 address");
                        if (sign.encoded.length !== 268)
                            return setInfo("Error encoded verification");
                        setInfo("Encoded account file loaded");
                        Local.set("login", e.target.result);
                        INFT.auto();
                        if(props.callback) props.callback();
                    } catch (error) {
                        setInfo("Not encry JSON file");
                    }
                };
                reader.readAsText(fa);
            } catch (error) {
                setInfo("Can not load target file");
            }
        },
    }

    useEffect(() => {
       
    }, []);

    return (
        <Row>
            <Col className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <h4><Badge className="bg-info">Option 1</Badge> Upload the encry JSON file.</h4>
            </Col>
            <Col className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <input type="file" onChange={(ev) => {
                    self.changeFile(ev);
                }} />
                <p>{info}</p>
            </Col>
            <Col className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col  className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <h4><Badge className="bg-info">Option 2</Badge> Create a new account.</h4>
            </Col>
            <Col className="pt-4 pb-4" sm={size.left[0]} xs={size.left[0]}>
                <input className="form-control" type="password" placeholder="Password for new account"
                    value={password}
                    onChange={(ev) => {
                        self.changePassword(ev);
                    }}
                />
            </Col>
            <Col className="pt-4 pb-4 text-end" sm={size.left[1]} xs={size.left[1]}>
                <button disabled={disable} className="btn btn-md btn-primary" onClick={(ev) => {
                    self.clickNewAccount(ev)
                }}>Create</button>
            </Col>
        </Row>
    )
}

export default AccountLogin;