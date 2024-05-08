import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaBackspace, FaRegHeart, FaHeart } from "react-icons/fa";

import Mine from "./mine";
import Progress from "./progress";

import Local from "../lib/local";
import tools from "../lib/tools";
import Chain from "../lib/chain";

import RenderiNFT from "./inft";
import Network from "../network/router";

/* iNFT result viewer component
*   @param  {string}    name        //the anchor name of iNFT
*   @param  {string}    hash        //hash needed to render the iNFT
*   @param  {number}    block       //the block which the iNFT is recorded
*   @param  {function}  dialog      //system show dialog function
*   @param  {array}     [offset]    //the customer offset array
*   @param  {string}    [template]  //the template CID
*   @param  {number}    [price]     //the selling price of iNFT
*   @param  {boolean}   [fav]       //wether faved by user
*   @param  {boolean}   [back]      //wether show back icon
*/

function Result(props) {
    const size = {
        row: [12],
        sell: [7, 5],
        back: [10, 2],
        info: [10, 2],
        fav: [10, 2],
    };

    let [holder, setHolder] = useState("Password");

    let [market, setMarket] = useState("");
    let [block, setBlock] = useState(0);

    let [selling, setSelling] = useState(false);

    let [password, setPassword] = useState("");
    let [price, setPrice] = useState("");
    let [info, setInfo] = useState("");
    let [name, setName] = useState("");

    let [fav, setFav] = useState(props.fav);

    const dom_id = "pre_result";
    const router = {
        progress: {
            title: "Mint progress",
            content: <Progress dialog={props.dialog} />,
        }
    }

    const self = {
        changePrice: (ev) => {
            setPrice(ev.target.value);
        },
        changePassword: (ev) => {
            setPassword(ev.target.value);
        },
        clickUnSell: (ev) => {
            if (!password) return setInfo("Please input the password");
            if (!name) return setInfo("Internal error: missing anchor name.");
            const fa = Local.get("login");
            if (fa === undefined) return setInfo("Internal error: no account to setup.");
            Chain.load(fa, password, (pair) => {
                Network("tanssi").revoke(pair, name, (res) => {
                    if (res.error) return setInfo(res.error);
                    setInfo(res.msg);

                    if (res.status === "Finalized") {
                        self.updateRevoking(name, (res) => {
                            setSelling(false);
                            setMarket("");
                        });
                    }
                });
            });
        },
        clickSell: (ev) => {
            if (price === 0) return setInfo("Please set a price to sell");
            if (!password) return setInfo("Please input the password");
            if (!name) return setInfo("Internal error: missing anchor name.");
            const fa = Local.get("login");
            if (fa === undefined) return setInfo("Internal error: no account to setup.");
            Chain.load(fa, password, (pair) => {
                Network("tanssi").sell(pair, name, price, (res) => {
                    if (res.error) return setInfo(res.error);
                    setInfo(res.msg);
                    if (res.status === "Finalized") {
                        //update iNFT status here;

                    }
                });
            });
        },
        clickFav: (ev) => {
            const name = props.name;
            const fa = Local.get("login");
            const ls = Local.get("list");

            try {
                const user = JSON.parse(fa);
                const nlist = JSON.parse(ls);
                if (!nlist[user.address]) return console.log("Invalid account record.");

                let index = null;
                for (let i = 0; i < nlist[user.address].length; i++) {
                    const row = nlist[user.address][i];
                    if (row.anchor === name) index = i;
                }

                if (index !== null) {
                    const nfav = !nlist[user.address][index].fav;
                    nlist[user.address][index].fav = nfav;
                    Local.set("list", JSON.stringify(nlist));
                    setFav(nfav);
                }
            } catch (error) {
                console.log(error);
            }
        },
        updateSelling: (name, price, target, ck) => {
            const fa = Local.get("login");
            const ls = Local.get("list");
            try {
                const user = JSON.parse(fa);
                const nlist = JSON.parse(ls);
                if (!nlist[user.address]) return ck && ck(false);

                let index = null;
                for (let i = 0; i < nlist[user.address].length; i++) {
                    const row = nlist[user.address][i];
                    if (row.anchor === name) index = i;
                }

                if (index !== null) {
                    nlist[user.address][index].price = price;
                    nlist[user.address][index].target = target;
                    Local.set("list", JSON.stringify(nlist));
                }
                return ck && ck(true);
            } catch (error) {
                return ck && ck({ error: "Invalid data" });
            }
        },
        updateRevoking: (name, ck) => {
            const fa = Local.get("login");
            const ls = Local.get("list");
            try {
                const user = JSON.parse(fa);
                const nlist = JSON.parse(ls);
                if (!nlist[user.address]) return ck && ck(false);

                let index = null;
                for (let i = 0; i < nlist[user.address].length; i++) {
                    const row = nlist[user.address][i];
                    if (row.anchor === name) index = i;
                }

                if (index !== null) {
                    delete nlist[user.address][index].price;
                    delete nlist[user.address][index].target;
                    Local.set("list", JSON.stringify(nlist));
                }
                return ck && ck(true);
            } catch (error) {
                return ck && ck({ error: "Invalid data" });
            }
        },
        clickHome: (ev) => {
            if (props.from && router[props.from]) {
                props.dialog(router[props.from].content, router[props.from].title);
            } else {
                props.dialog(<Mine fresh={props.fresh} dialog={props.dialog} />, "My iNFT list");
            }
        },
        show: () => {
            setName(props.name);
            setBlock(props.block);
        },
    }

    useEffect(() => {
        //0.set the selling status;
        if (props.price !== 0) {
            setSelling(true);
            setMarket(`On selling, price ${props.price} unit.`);
        }

        //1.show render result;
        self.show();

        //2.show holder infor
        const fa = Local.get("login");
        try {
            const user = JSON.parse(fa);
            setHolder(`Password of ${tools.shorten(user.address, 5)}`);
        } catch (error) {

        }

        //3.get selling status; Confirm from network. Fix the data automatically.
        Network("tanssi").view(props.name, "selling", (dt) => {
            if (dt && dt.length === 3) {
                setMarket(`On selling, price ${dt[1]} unit.`);
                setSelling(true);
                self.updateSelling(props.name, dt[1], dt[2]);
            }
        });

    }, [props.update]);

    return (
        <Row>
            <Col className="pt-2" sm={size.back[0]} xs={size.back[0]}>
                {name} at block {block.toLocaleString()}
            </Col>
            <Col className="pb-2 text-end" hidden={!props.back} sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev) => {
                    self.clickHome(ev);
                }} />
            </Col>
            <Col className="text-center pt-2" sm={size.row[0]} xs={size.row[0]} style={{ minHeight: "300px" }}>
                <RenderiNFT 
                    hash={props.hash} 
                    id={dom_id}
                    template={!props.template?"":props.template} 
                    offset={!props.offset?[]:props.offset} 
                />
            </Col>
            <Col className="pt-2" sm={size.fav[0]} xs={size.fav[0]}>
                Block hash: {tools.shorten(props.hash, 12)}
            </Col>
            <Col className="pt-1 text-end" sm={size.fav[1]} xs={size.fav[1]}>
                <button className="btn btn-md btn-secondary" onClick={(ev) => {
                    self.clickFav(ev);
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
                        <input className="form-control" type="password" placeholder={holder} onChange={(ev) => {
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

export default Result;