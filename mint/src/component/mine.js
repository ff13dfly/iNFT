import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaAngleLeft, FaAngleRight, FaHeart, FaGripHorizontal } from "react-icons/fa";

import Result from "./result";

import Local from "../lib/local";
import Render from "../lib/render";
import Chain from "../lib/chain";
import Data from "../lib/data";

import IPFS from "../network/ipfs";


let page=1;

function Mine(props) {
    const size = {
        row: [12],
        list: [4],
        page: [4, 4, 4],
        filter: [6, 6],
        selling: [6, 6],
    };

    const config={
        dom_id:"pre_mine",
        page_count:9,
    }

    let [list, setList] = useState([]);
    let [info, setInfo] = useState("");

    let [progress, setProgress]=useState("");
    let [done, setDone] = useState(false);

    //let [page, setPage]=useState(1);
    let [sum, setSum]=useState(1);

    let [filter, setFilter]=useState({fav:false,template:""});  //filter value, get list by this filter

    //const dom_id = "pre_mine";
    const self = {
        clickClean: (ev) => {
            Local.remove("list");
            props.fresh();
        },
        clickPrevious: (ev) => {
            if(page<1){
                page=1
            }else{
                page--;
            }
            
            self.showList();
        },
        clickNext: (ev) => {
            if(page>sum){
                page=sum
            }else{
                page++;
            }
            self.showList();
        },
        clickSingle: (index) => {

            const fa = Local.get("login");
            if (!fa) return false;
            const login = JSON.parse(fa);
            const addr = login.address;

            const ls = Local.get("list");
            const my = JSON.parse(ls);
            const dt = my[addr][index];

            props.dialog(<Result 
                name={dt.anchor} 
                hash={dt.hash} 
                block={dt.block} 
                template={dt.template.hash}
                price={!dt.price?0:dt.price}
                fav={dt.fav}
                skip={true} 
                back={true} 
                dialog={props.dialog}
            />, "iNFT Details");
        },
        cacheTemplate: (alinks, ck, dels) => {
            if (dels === undefined) dels = [];
            if (alinks.length === 0) return ck && ck(dels);
            const single = alinks.pop();
            if (!Data.exsistHash("cache", single)) {
                return Chain.read(single, (res) => {
                    const key = `${res.location[0]}_${res.location[1]}`;
                    if (res.data[key] === undefined) {
                        const left = alinks.length;
                        dels.push(left);
                        return self.cacheData(alinks, ck, dels);
                    }
                    res.data[key].raw = JSON.parse(res.data[key].raw);
                    Data.setHash("cache", single, res.data[key]);
                    return self.cacheData(alinks, ck, dels);
                });
            } else {
                return self.cacheData(alinks, ck);
            }
        },
        cacheData: (alinks, ck, tpls) => {
            if (tpls === undefined) tpls = {};
            if (alinks.length === 0) {
                const last = [];
                for (var k in tpls) last.push(k);
                return ck && ck(last);
            }
            const single = alinks.pop();
            if (!Data.exsistHash("cache", single)) {
                return Chain.read(single, (res) => {
                    const key = `${res.location[0]}_${res.location[1]}`;
                    const raw = JSON.parse(res.data[key].raw);
                    res.data[key].raw = raw;
                    if (raw.tpl) tpls[raw.tpl] = true;

                    Data.setHash("cache", single, res.data[key]);
                    return self.cacheData(alinks, ck, tpls);
                });
            } else {
                return self.cacheData(alinks, ck, tpls);
            }
        },
        getAlinks: (arr) => {
            const alist = [];
            for (let i = 0; i < arr.length; i++) {
                alist.push(arr[i].link.toLocaleLowerCase());
            }
            return alist;
        },
        autoCache: (plist, ck) => {
            const nfts = [], tpls = {};
            for (let i = 0; i < plist.length; i++) {
                nfts.push(plist[i].anchor);                 //nft list  
                tpls[plist[i].template.hash] = true;        //set template
            }

            const ts = [];
            for (var k in tpls) ts.push(k);

            if(ts.length!==0){
                setProgress(`Getting ${ts.length===1?"1 template":(ts.length+" templates")} from IPFS ...`);
            }
            self.autoTemplate(ts, () => {
                setProgress("Rending the thumbs of iNFTs ...");
                setTimeout(()=>{
                    self.autoThumbs(plist, (glist) => {
                        return ck && ck(glist);
                    });
                },800);
            });
        },
        autoTemplate: (arr, ck) => {
            //console.log(arr);
            if (arr.length === 0) return ck && ck();
            const single = arr.pop();
            if (!Data.exsistHash("cache", single)) {
                return IPFS.read(single, (ctx) => {
                    Data.setHash("cache", single, ctx);
                    return self.autoTemplate(arr, ck);
                });
            } else {
                return self.autoTemplate(arr, ck);
            }
        },
        autoThumbs: (arr, ck, todo) => {
            if (todo === undefined) todo = [];
            if (arr.length === 0) return ck && ck(todo);
            const me = arr.shift();
            const dt = Data.getHash("cache", me.template.hash);
            const basic = {
                cell: dt.cell,
                grid: dt.grid,
                target: dt.size
            }

            //2.prepare the canvas
            const con = document.getElementById("handle");
            if(con!==null){     //invoid to render after the dialog is closed
                const cvs = document.createElement('canvas');
                cvs.id = config.dom_id;
                cvs.width = 400;
                cvs.height = 400;
                con.appendChild(cvs);

                const pen = Render.create(config.dom_id, true);
                Render.reset(pen);
                Render.preview(pen, dt.image, me.hash, dt.parts, basic);

                return setTimeout(() => {
                    me.bs64 = pen.canvas.toDataURL("image/jpeg");
                    todo.push(me);
                    con.innerHTML = "";

                    return self.autoThumbs(arr, ck, todo);
                }, 50);
            }
        },
        page: (arr) => {
            //console.log(`Page:${page}`)
            const nlist = [];
            const step=config.page_count;
            if ((page - 1) * step > arr.length) return nlist;

            for (let i = 0; i < step; i++) {
                const key = (page - 1) * step + i;
                if (arr[key] !== undefined) nlist.push(arr[key]);
            }
            //console.log(page,JSON.stringify(nlist));
            return nlist;
        },
        showList: () => {
            setDone(false);
            const fa = Local.get("login");
            setProgress("Loading ...");

            if (fa !== undefined) {
                const login = JSON.parse(fa);
                const addr = login.address;
                const ls = Local.get("list");
                if (ls !== undefined) {
                    try {
                        const nlist = JSON.parse(ls);
                        
                        const plist = nlist[addr] === undefined ? [] : self.page(nlist[addr]);
                        if(nlist[addr]!==undefined){
                            const total=Math.ceil(nlist[addr].length/config.page_count);
                            setSum(total);
                        }

                        self.autoCache(plist, (glist) => {
                            setDone(true);
                            setList(glist);
                        });
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    setInfo("Not iNFT record.");
                }
            } else {
                setInfo("Not login yet.");
            }
        },
    }

    useEffect(() => {
        self.showList();
    }, [props.update]);

    return (
        <Row>
            <Col hidden={true} id="handle" sm={size.row[0]} xs={size.row[0]}>
                {/* <canvas hidden={true} width={400} height={400} id={dom_id}></canvas> */}
            </Col>
            <Col className="pb-2" sm={size.filter[0]} xs={size.filter[0]}>
                <FaGripHorizontal size="28" className="pointer"/>
                {/*切换每行显示的数量*/}
            </Col>
            <Col className="text-end pb-2" sm={size.filter[1]} xs={size.filter[1]}>
                {/* <FaImages className="pr-2" size="24" />
                <FaBars className="pr-2" size="24" /> */}
                <FaHeart size="24" className="pointer"/>
            </Col>

            <Col sm={size.row[0]} xs={size.row[0]}>{info}</Col>
            <div className="limited">
                <Col hidden={done} sm={size.row[0]} xs={size.row[0]}>
                    <h4>{progress}</h4>
                </Col>
                <Col hidden={!done} sm={size.row[0]} xs={size.row[0]}>
                    <Row >
                        {list.map((row, index) => (
                            <Col className="pt-2" key={index} sm={size.list[0]} xs={size.list[0]} onClick={(ev) => {
                                self.clickSingle(index);
                            }}>
                                <Row>
                                    <Col className="grid" sm={size.row[0]} xs={size.row[0]} >
                                        <img className="mine"  src={row.bs64} alt="" />
                                    </Col>
                                    <Col className="pt-1" sm={size.row[0]} xs={size.row[0]}>
                                        {/* <FaMapMarkerAlt size={12}/> */}
                                        <span>{row.block.toLocaleString()}</span> 
                                    </Col>
                                </Row>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </div>
            <Col  sm={size.row[0]} xs={size.row[0]}>
                <Row>
                    <Col className="pt-2" sm={size.page[0]} xs={size.page[0]}>
                        <FaAngleLeft className="pointer" size={36} hidden={page===1} onClick={(ev)=>{
                            self.clickPrevious(ev);
                        }}/>
                    </Col>
                    <Col className="pt-2 text-center unselect" sm={size.page[1]} xs={size.page[1]}>
                        <h4> {page} / {sum} </h4>
                    </Col>
                    <Col className="pt-2 text-end" sm={size.page[2]} xs={size.page[2]}>
                        <FaAngleRight className="pointer" size={36} hidden={page===sum} onClick={(ev)=>{
                            self.clickNext(ev);
                        }}/>
                    </Col>
                </Row>
            </Col>

            <Col className="pt-2 text-center" sm={size.row[0]} xs={size.row[0]}>
                <button className="btn btn-md btn-primary" onClick={(ev) => {
                    self.clickClean(ev);
                }}>Clean</button>
            </Col>
        </Row>
    )
}

export default Mine;