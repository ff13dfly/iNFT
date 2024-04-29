import { Row, Col, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";

import { mnemonicGenerate } from "@polkadot/util-crypto";

import Copy from "../lib/clipboard";
import Local from "../lib/local";
import tools from "../lib/tools";
import Network from "../network/router";

// import Faucet from "./faucet";
import System from "./system";

import {  FaCopy,FaDownload,FaSignInAlt,FaBitcoin } from "react-icons/fa";

function Account(props) {
    const size = {
        row: [12],
        user: [4, 8],
        logout:[8,4],
        new:[9,3]
    };

    let [login, setLogin] = useState(false);

    let [avatar, setAvatar] = useState("image/empty.png");
    let [balance, setBalance] = useState(0);
    let [address, setAddress] = useState("");

    let [info, setInfo] = useState("");

    let [password, setPassword]= useState("");
    let [dis_new, setNewDisable] = useState(true);

    let [recover,setRecover]=useState({});
    
    const {Keyring}=window.Polkadot;

    const self = {
        newAccount: (mnemonic,ck) => {
            const keyring = new Keyring({ type: "sr25519" });
            const pair = keyring.addFromUri(mnemonic);
            const sign = pair.toJson(password);
            sign.meta.from = "minter";

            return ck && ck(sign);
        },
        changePassword:(ev)=>{
            setPassword(ev.target.value);
            setNewDisable(!ev.target.value?true:false);
        },
        clickNewAccount: (ev) => {
            setNewDisable(true);
            const mnemonic = mnemonicGenerate();
            self.newAccount(mnemonic,(fa) => {
                Local.set("login", JSON.stringify(fa));
                setLogin(true);
                self.show();
                props.fresh();
            });
        },
        clickLogout:(ev)=>{
            Local.remove("login");
            setLogin(false);
            props.fresh();
        },
        clickDownload:(ev)=>{
            const fa=Local.get("login");
            if(!fa) return false;
            tools.download(`${address}.json`,fa);
        },
        clickCopy:(ev)=>{
            Copy(address);
            // setCopy("Copied");
            // setCopyDisable(true);
            // setTimeout(() => {
            //     setCopy("Copy");
            //     setCopyDisable(false);
            // }, 300);
        },
        clickRecover:(key,at)=>{
            if(!recover[key]){
                recover[key]="text-info";
                setRecover(tools.copy(recover));
                setTimeout(()=>{
                    delete recover[key];
                    setRecover(tools.copy(recover));
                },!at?1000:at);
            }
        },
        clickFaucet:(ev)=>{
            console.log(`Getting faucet...`);
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
                        Local.set("login",e.target.result);
                        setLogin(true);
                        self.show();
                        props.fresh();
                    } catch (error) {
                        setInfo("Not encry JSON file");
                    }
                };
                reader.readAsText(fa);
            } catch (error) {
                setInfo("Can not load target file");
            }
        },
        show:()=>{
            const fa = Local.get("login");
            if(fa!==undefined) setLogin(true);
            try {
                const account=JSON.parse(fa);
                setAddress(account.address);
                setAvatar(`https://robohash.org/${account.address}?set=set2`);
                Network("tanssi").balance(account.address,(res)=>{
                    const divide=Network("tanssi").divide();

                    setBalance(tools.toF(res.free*(1/divide),8));
                })
            } catch (error) {
                
            }
        },
    }

    useEffect(() => {
        self.show();

    }, [props.update]);


    const amap = {
        width: "90px",
        height: "90px",
        borderRadius: "45px",
        background: "#FFAABB",
    };

    return (
        <Row>
            <Col className="text-center" hidden={!login} sm={size.user[0]} xs={size.user[0]}>
                <img style={amap} src={avatar} alt="user logo" />
            </Col>
            <Col hidden={!login} sm={size.user[1]} xs={size.user[1]}>
                <Row>
                    <Col className="" sm={size.row[0]} xs={size.row[0]}>
                        {tools.shorten(address,8)}
                        <button className="btn btn-sm btn-secondary" style={{marginLeft:"10px"}} onClick={(ev)=>{
                            self.clickCopy(ev);
                            self.clickRecover("copy");
                        }}><FaCopy className={!recover.copy?"":recover.copy}/></button>
                    </Col>
                    <Col className="" sm={size.row[0]} xs={size.row[0]}>
                        <strong>{balance}</strong> $INFT
                    </Col>
                </Row>
            </Col>
            <Col hidden={!login} className="pt-4" sm={size.logout[0]} xs={size.logout[0]}>
                <button className="btn btn-md btn-secondary" onClick={(ev)=>{
                    self.clickDownload(ev);
                }}><FaDownload /> Encried Key</button>
                <button className="btn btn-md btn-secondary" style={{marginLeft:"10px"}} onClick={(ev)=>{
                    self.clickFaucet(ev);
                }}><FaBitcoin /> Faucet</button>
                {/* <button disabled={dis_copy} className="btn btn-md btn-primary" style={{marginLeft:"10px"}} onClick={(ev)=>{
                    self.clickCopy(ev);
                }}>{copy}</button> */}
            </Col>
            <Col hidden={!login} className="pt-4 text-end" sm={size.logout[1]} xs={size.logout[1]}>
                <button className="btn btn-md btn-danger" onClick={(ev)=>{
                    self.clickLogout(ev);
                }}><FaSignInAlt /> Logout</button>
            </Col>
            {/* <Col hidden={!login} className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <Faucet fresh={self.fresh} update={props.update}/>
            </Col> */}

            <Col hidden={!login} className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <System fresh={self.fresh} update={props.update}/>
            </Col>

            <Col hidden={login} className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <h4><Badge className="bg-info">Option 1</Badge> Upload the encry JSON file.</h4>
            </Col>
            <Col hidden={login} className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <input type="file" onChange={(ev) => {
                    self.changeFile(ev);
                }} />
                <p>{info}</p>
            </Col>
            <Col className="pt-4" hidden={login} sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col hidden={login} className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <h4><Badge className="bg-info">Option 2</Badge> Create a new account.</h4>
            </Col>
            <Col hidden={login} className="pt-4 pb-4" sm={size.new[0]} xs={size.new[0]}>
                <input className="form-control" type="password" placeholder="Password for new account" 
                    value={password} 
                    onChange={(ev)=>{
                        self.changePassword(ev);
                    }}
                />
            </Col>
            <Col hidden={login} className="pt-4 pb-4 text-end" sm={size.new[1]} xs={size.new[1]}>
                <button disabled={dis_new} className="btn btn-md btn-primary" onClick={(ev) => {
                    self.clickNewAccount(ev)
                }}>Create</button>
            </Col>
        </Row>
    )
}

export default Account;