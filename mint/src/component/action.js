import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Result from "./result";

import Local from "../lib/local";
import Account from "./account";
import tools from "../lib/tools"
import Chain from "../lib/chain";

import Network from "../network/router";

function Action(props) {
    const size = {
        row: [12],
        password: [2, 8, 2]
    };

    let [info, setInfo] = useState("");
    let [password, setPassword] = useState("");
    let [hidden, setHidden] = useState(true);
    let [disable, setDisable] = useState(false);

    const self = {
        changePassword: (ev) => {
            setPassword(ev.target.value);
            setDisable(!ev.target.value ? true : false);
        },

        getAnchorName: (ck) => {
            const name = `inft_${tools.char(14).toLocaleLowerCase()}`;
            // Chain.read(`anchor://${name}`,(res)=>{
            //     //console.log(res);
            //     if(res.location[1]===0) return ck && ck(name);
            //     return self.getAnchorName(ck);
            // });
            return ck && ck(name);
        },

        getProtocol: () => {
            return {
                type: "data",       //inft is type of data
                fmt: "json",        //json data
                tpl: "inft",        //inft format
            }
        },

        getRaw: (tpl) => {
            return {
                tpl: tpl.alink,          //ipfs cid
                from: "ipfs",            //storage way
                origin: "web3.storage",   //storage origianl
            }
        },

        clickMint: (ev) => {
            const fa = Local.get("login");
            if (fa === undefined) {
                props.dialog(<Account fresh={props.fresh} dialog={props.dialog} />, "Account Management");
            } else {
                if (!password) {
                    setDisable(true);
                    return false;
                }
                setDisable(true);
                setInfo("Processing start.");
                Chain.load(fa, password, (pair) => {
                    if (pair.error !== undefined) {
                        setInfo(pair.error);
                        setPassword("");
                        return false;
                    }
                    setInfo("Vertified.");
                    self.getAnchorName((name) => {
                        setInfo(`Name: ${name}`);
                        const list = Local.get("template");
                        //console.log(list);
                        try {
                            const tpls = JSON.parse(list);
                            const target = tpls[0];
                            const raw = self.getRaw(target);
                            const protocol = self.getProtocol();
                            props.countdown();
                            Network("tanssi").write(pair, { anchor: name, raw: raw, protocol: protocol }, (res) => {
                                console.log(res);
                                if (res && res.status && res.status.Finalized) {
                                    setDisable(false);
                                    props.dialog(<Result name={name} anchor={`anchor://${name}`} />, "iNFT Result");
                                    setTimeout(() => {
                                        setInfo("");
                                    }, 400);
                                }
                            });
                        } catch (error) {
                            console.log(error);
                            Local.remove("template");
                        }

                    });
                });
            }
        },
    }
    useEffect(() => {
        const fa = Local.get("login");
        setHidden(fa !== undefined ? false : true);
        setDisable(fa !== undefined ? true : false)
    }, [props.update]);

    return (

        <Row style={{ marginTop: "200px",paddingBottom:"100px"}}>
            <Col className="text-center" hidden={hidden} sm={size.row[0]} xs={size.row[0]}>
                <small>{info}</small>
            </Col>
            <Col className="text-center" hidden={hidden} sm={size.password[0]} xs={size.password[0]}>

            </Col>
            <Col className="text-center" hidden={hidden} sm={size.password[1]} xs={size.password[1]}>
                <input className="form-control" type="password" placeholder="Password of account"
                    value={password}
                    onChange={(ev) => {
                        self.changePassword(ev);
                    }}
                />
            </Col>
            <Col className="text-center pt-2" sm={size.row[0]} xs={size.row[0]}>
                <button className="btn btn-lg btn-primary" disabled={disable} onClick={(ev) => {
                    setInfo("");
                    self.clickMint(ev);
                }}>Mint Now!</button>
            </Col>
        </Row>
    )
}

export default Action;