import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Result from "./result";

import Local from "../lib/local";
import Account from "./account";
import tools from "../lib/tools"
import Chain from "../lib/chain";

import Network from "../network/router";

import { FaCogs } from "react-icons/fa";

function Action(props) {
    const size = {
        row: [12],
        password: [2, 8, 2],
        more:[2,10]
    };

    let [info, setInfo] = useState(" ");
    let [password, setPassword] = useState("");
    let [hidden, setHidden] = useState(true);
    let [disable, setDisable] = useState(false);
    let [holder,setHolder]= useState("Password");

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

        getInftLocal:(name,tpl,hash,block,creator)=>{
            return {
                anchor:name,
                hash:hash,
                block:block,
                template:{
                    hash:tpl,
                    type: "ipfs",            //storage way
                    origin: "web3.storage",   //storage origianl
                },
                network:"tanssi",
                creator:creator,
                fav:false,                  //wether faved
                stamp:tools.stamp(),
            }
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
        getCurrentTemplate:()=>{
            const str=Local.get("template");
            try {
                const tpls=JSON.parse(str);
                return tpls[0].alink;
            } catch (error) {
                return false;
            }
        },

        isSaved:(name,list)=>{
            for(let i=0;i<list.length;i++){
                const row=list[i];
                if(name===row.anchor) return true;
            }
            return false;
        },

        saveResult:(name,hash,creator,ck)=>{
            //console.log(name,hash);
            const tpl=self.getCurrentTemplate();
            Network("tanssi").view(hash,"block",(data)=>{
                const inft=self.getInftLocal(name,tpl,hash,data.block,creator);

                const its=Local.get("list");
                const nlist=its===undefined?{}:JSON.parse(its);
                if(nlist[creator]===undefined)nlist[creator]=[];

                //avoid double writing
                if(!self.isSaved(name,nlist[creator])){
                    nlist[creator].unshift(inft);
                    Local.set("list",JSON.stringify(nlist));
                }

                return ck && ck(data.block);
            }); 
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
                        try {
                            const tpls = JSON.parse(list);
                            const target = tpls[0];
                            const raw = self.getRaw(target);
                            const protocol = self.getProtocol();
                            props.countdown();
                            Network("tanssi").write(pair, { anchor: name, raw: raw, protocol: protocol }, (process) => {
                                if(process.error){
                                    setDisable(false);
                                    return setInfo(process.error);
                                }
                                setInfo(process.msg);

                                if(process.status==="Finalized"){
                                    //console.log(process);
                                    setDisable(false);

                                    //Save the iNFT result here;
                                    self.saveResult(name,process.hash,pair.address,(block)=>{
                                        props.dialog(<Result 
                                            name={name} 
                                            hash={process.hash} 
                                            block={block}
                                            price={0}
                                            fav={false}
                                            template={target.alink}
                                        />, "iNFT Result");
                                        setTimeout(() => {
                                            setInfo("");
                                        }, 400);
                                    });
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
        setDisable(fa !== undefined ? true : false);
        if(fa!==undefined){
            try {
                const addr=JSON.parse(fa);
                setHolder(`Password of ${tools.shorten(addr.address,5)}`);
            } catch (error) {
                
            }
        }
    }, [props.update]);

    return (

        <Row className="operation">
            <Col className="text-center" hidden={hidden} sm={size.row[0]} xs={size.row[0]}>
                <small>{info}</small>
            </Col>
            <Col className="text-end" hidden={hidden} sm={size.password[0]} xs={size.password[0]}>
            </Col>
            <Col className="text-center" hidden={hidden} sm={size.password[1]} xs={size.password[1]}> 
                <Row>
                    <Col className="text-end" sm={size.more[0]} xs={size.more[0]}>
                        <button className="btn btn-md btn-secondary"><FaCogs/></button> 
                    </Col>
                    <Col className="" sm={size.more[1]} xs={size.more[1]}>
                        <input className="form-control" style={{width:"100%"}} type="password" placeholder={holder}
                            value={password}
                            onChange={(ev) => {
                                self.changePassword(ev);
                            }}
                        /> 
                    </Col>
                </Row>
                
                
            </Col>
            {/* <Col hidden={hidden} sm={size.password[2]} xs={size.password[2]}>
                <button className="btn btn-md btn-secondary">
                    <FaMenorah />
                </button>
            </Col> */}
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