import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaAngleLeft, FaAngleRight, FaHeart, FaRegHeart } from "react-icons/fa";

import Result from "./result";

import Local from "../lib/local";
import Render from "../lib/render";
import Data from "../lib/data";
import tools from "../lib/tools";

import INFT from "../lib/inft";

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
            self.autoshow();
        },
        clickNext: (ev) => {
            if(page>sum){
                page=sum
            }else{
                page++;
            }
            self.autoshow();
        },
        clickSingle: (name) => {
            const fa = Local.get("login");
            if (!fa) return false;
            const login = JSON.parse(fa);
            const addr = login.address;
            const ls = Local.get("list");
            const my = JSON.parse(ls);
            const full = my[addr];
            for(let i=0;i<full.length;i++){
                const dt=full[i];
                if(dt.anchor===name){
                    return props.dialog(<Result 
                        name={dt.anchor} 
                        hash={dt.hash} 
                        block={dt.block} 
                        offset={dt.offset}
                        template={dt.template.hash}
                        price={!dt.price?0:dt.price}
                        fav={dt.fav}
                        back={true} 
                        dialog={props.dialog}
                    />, "iNFT Details");
                }
            }

        },
        clickFav:(ev)=>{
            page=1;  //reset page value
            filter.fav=!filter.fav;
            setFilter(tools.clone(filter));
            self.autoshow();
        },
        autoshow:()=>{
            setDone(false);
            setProgress("Loading ...");
            INFT.list(page,config.page_count,(dt)=>{
                const nav=dt.nav;
                setSum(nav.sum);
                setDone(true);
                setList(dt.data);
            });
        }
    }

    useEffect(() => {
        self.autoshow();
    }, [props.update]);

    return (
        <Row>
            <Col hidden={true} id="handle" sm={size.row[0]} xs={size.row[0]}>

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
                                //self.clickSingle((page-1)*config.page_count+index);
                                self.clickSingle(row.anchor);
                            }}>
                                <Row>
                                    <Col className="grid" sm={size.row[0]} xs={size.row[0]} >
                                        <img className="mine"  src={row.thumb} alt="" />
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