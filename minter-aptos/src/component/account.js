import { Row, Col, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";

import Copy from "../lib/clipboard";
import Local from "../lib/local";
import tools from "../lib/tools";
import Chain from "../network/aptos";
import Encry from "../lib/encry";

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

    let [copy, setCopy]=useState("Copy");
    let [dis_copy,setCopyDisable]= useState(false);
    
    const self = {
        newAccount: (mnemonic,ck) => {
            Chain.generate(ck,mnemonic);
        },
        changePassword:(ev)=>{
            setPassword(ev.target.value);
            setNewDisable(!ev.target.value?true:false);
        },
        clickWallet:(ev)=>{
            console.log(`Connect to wallet`);
        },

        clickKeyless:(ev)=>{
            console.log(`Connect to keyless`);
        },

        clickNewAccount: (ev) => {
            setNewDisable(true);
            Chain.generate((acc)=>{
                console.log(acc);
                //console.log("address",acc.accountAddress,tools.u8aToBs58(acc.accountAddress.data));
                //console.log("private",acc.privateKey.signingKeyPair.secretKey,tools.u8aToBs58(acc.privateKey.signingKeyPair.secretKey));
                const base58=tools.u8aToBs58(acc.privateKey.signingKeyPair.secretKey);

                const fa=Encry.encode(base58,password);
                const de=Encry.decode(fa,password);
                //console.log(base58,fa,de);

                //console.log(acc.privateKey.signingKeyPair.secretKey.toString());

                Chain.recover(acc.privateKey.signingKeyPair.publicKey,(res)=>{
                    console.log(res);
                });

                if(fa!==undefined){
                    // Local.set("login", JSON.stringify(fa));
                    // setLogin(true);
                    // self.show();
                    // props.fresh();
                }
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
            setCopy("Copied");
            setCopyDisable(true);
            setTimeout(() => {
                setCopy("Copy");
                setCopyDisable(false);
            }, 300);
        },
        show:()=>{
            const fa = Local.get("login");
            if(fa!==undefined) setLogin(true);
            try {
                const account=JSON.parse(fa);
                setAddress(account.address);
                setAvatar(`https://robohash.org/${account.address}?set=set2`);
                Chain.balance(account.address,(res)=>{
                    setBalance(parseFloat(res.free * 0.000000000001).toLocaleString());
                })
            } catch (error) {
                
            }
        },
    }

    useEffect(() => {
        self.show();

    }, [props.update]);


    const amap = {
        width: "60px",
        height: "60px",
        borderRadius: "30px",
        background: "#FFAABB",
    };

    return (
        <Row>
            <Col hidden={!login} sm={size.user[0]} xs={size.user[0]}>
                <img style={amap} src={avatar} alt="user logo" />
            </Col>
            <Col hidden={!login} sm={size.user[1]} xs={size.user[1]}>
                <Row>
                    <Col className="" sm={size.row[0]} xs={size.row[0]}>
                        {tools.shorten(address)}
                    </Col>
                    <Col className="" sm={size.row[0]} xs={size.row[0]}>
                        <strong>{balance}</strong> unit
                    </Col>
                </Row>
            </Col>
            <Col hidden={!login} className="pt-4" sm={size.logout[0]} xs={size.logout[0]}>
                <button className="btn btn-md btn-primary" onClick={(ev)=>{
                    self.clickDownload(ev);
                }}>Download Key</button>
                <button disabled={dis_copy} className="btn btn-md btn-primary" style={{marginLeft:"10px"}} onClick={(ev)=>{
                    self.clickCopy(ev);
                }}>{copy}</button>
                
            </Col>
            <Col hidden={!login} className="pt-4 text-end" sm={size.logout[1]} xs={size.logout[1]}>
                <button className="btn btn-md btn-danger" onClick={(ev)=>{
                    self.clickLogout(ev);
                }}>Logout</button>
            </Col>

            <Col hidden={login} className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <h4><Badge className="bg-info">Way 1</Badge> Keyless to Google Account.</h4>
            </Col>
            <Col className="pt-4 text-end"  sm={size.row[0]} hidden={login} xs={size.row[0]}>
                <button className="btn btn-md btn-primary" onClick={(ev)=>{
                    self.clickKeyless(ev);
                }}>Create</button>
                <p>{info}</p>
            </Col>
            <Col className="pt-4" hidden={login} sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col hidden={login} className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <h4><Badge className="bg-info">Way 2</Badge> Link to wallet.</h4>
            </Col>
            <Col className="pt-4 text-end"  sm={size.row[0]} hidden={login} xs={size.row[0]}>
                <button className="btn btn-md btn-primary" onClick={(ev)=>{
                    self.clickWallet(ev);
                }}>Connect</button>
                <p>{info}</p>
            </Col>
            <Col className="pt-4" hidden={login} sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col hidden={login} className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <h4><Badge className="bg-info">Way 3</Badge> Create a new account.</h4>
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