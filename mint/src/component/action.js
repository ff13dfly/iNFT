import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Local from "../lib/local";
import Account from "./account";

function Action(props) {
    const size = {
        row: [12],
        password:[2,8,2]
    };

    let [password, setPassword]=useState("");
    let [hidden,setHidden]=useState(true);
    let [disable,setDisable]=useState(false);

    const {Keyring}=window.Polkadot;
    const AnchorJS=window.AnchorJS;

    const self={
        changePassword:(ev)=>{
            setPassword(ev.target.value);
            setDisable(!ev.target.value?true:false);
        },

        vertify:(fa,password,ck)=>{
            try {
                const acc=JSON.parse(fa);
                const keyring = new Keyring({ type: "sr25519" });
                const pair = keyring.createFromJson(acc);
                try {
                    pair.decodePkcs8(password);
                    return  ck && ck(pair);
                } catch (error) {
                    return ck && ck({error:"Invalid passoword"});
                }
            } catch (error) {
                return ck && ck({error:"Invalid file"}); 
            }
        },

        clickMint:(ev)=>{
            const fa = Local.get("login");
            if(fa===undefined){
                props.dialog(<Account fresh={props.fresh} dialog={props.dialog} />,"Account Management");
            }else{
                if(!password){
                    setDisable(true);
                    return false;
                }
                setDisable(true);
                self.vertify(fa,password,(pair)=>{
                    setDisable(false);

                    //AnchorJS.write(pair)
                });
            }
        },
    }
    useEffect(() => {
        const fa = Local.get("login");
        setHidden(fa!==undefined?false:true);
        setDisable(fa!==undefined?true:false)
    }, [props.update]);

    return (
        <div id="footer">
            <Row>
                <Col className="text-center" hidden={hidden} sm={size.password[0]} xs={size.password[0]}>

                </Col>
                <Col className="text-center"  hidden={hidden} sm={size.password[1]} xs={size.password[1]}>
                    <input className="form-control" type="password" placeholder="Password of account" 
                        value={password} 
                        onChange={(ev)=>{
                            self.changePassword(ev);
                        }}
                    />
                </Col>
                <Col className="text-center pt-2" sm={size.row[0]} xs={size.row[0]}>
                    <button className="btn btn-lg btn-primary" disabled={disable} onClick={(ev)=>{
                        self.clickMint(ev);
                    }}>Mint Now!</button>
                </Col>
            </Row>
        </div>
    )
}

export default Action;