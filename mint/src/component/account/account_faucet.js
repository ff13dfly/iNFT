import { Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

import config from "../../config";
import tools from "../../lib/tools";
import Local from "../../lib/local";
import Data from "../../lib/data"

import { FaFaucet } from "react-icons/fa";


function AccountFaucet(props) {
    const size = {
        row: [12],
        left:[9,3],
    };

    const info="Faucet to get free $ANk daily.";
    let [recover, setRecover] = useState({});
    let [faucet, setFaucet]= useState(info);

    const self = {
        clickRecover: (key, at) => {
            if (!recover[key]) {
                recover[key] = "text-info";
                setRecover(tools.copy(recover));
                // setTimeout(() => {
                //     delete recover[key];
                //     setRecover(tools.copy(recover));
                // }, !at ? 1000 : at);
            }
        },
        clickFaucet: async (ev) => {
            const fa = Local.get("login");
            if (fa === undefined) return self.faucetMessage("Account information missed.");
            
            try {
                const login = JSON.parse(fa);
                const furl=self.getFaucetURL(login.address);
                //console.log(furl);
                if(furl===false){
                    return self.faucetMessage(`Not support yet.`);
                }else{
                    const response = await fetch(furl);
                    if (!response.ok) return self.faucetMessage("Failed to request to faucet server.");
    
                    const ctx = await response.text();
                    try {
                        const rep=JSON.parse(ctx);
                        return self.faucetMessage(rep.message);
                    } catch (error) {
                        return self.faucetMessage(error);
                    }
                }
                
            } catch (error) {
                self.faucetMessage("Cors issue.");
            }
        },
        getFaucetURL:(addr)=>{
            const cur=Data.getHash("cache","network");
            if(config.faucet && config.faucet[cur]) return `${config.faucet[cur]}/${addr}`;
            return false;
        },
        faucetMessage:(ctx)=>{
            //console.log(ctx);
            setFaucet(ctx);
            if(recover.faucet){
                delete recover.faucet;
                setRecover(tools.copy(recover));
            }

            return setTimeout(() => {
                setFaucet(info);
            }, 3000);
        },
    }
    useEffect(() => {
       
    }, []);

    return (
        <Row >
            <Col className="pt-1" sm={size.left[0]} xs={size.left[0]}>
                {faucet}
            </Col>
            <Col className="text-end" sm={size.left[1]} xs={size.left[1]}>
                <button className="btn btn-md btn-secondary" disabled={recover.faucet} style={{ marginLeft: "10px"}} onClick={(ev) => {
                    self.clickRecover("faucet");
                    self.clickFaucet(ev);
                }}><FaFaucet className={!recover.faucet ? "pb-1" : `pb-1 ${recover.faucet}`} size={24}/></button>
            </Col>
        </Row>
    )
}

export default AccountFaucet;