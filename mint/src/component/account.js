import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import AccountLogin from "./account/account_login";
import AccountFaucet from "./account/account_faucet";
import AccountCharge from "./account/account_charge";
import AccountMarket from "./account/account_market";

import config from "../config";
import Copy from "../lib/clipboard";
import Local from "../lib/local";
import tools from "../lib/tools";
import Data from "../lib/data"

import Network from "../network/router";
import INFT from "../system/inft";

import { FaCopy, FaDownload, FaSignInAlt } from "react-icons/fa";

function Account(props) {
    const size = {
        row: [12],
        user: [4, 8],
        logout: [4, 8],
        new: [9, 3],
        left:[8,4]
    };

    let [login, setLogin] = useState(false);

    let [avatar, setAvatar] = useState("image/empty.png");
    let [balance, setBalance] = useState(0);
    let [address, setAddress] = useState("");
    let [recover, setRecover] = useState({});

    const self = {
        getUnit:()=>{
            const cur=Data.getHash("cache","network");
            if(config.unit && config.unit[cur]) return config.unit[cur];
            return "unit";
        },
        clickLogout: (ev) => {
            Local.remove("login");
            setLogin(false);
            INFT.auto();
            props.fresh();
        },
        clickDownload: (ev) => {
            const fa = Local.get("login");
            if (!fa) return false;
            const json_file=`${address}.json`;
            tools.download(json_file, fa);
        },
        clickCopy: (ev) => {
            Copy(address);
        },
        clickRecover: (key, at) => {
            if (!recover[key]) {
                recover[key] = "text-info";
                setRecover(tools.copy(recover));
                setTimeout(() => {
                    delete recover[key];
                    setRecover(tools.copy(recover));
                }, !at ? 1000 : at);
            }
        },
        showBalance:(address)=>{
            const cur=Data.getHash("cache","network");
            Network(cur).balance(address, (res) => {
                const divide = Network(cur).divide();
                setBalance(parseFloat(res.free / divide));
            })
        },
        show: () => {
            const fa = Local.get("login");
            if (fa !== undefined) setLogin(true);
            try {
                const account = JSON.parse(fa);
                setAddress(account.address);
                setAvatar(`https://robohash.org/${account.address}?set=set2`);
                
                self.showBalance(account.address);
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
                    <Col className="" sm={size.left[0]} xs={size.left[0]}>
                        {tools.shorten(address, 10)}
                    </Col>
                    <Col className="text-end" sm={size.left[1]} xs={size.left[1]}>
                        <button className="btn btn-sm btn-secondary" style={{ marginLeft: "10px" }} onClick={(ev) => {
                            self.clickCopy(ev);
                            self.clickRecover("copy");
                        }}>
                            <FaCopy className={!recover.copy ? "" : recover.copy} />
                        </button>
                    </Col>
                    <Col className="" sm={size.row[0]} xs={size.row[0]}>
                        <strong>{balance}</strong> {self.getUnit()}
                    </Col>
                </Row>
            </Col>
            <Col hidden={!login} className="pt-4 text-center" sm={size.logout[0]} xs={size.logout[0]}>
                <button className="btn btn-md btn-danger" onClick={(ev) => {
                    self.clickLogout(ev);
                }}><FaSignInAlt className="pb-1"/> Logout</button>
                
            </Col>
            <Col hidden={!login} className="pt-4 text-end" sm={size.logout[1]} xs={size.logout[1]}>
                <button className="btn btn-md btn-secondary" disabled={recover.download} onClick={(ev) => {
                    self.clickRecover("download");
                    self.clickDownload(ev);
                }}>
                    <FaDownload className={!recover.download ? "pb-1" : `pb-1 ${recover.download}`}/> 
                    Encried JSON Key
                </button>
            </Col>

            <Col hidden={!login} className="pt-1" sm={size.row[0]} xs={size.row[0]}><hr/></Col>

            <Col hidden={!login} className="pt-1" sm={size.row[0]} xs={size.row[0]}>
                <AccountFaucet dialog={props.dialog}/>
            </Col>

            <Col hidden={!login} className="pt-1" sm={size.row[0]} xs={size.row[0]}>
                <AccountCharge dialog={props.dialog}/>
            </Col>
            <Col hidden={!login} className="pt-1" sm={size.row[0]} xs={size.row[0]}>
                <AccountMarket dialog={props.dialog}/>
            </Col>

            <Col hidden={login} className="pt-1" sm={size.row[0]} xs={size.row[0]}>
                <AccountLogin callback={()=>{
                    console.log(`Here, callback.`);
                    setLogin(true);
                    props.fresh();
                    self.show();
                }}/>
            </Col>

        </Row>
    )
}

export default Account;