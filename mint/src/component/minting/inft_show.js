import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";


import INFT from "../../system/inft";
import Local from "../../lib/local";
import Data from "../../lib/data";
import Copy from "../../lib/clipboard";
import tools from "../../lib/tools";

import RenderiNFT from "../common/inft";
import Network from "../../network/router";

import { FaCopy, FaBackspace, FaRegHeart, FaHeart } from "react-icons/fa";

/* iNFT result viewer component
*   @param  {string}    name        //the anchor name of iNFT
*   @param  {number}    block       //the block number of iNFT
*   @param  {function}  dialog      //system show dialog function
*/

function INFTShow(props) {
    const size = {
        row: [12],
        sell: [7, 5],
        back: [10, 2],
        info: [9, 3],
        fav: [10, 2],
    };

    let [holder, setHolder] = useState("Password");
    let [selling, setSelling] = useState(false);        //wether selling status

    let [market, setMarket] = useState("");
    let [password, setPassword] = useState("");
    let [price, setPrice] = useState("");
    let [info, setInfo] = useState("");
    let [fav, setFav] = useState(props.fav);
    
    let [recover, setRecover] = useState({});

    const self = {
        changePrice: (ev) => {
            setPrice(ev.target.value);
        },
        changePassword: (ev) => {
            setPassword(ev.target.value);
        },
        clickUnSell: (ev) => {
            const name = props.name;
            if (!password) return setInfo("Please input the password");
            if (!name) return setInfo("Internal error: missing anchor name.");
            const fa = Local.get("login");
            if (fa === undefined) return setInfo("Internal error: no account to setup.");

            setPassword("");
            const cur=Data.getHash("cache","network");
            Network(cur).load(fa, password, (pair) => {
                Network(cur).revoke(pair, name, (res) => {
                    if (res.error) return setInfo(res.error);
                    setInfo(res.msg);

                    if (res.status === "Finalized") {
                        INFT.single.revoke(name);
                        self.show();
                    }
                });
            });
        },
        clickSell: (ev) => {
            const name = props.name;
            if (price === 0) return setInfo("Please set a price to sell");
            if (!password) return setInfo("Please input the password");
            if (!name) return setInfo("Internal error: missing anchor name.");
            const fa = Local.get("login");
            if (fa === undefined) return setInfo("Internal error: no account to setup.");

            const cur=Data.getHash("cache","network");
            const chain=Network(cur);
            chain.load(fa, password, (pair) => {
                setPassword("");
                const amount=parseInt(parseFloat(price)*chain.divide());
                chain.sell(pair, name, amount, (res) => {
                    if (res.error) return setInfo(res.error);
                    setInfo(res.msg);
                    if (res.status === "Finalized") {
                        INFT.single.selling(name,amount,pair.address);
                        self.show();        //will update the selling information automatically.
                    }
                });
            });
        },
        clickFav: (ev) => {
            const name = props.name;
            const single=INFT.single.target(name);
            if(!single.fav){
                INFT.single.fav(name);
                setFav(true);
            }else{
                INFT.single.unfav(name);
                setFav(false);
            }
        },
        clickCopy: (name) => {
            Copy(name);
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
        // show: () => {
        //     setName(props.name);
        //     setBlock(props.block);
        //     setPassword("");
        //     setInfo("");

        //     //3.get selling status; Confirm from network. Fix the data automatically.
        //     const cur=Data.getHash("cache","network");
        //     const chain=Network(cur);
        //     chain.view(props.name, "selling", (dt) => {
        //         if (dt && dt.length === 3) {
        //             setMarket(`On selling, price ${parseFloat(dt[1]/chain.divide())} unit.`);
        //             setSelling(true);
        //         }else{
        //             setMarket("");
        //             setSelling(false);
        //         }
        //     });
        // },
    }

    useEffect(() => {
        // //console.log(props);
        const chain=Network("anchor");
        chain.view({name:props.name,block:props.block},"anchor",(dt)=>{
            console.log(dt);
        });
        // //0.set the selling status;
        // if (props.price !== 0) {
        //     const cur=Data.getHash("cache","network");
        //     const chain=Network(cur);

        //     setSelling(true);
        //     setMarket(`On selling, price ${parseFloat(props.price/chain.divide())} unit.`);
        // }

        // //1.show render result;
        // self.show();

        // //2.show holder infor
        // const fa = Local.get("login");
        // try {
        //     const user = JSON.parse(fa);
        //     setHolder(`Password of ${tools.shorten(user.address, 5)}`);
        // } catch (error) {

        // }

    }, [props.update]);

    return (
        <Row>
            <Col className="" sm={size.back[0]} xs={size.back[0]}>
                <button className="btn btn-sm btn-secondary pr-2" onClick={(ev) => {
                    self.clickCopy(props.name);
                    self.clickRecover("name");
                }}>
                    <FaCopy className={!recover.name ? "" : recover.name} />
                </button>
                <strong>{props.name} @ {!props.block?0:props.block.toLocaleString()}</strong>
            </Col>
            <Col className="pb-2 text-end" hidden={!props.back} sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev) => {
                    self.clickBack(ev);
                }} />
            </Col>
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]} style={{ minHeight: "300px" }}>
                <RenderiNFT 
                    hash={props.hash} 
                    id={"inft_result_preview"}
                    template={!props.template?"":props.template} 
                    offset={!props.offset?[]:props.offset} 
                    force={true}
                />
            </Col>
            <Col className="pt-2" sm={size.fav[0]} xs={size.fav[0]}>
                Block hash: {tools.shorten(props.hash, 12)}
            </Col>
            <Col className="pt-1 text-end" sm={size.fav[1]} xs={size.fav[1]}>
                <button className="btn btn-md btn-secondary" onClick={(ev) => {
                    self.clickFav(props.name);
                }}>{fav ? <FaHeart color={"#FFAABB"} /> : <FaRegHeart color={"#FFAABB"} />}</button>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                {market}
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col className="pb-2" sm={size.sell[0]} xs={size.sell[0]}>
                        <input className="form-control" type="password" 
                            placeholder={holder} 
                            value={password}
                            onChange={(ev) => {
                                self.changePassword(ev);
                            }} />
                    </Col>

                    <Col hidden={selling} sm={size.sell[1]} xs={size.sell[1]}>
                        <input className="form-control" type="text" placeholder="Price to sell."
                            value={price}
                            onChange={(ev) => {
                                self.changePrice(ev);
                            }} />
                    </Col>
                    <Col hidden={!selling} className="text-end" sm={size.sell[1]} xs={size.sell[1]}>
                        <button className="btn btn-md btn-primary" onClick={(ev) => {
                            self.clickUnSell();
                        }}>Revoke</button>
                    </Col>
                    <Col sm={size.info[0]} xs={size.info[0]}>
                        {info}
                    </Col>
                    <Col hidden={selling} className="text-end" sm={size.info[1]} xs={size.info[1]}>
                        <button className="btn btn-md btn-primary" onClick={(ev) => {
                            self.clickSell();
                        }}>Sell</button>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default INFTShow;