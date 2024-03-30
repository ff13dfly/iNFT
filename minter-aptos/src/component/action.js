import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Result from "./result";

import Local from "../lib/local";
import Account from "./account";
import tools from "../lib/tools"
import Chain from "../network/aptos";

import Encry from "../lib/encry";

function Action(props) {
    const size = {
        row: [12],
        password:[2,8,2]
    };

    let [info,setInfo]=useState("");
    let [password, setPassword]=useState("");
    let [hidden,setHidden]=useState(true);
    let [disable,setDisable]=useState(false);

    const self={
        changePassword:(ev)=>{
            setPassword(ev.target.value);
            setDisable(!ev.target.value?true:false);
        },

        getAnchorName:(ck)=>{
            const name=`iNFT_${tools.char(14)}`;
            Chain.read(`anchor://${name}`,(res)=>{
                //console.log(res);
                if(res.location[1]===0) return ck && ck(name);
                return self.getAnchorName(ck);
            });
        },

        getProtocol:()=>{
            return {
                type: "data",        //数据类型的格式
                fmt: "json",
                tpl: "iNFT",
            }
        },

        getRaw:(tpl)=>{
            return {
                tpl:tpl.alink,      //使用的mint模版
                stamp:[],           //辅助证明的各个链的数据
            }
        },
        getTemplate: () => {
            const ts = Local.get("template");
            if (!ts) return false;

            try {
                const tpls = JSON.parse(ts);
                //console.log(tpls);
                return tpls[0].alink;
            }catch (error) {
                return false;
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
                try {
                    const acc=JSON.parse(fa);
                    const privateKey=Encry.decode(acc.private,password);
                    if(!privateKey){
                        setInfo("Invalid password");
                        setPassword("");
                        return false;
                    }

                    //mint contract
                    //0xcb4b4da9380ccca7a7a22b09c67368ba51e72b602fa47b27bb8aaf2a12b46ea0
                    Chain.recover(privateKey,(pair)=>{
                        const tpl = self.getTemplate();
                        if(tpl===false) return false;

                        setInfo("Ready to mint");
                        const NFT_name=`iNFT_${tools.rand(100000,999999)}`;
                        const contact="0xcb4b4da9380ccca7a7a22b09c67368ba51e72b602fa47b27bb8aaf2a12b46ea0"
                        const args={
                            hash:contact,
                            method:"::birds_nft::mint",
                            params:[
                                NFT_name,   //Mint result name
                                tpl,        //template uri | storage hash
                            ],
                        }

                        Chain.contact(pair,args,(res)=>{
                            console.log(res);
                            if(res.error){
                                setDisable(false);
                                return setInfo(res.error);
                            }
                            setInfo("Done, checking...");
                            const hash=res.hash;
                            Chain.view(hash,"transaction_hash",(trans)=>{
                                //console.log(trans);

                                setInfo("Done, checking...");
                                const NFT_hash=trans.events[0].data.token;
                                //console.log(NFT_hash);
                                props.dialog(<Result anchor={NFT_hash} />,"iNFT Result");
                                setDisable(false);
                                setTimeout(()=>{
                                    setInfo("");
                                },400);
                            });
                        });
                    });
                } catch (error) {
                    
                }
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
                <Col className="text-center" hidden={hidden} sm={size.row[0]} xs={size.row[0]}>
                    <small>{info}</small>
                </Col>
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
                        setInfo("");
                        self.clickMint(ev);
                    }}>Mint Now!</button>
                </Col>
            </Row>
        </div>
    )
}

export default Action;