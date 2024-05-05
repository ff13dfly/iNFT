import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaAngleLeft, FaAngleRight, FaHeart, FaRegHeart } from "react-icons/fa";

import Result from "./result";

import Local from "../lib/local";
import Render from "../lib/render";
import Chain from "../lib/chain";
import Data from "../lib/data";
import tools from "../lib/tools";

import TPL from "../lib/tpl";

import IPFS from "../network/ipfs";


let page=1;
function Mine(props) {
    const size = {
        row: [12],
        list: [4],
        page: [4, 4, 4],
        filter: [6, 6],
        selling: [6, 6],
        detail:[9,3]
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
            console.log(`Clean the unfav list of this page.`);
            //Local.remove("list");
            //props.fresh();
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
            //console.log(index,page,config.page_count);
            const fa = Local.get("login");
            if (!fa) return false;
            const login = JSON.parse(fa);
            const addr = login.address;

            const ls = Local.get("list");
            const my = JSON.parse(ls);
            const dt = my[addr][index];
            //console.log(dt);
            props.dialog(<Result 
                name={dt.anchor} 
                hash={dt.hash} 
                block={dt.block} 
                offset={dt.offset}
                template={dt.template.hash}
                price={!dt.price?0:dt.price}
                fav={dt.fav}
                skip={true} 
                back={true} 
                dialog={props.dialog}
            />, "iNFT Details");
        },
        clickFav:(ev)=>{
            page=1;  //reset page value

            filter.fav=!filter.fav;
            setFilter(tools.clone(filter));
            
            self.showList();
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
                },50);
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
            //console.log(me)

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
                Render.preview(pen, dt.image, me.hash, dt.parts, basic,me.offset);

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

        filteList:(list,cfg)=>{
            if(!list) return [];
            const arr=[];
            for(let i=0;i<list.length;i++){
                const row=list[i];
                const key=`${!cfg.fav?0:1}_${!cfg.template?0:1}`;
                switch (key) {
                    case "0_0": //no filter
                        arr.push(row);
                        break;
                    case "1_0": //fav filter
                        if(row.fav) arr.push(row);
                        break;
                    case "0_1": //template filter
                        if(row.template.hash===cfg.template) arr.push(row);
                        break;
                    case "1_1": //fav and template filter
                        if(row.fav && row.template.hash===cfg.template) arr.push(row);
                        break;
                    default:
                        break;
                }
            }
            return arr;
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
                        const flist=self.filteList(nlist[addr],filter);
                        const plist=self.page(flist);
                        
                        const total=Math.ceil(flist.length/config.page_count);
                        setSum(total);

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
                {/* <FaGripHorizontal size="28" className="pointer" onClick={(ev)=>{
                    self.clickGridAmount();
                }}/> */}
            </Col>
            <Col className="text-end pb-2" sm={size.filter[1]} xs={size.filter[1]}>
                {/* <FaImages className="pr-2" size="24" />
                <FaBars className="pr-2" size="24" /> */}
                <FaHeart color={filter.fav?"#ffaabb":""} size="24" className="pointer" onClick={(ev)=>{
                    self.clickFav();
                }}/>
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
                                self.clickSingle((page-1)*config.page_count+index);
                            }}>
                                <Row>
                                    <Col className="grid" sm={size.row[0]} xs={size.row[0]} >
                                        <img className="mine"  src={row.bs64} alt="" />
                                    </Col>
                                    <Col className="pt-1" sm={size.detail[0]} xs={size.detail[0]}>
                                        {row.fav?<FaRegHeart/>:""} <span>{row.block.toLocaleString()}</span> 
                                    </Col>
                                    <Col className="pt-1" sm={size.detail[1]} xs={size.detail[1]}>
                                        
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
                }}>Clean Unfav</button>
            </Col>
        </Row>
    )
}

export default Mine;