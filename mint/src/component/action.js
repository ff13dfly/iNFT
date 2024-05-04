import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Result from "./result";
import Setting from "./setting";
import Progress from "./progress";

import Local from "../lib/local";
import Account from "./account";
import tools from "../lib/tools"
import Chain from "../lib/chain";

import Network from "../network/router";

import { FaCogs, FaIndent } from "react-icons/fa";

function Action(props) {
    const size = {
        row: [12],
        password: [1, 10, 1],
        more: [2, 2, 8]
    };

    let [info, setInfo] = useState(" ");
    let [password, setPassword] = useState("");
    let [hidden, setHidden] = useState(true);
    let [disable, setDisable] = useState(false);
    let [holder, setHolder] = useState("Password");

    const self = {
        getAnchorName: (ck) => {
            const name = `inft_${tools.char(14).toLocaleLowerCase()}`;
            return ck && ck(name);
        },
        getINFTLocal: (name, tpl, hash, block, creator,offset) => {
            return {
                anchor: name,
                hash: hash,
                offset:offset,
                block: block,
                template: {
                    hash: tpl,
                    type: "ipfs",            //storage way
                    origin: "web3.storage",   //storage origianl
                },
                network: "tanssi",
                creator: creator,
                fav: false,                  //wether faved
                stamp: tools.stamp(),
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
                offset: !tpl.offset ? [] : tpl.offset,
                from: "ipfs",            //storage way
                origin: "web3.storage",   //storage origianl
            }
        },
        getCurrentTemplate: (full) => {
            const str = Local.get("template");
            try {
                const tpls = JSON.parse(str);
                return full ? tpls[0] : tpls[0].alink;
            } catch (error) {
                return false;
            }
        },

        isSaved: (name, list) => {
            for (let i = 0; i < list.length; i++) {
                const row = list[i];
                if (name === row.anchor) return true;
            }
            return false;
        },
        changePassword: (ev) => {
            setPassword(ev.target.value);
            setDisable(!ev.target.value ? true : false);
        },
        clickSetting: () => {
            props.dialog(<Setting />, "Mint setting");
        },
        clickPanel: () => {
            props.dialog(<Progress block={props.block} dialog={props.dialog} />, "Mint progress");
        },
        clickTask: () => {
            const fa = Local.get("login");
            if (fa === undefined) return props.dialog(<Account fresh={props.fresh} dialog={props.dialog} />, "Account Management");
            if (!password) {
                setDisable(true);
                return false;
            }
            setDisable(true);
            //setInfo("Processing start.");

            Chain.load(fa, password, (pair) => {
                if (pair.error !== undefined) {
                    setInfo(pair.error);
                    setPassword("");
                    return false;
                }
                //setInfo("Vertified.");

                props.dialog(<Progress block={props.block} dialog={props.dialog}/>, "Mint progress");

                const tpl = self.getCurrentTemplate(true);
                const multi = !tpl.multi ? 1 : parseInt(tpl.multi);

                const prefix = Local.get("prefix");
                const pointer = Local.get("pointer");
                const task = self.getTask(prefix, parseInt(pointer), tpl.alink, multi);
                Local.set("pointer", parseInt(pointer) + multi);
                Local.set("task", JSON.stringify(task));
                self.runTask(pair, tpl);
            });
        },
        getTask: (prefix, pointer, template, n) => {
            const arr = [];
            for (let i = 0; i < n; i++) {
                arr.push({
                    name: `${prefix}_${pointer + i}`,
                    tpl: template,
                    hash: "0x",
                    block: 0,
                    now: 0,
                });
            }
            return arr;
        },
        runTask: (pair, tpl) => {
            const task = self.getProgress();
            if (task === false) return setInfo("Failed to get task data.");

            Network("tanssi").subscribe("autorun", (bk, bhash) => {
                console.log(`Try to run task automatically.`);
                //1.get current task;
                let index = -1;
                for (let i = 0; i < task.length; i++) {
                    const row = task[i];
                    if (row.now === 0) {
                        index = i;
                        break;
                    }
                }

                if (index === -1) return true;

                //2.run mint from index data;
                const target = task[index];
                const raw = self.getRaw(tpl);
                const protocol = self.getProtocol();

                //3.update data and test writing.
                target.now = 1;
                self.updateProgress(index,target);

                //when more than one task, need closure to keep the index right.
                ((task_index,target) => {
                    Network("tanssi").write(pair, { anchor: target.name, raw: raw, protocol: protocol }, (process) => {
                        if (process.error) {
                            setDisable(false);
                            return setInfo(process.error);
                        }
                        console.log(process);

                        if(process.code) target.now=process.code;
                        self.updateProgress(task_index,target);

                        if (process.status === "Finalized") {
                            self.saveResult(target.name, process.hash,raw.offset,pair.address,(block)=>{

                            });
                        }
                    });
                })(index,target);
            });
        },
        updateProgress:(index,data)=>{
            const dt=self.getProgress();
            if(dt===false) return false;
            if(!dt[index]) return false;
            dt[index]=data;
            Local.set("task",JSON.stringify(dt));
            return true;
        },  
        getProgress: () => {
            const dt = Local.get("task");
            if (!dt) return false;

            try {
                return JSON.parse(dt);
            } catch (error) {
                return false;
            }
        },
        filterTask: () => {

        },

        saveResult: (name, hash,offset, creator, ck) => {
            const tpl = self.getCurrentTemplate();
            Network("tanssi").view(hash, "block", (data) => {
                const inft = self.getINFTLocal(name, tpl, hash, data.block, creator,offset);
                const its = Local.get("list");
                const nlist = its === undefined ? {} : JSON.parse(its);
                if (nlist[creator] === undefined) nlist[creator] = [];

                //avoid double writing
                if (!self.isSaved(name, nlist[creator])) {
                    nlist[creator].unshift(inft);
                    Local.set("list", JSON.stringify(nlist));
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
                            Network("tanssi").write(pair, { anchor: name, raw: raw, protocol: protocol }, (process) => {
                                if (process.error) {
                                    setDisable(false);
                                    return setInfo(process.error);
                                }
                                setInfo(process.msg);

                                if (process.status === "Finalized") {
                                    setDisable(false);
                                    self.saveResult(name, process.hash, raw.offset,pair.address, (block) => {
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
        if (fa !== undefined) {
            try {
                const addr = JSON.parse(fa);
                setHolder(`Password of ${tools.shorten(addr.address, 4)}`);
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
                        <button className="btn btn-md btn-secondary" onClick={(ev) => {
                            self.clickPanel();
                        }}><FaIndent className="" /></button>
                    </Col>
                    <Col className="text-end" sm={size.more[1]} xs={size.more[1]}>
                        <button className="btn btn-md btn-secondary" onClick={(ev) => {
                            self.clickSetting();
                        }}><FaCogs /></button>
                    </Col>
                    <Col className="" sm={size.more[2]} xs={size.more[2]}>
                        <input className="form-control" style={{ width: "100%" }} type="password" placeholder={holder}
                            value={password}
                            onChange={(ev) => {
                                self.changePassword(ev);
                            }}
                        />
                    </Col>
                </Row>
            </Col>
            <Col className="text-center pt-3" sm={size.row[0]} xs={size.row[0]}>
                <button className="btn btn-lg btn-primary" disabled={disable} onClick={(ev) => {
                    setInfo("");
                    self.clickTask(ev);
                    //self.clickMint(ev);
                }}>Mint Now!</button>
            </Col>
        </Row>
    )
}

export default Action;