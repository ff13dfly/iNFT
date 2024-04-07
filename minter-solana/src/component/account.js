import { Row, Col, Badge,Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import Copy from "../lib/clipboard";
import Local from "../lib/local";
import tools from "../lib/tools";
import Chain from "../network/solana";
import Encry from "../lib/encry";

function Account(props) {
    const size = {
        row: [12],
        user: [4, 8],
        logout:[8,4],
        new:[9,3],
        recover:[8,4],
        file:[6,6]
    };

    let [login, setLogin] = useState(false);

    let [avatar, setAvatar] = useState("image/empty.png");
    let [balance, setBalance] = useState(0);
    let [address, setAddress] = useState("");

    let [info, setInfo] = useState("");
    let [recover, setRecover]= useState("");

    let [password, setPassword]= useState("");
    let [dis_new, setNewDisable] = useState(true);

    let [copy, setCopy]=useState("Copy");
    let [dis_copy,setCopyDisable]= useState(false);

    let [dis_airdrop, setAirdropDisable]=useState(false);
    let [air,setAir]=useState("Airdrop");

    let [encryPrivate,setEncryPrivate]=useState("");
    
    const self = {
        newAccount: (mnemonic,ck) => {
            Chain.generate(ck,mnemonic);
        },
        changePassword:(ev)=>{
            setPassword(ev.target.value);
            setNewDisable(!ev.target.value?true:false);
        },
        changeRecover:(ev)=>{
            setRecover(ev.target.value);
        },
        clickWallet:(ev)=>{
            console.log(`Connect to wallet`);
        },
        clickRecover:(ev)=>{
            if(!encryPrivate) return setInfo("No private file");
            if(!recover) return setInfo("Need password to decode");
            //const bs58=window.bs58;
            //const privateKey=bs58.encode(acc.secretKey);
            const privateKey=Encry.decode(encryPrivate.private,recover);
            //console.log(encryPrivate.private,recover)
            if(!privateKey) return setInfo("Invalid password");
            //console.log(privateKey);
            Chain.recover(privateKey,(acc)=>{
                if(acc.publicKey.toString()!==encryPrivate.address) return setInfo("Invalid account");
                //console.log(acc);

                Local.set("login", JSON.stringify(encryPrivate));
                setLogin(true);
                self.show();
                props.fresh();
            });
        },
        changeFile: (ev) => {
            //1.这里需要对文件内容进行处理
            try {
              const fa = ev.target.files[0];
              const reader = new FileReader();
              reader.onload = (e) => {
                try {
                  const sign = JSON.parse(e.target.result);
                  if (!sign.address || !sign.private)
                    return setInfo("Error encry JSON file");
                  setInfo("Encoded account file loaded");
                  setEncryPrivate(sign);
                } catch (error) {
                  setInfo("Not encry JSON file");
                }
              };
              reader.readAsText(fa);
            } catch (error) {
              setInfo("Can not load target file");
            }
          },
        clickAirdrop:(ev)=>{
            setAirdropDisable(true);
            setAir("Trying");
            const divide=Chain.divide();
            //console.log(3*divide);
            Chain.airdrop(address,3*divide,(res)=>{
                Chain.balance(address,(amount)=>{ 
                    setAir("Airdrop");
                    setAirdropDisable(false);                 
                    setBalance(amount/Chain.divide());
                });
            });
        },
        clickNewAccount: (ev) => {
            if(!password) return false;
            setNewDisable(true);
            Chain.generate((acc)=>{
                const bs58=window.bs58;
                const privateKey=bs58.encode(acc.secretKey);
                const fa=Encry.encode(privateKey,password);
                const user={
                    address:acc.publicKey.toString(),
                    name:`iNFT_user_${tools.rand(100000,999999)}`,
                    private:fa,
                }

                if(fa!==undefined){
                    Local.set("login", JSON.stringify(user));
                    setLogin(true);
                    self.show();
                    props.fresh();
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


                Chain.balance(account.address,(amount)=>{
                    const divide=Chain.divide();
                    setBalance(amount/divide);
                },"devnet");
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
                        {tools.shorten(address,12)}
                    </Col>
                    <Col className="" sm={size.row[0]} xs={size.row[0]}>
                        <strong>{balance}</strong> SOL
                    </Col>
                </Row>
            </Col>
            <Col hidden={!login} className="pt-4" sm={size.logout[0]} xs={size.logout[0]}>
                <button className="btn btn-md btn-primary" onClick={(ev)=>{
                    self.clickDownload(ev);
                }}>Save</button>
                <button disabled={dis_copy} className="btn btn-md btn-primary" style={{marginLeft:"10px"}} onClick={(ev)=>{
                    self.clickCopy(ev);
                }}>{copy}</button>
                <button disabled={dis_airdrop} className="btn btn-md btn-primary" style={{marginLeft:"10px"}} onClick={(ev)=>{
                    self.clickAirdrop(ev);
                }}>{air}</button>
                
            </Col>
            <Col hidden={!login} className="pt-4 text-end" sm={size.logout[1]} xs={size.logout[1]}>
                <button className="btn btn-md btn-danger" onClick={(ev)=>{
                    self.clickLogout(ev);
                }}>Logout</button>
            </Col>
            <Col hidden={login} className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <h4><Badge className="bg-info">Way 1</Badge> From private file.</h4>
            </Col>
            <Col hidden={login} className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                <Form.Control
                    size="md"
                    type="file"
                    placeholder="Recover from private file..."
                    onChange={self.changeFile}
                />
                <p>{info}</p>
            </Col>
            <Col className="pt-2 text-end"  sm={size.recover[0]} hidden={login} xs={size.recover[0]}>
                <input className="form-control" type="password" placeholder="Password for new account" 
                    value={recover} 
                    onChange={(ev)=>{
                        self.changeRecover(ev);
                    }}
                />
            </Col>
            <Col className="pt-2 text-end"  sm={size.recover[1]} hidden={login} xs={size.recover[1]}>
                <button className="btn btn-md btn-primary" onClick={(ev)=>{
                    self.clickRecover(ev);
                }}>Recover</button>
                
            </Col>
            <Col className="pt-2" hidden={login} sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col hidden={login} className="pt-4" sm={size.row[0]} xs={size.row[0]}>
                <h4><Badge className="bg-info">Way 2</Badge> Create a new account.</h4>
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
                    //self.test();
                }}>Create</button>
            </Col>
        </Row>
    )
}

export default Account;