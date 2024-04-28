import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import { FaBackspace } from "react-icons/fa";

import Mine from "./mine";

import Local from "../lib/local";
import Render from "../lib/render";
import Data from "../lib/data";
import tools from "../lib/tools";
import Chain from "../lib/chain";

import Network from "../network/router";

function Result(props) {
    const size = {
        row: [12],
        sell:[7,5],
        back:[10,2],
    };

    let [holder,setHolder]= useState("Password");
    //let [revoke, setRevoke]=useState("");

    let [market, setMarket]=useState("");

    let [width,setWidth]    =useState(100);
    let [height, setHeight] =useState(100);
    let [block,setBlock]= useState(0);
    
    let [block_hash,setBlockHash]=useState("");

    let [selling,setSelling]=useState(false);

    let [password, setPassword]=useState("");
    let [price, setPrice] = useState("");
    let [info, setInfo] =useState("");
    let [name,setName]=useState("");

    const dom_id="pre_result";
    const fix=40;

    const self={
        changePrice:(ev)=>{
            setPrice(ev.target.value);
        },
        changePassword:(ev)=>{
            setPassword(ev.target.value);
        },
        clickUnSell:(ev)=>{
            if(!password) return setInfo("Please input the password");
            if(!name) return setInfo("Internal error: missing anchor name.");
            const fa = Local.get("login");
            if(fa===undefined) return setInfo("Internal error: no account to setup.");
            Chain.load(fa,password,(pair)=>{
                Network("tanssi").revoke(pair,name,(res)=>{
                    if(res.error) return setInfo(res.error);
                    setInfo(res.msg);

                    if(res.status==="Finalized"){
                        self.updateRevoking(name,(res)=>{
                            setSelling(false);
                            setMarket("");
                        });
                    }
                });
            });

            // Chain.load(fa,password,(pair)=>{
            //     Chain.read(anchor,(res)=>{
            //         const key = `${res.location[0]}_${res.location[1]}`;
            //         const target_link=`anchor://${res.location[0]}/${res.location[1]}`;
            //         const dt = res.data[key];
            //         if(dt.owner!==pair.address) return setInfo("Only owner can sell the iNFT."); 
            //         Chain.unsell(pair,name,(res)=>{
            //             setInfo(res.message);
            //             if(res.step==="Finalized"){
            //                 setTimeout(()=>{
            //                     setInfo("");
            //                     setSelling(false);
            //                     Data.removeHash("cache",target_link);
            //                 },400);
            //             }
            //         });
            //     });
            // });
        },
        clickSell:(ev)=>{
            //console.log(`Ready to selling`);
            //console.log(name,password,price)
            if(price===0) return setInfo("Please set a price to sell");
            if(!password) return setInfo("Please input the password");
            if(!name) return setInfo("Internal error: missing anchor name.");
            const fa = Local.get("login");
            if(fa===undefined) return setInfo("Internal error: no account to setup.");
            Chain.load(fa,password,(pair)=>{
                Network("tanssi").sell(pair,name,price,(res)=>{
                    if(res.error) return setInfo(res.error);
                    setInfo(res.msg);

                    if(res.status==="Finalized"){
                        //update iNFT status here;

                    }
                });
            });
        },
        updateSelling:(name,price,target,ck)=>{
            const fa = Local.get("login");
            const ls = Local.get("list");
            try {
                const user=JSON.parse(fa);
                const nlist = JSON.parse(ls);
                if(!nlist[user.address]) return ck && ck(false);

                let index=null;
                for(let i=0;i<nlist[user.address].length;i++){
                    const row=nlist[user.address][i];
                    if(row.anchor===name) index=i;
                }

                if(index!==null){
                    nlist[user.address][index].price=price;
                    nlist[user.address][index].target=target;
                    Local.set("list",JSON.stringify(nlist));
                }
                return ck && ck(true);
            } catch (error) {
                return ck && ck({error:"Invalid data"});
            }
        },
        updateRevoking:(name,ck)=>{
            const fa = Local.get("login");
            const ls = Local.get("list");
            try {
                const user=JSON.parse(fa);
                const nlist = JSON.parse(ls);
                if(!nlist[user.address]) return ck && ck(false);

                let index=null;
                for(let i=0;i<nlist[user.address].length;i++){
                    const row=nlist[user.address][i];
                    if(row.anchor===name) index=i;
                }

                if(index!==null){
                    delete nlist[user.address][index].price;
                    delete nlist[user.address][index].target;
                    Local.set("list",JSON.stringify(nlist));
                }
                return ck && ck(true);
            } catch (error) {
                return ck && ck({error:"Invalid data"});
            }
        },
        clickHome:(ev)=>{
            props.dialog(<Mine fresh={props.fresh} dialog={props.dialog} />,"My iNFT list");
        },
        getTemplate:(alink,ck)=>{
            if (!Data.exsistHash("cache", alink)) {
                Chain.read(alink, (res) => {
                    const key = `${res.location[0]}_${res.location[1]}`;
                    const raw = JSON.parse(res.data[key].raw);
                    res.data[key].raw = raw;
                    Data.setHash("cache", alink, res.data[key]);
                    return ck && ck(res.data[key]);
                });
            } else {
                const dt=Data.getHash("cache", alink);
                return ck && ck(dt);
            }
        },
        show:()=>{
            //console.log(props);
            setName(props.name);
            setBlock(props.block);
            setBlockHash(props.hash);

            const tpl = Data.getHash("cache", props.template);
            setWidth(tpl.size[0]);
            setHeight(tpl.size[1]);
            setTimeout(() => {
                const pen = Render.create(dom_id,true);
                const basic = {
                    cell: tpl.cell,
                    grid: tpl.grid,
                    target: tpl.size
                }
                Render.clear(dom_id);
                Render.preview(pen,tpl.image,props.hash,tpl.parts,basic);
            }, 50);
        },
    }

    useEffect(() => {
        //0.set the selling status;
        if(props.price!==0){
            setSelling(true);
            setMarket(`On selling, price ${props.price} unit.`);
        }

        //1.show render result;
        self.show();

        //2.show holder infor
        const fa = Local.get("login");
        try {
            const user=JSON.parse(fa);
            setHolder(`Password of ${tools.shorten(user.address,5)}`);
        } catch (error) {
            
        }

        //3.get selling status; Confirm from network. Fix the data automatically.
        Network("tanssi").view(props.name,"selling",(dt)=>{
            if(dt && dt.length===3){
                setMarket(`On selling, price ${dt[1]} unit.`);
                setSelling(true);
                self.updateSelling(props.name,dt[1],dt[2]);
            }
        });

    }, [props.update,props.anchor]);

    return (
        <Row>
            <Col className="pt-2" sm={size.back[0]} xs={size.back[0]}>
                {name} at block {block.toLocaleString()}
            </Col>
            <Col className="pb-2 text-end" hidden={!props.back} sm={size.back[1]} xs={size.back[1]}>
                <FaBackspace className="pointer" size={40} color={"#FFAABB"} onClick={(ev)=>{
                    self.clickHome(ev);
                }}/>
            </Col>
            <Col className="text-center pt-2" sm={size.row[0]} xs={size.row[0]} style={{minHeight:"300px"}}>
                <canvas width={width} height={height} id={dom_id}></canvas>
            </Col>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                Block hash: {tools.shorten(block_hash,12)}
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
                        <input className="form-control" type="password" placeholder={holder} onChange={(ev)=>{
                            self.changePassword(ev);
                        }}/>
                    </Col>

                    <Col hidden={selling} sm={size.sell[1]} xs={size.sell[1]}>
                        <input className="form-control" type="text" placeholder="Price to sell." 
                        value={price} 
                        onChange={(ev)=>{
                            self.changePrice(ev);
                        }}/>
                    </Col>
                    <Col sm={size.sell[0]} xs={size.sell[0]}>
                        {info}
                    </Col>
                    <Col hidden={selling} className="text-end" sm={size.sell[1]} xs={size.sell[1]}>
                        <button className="btn btn-md btn-primary" onClick={(ev)=>{
                            self.clickSell();
                        }}>Sell</button>
                    </Col>

                    <Col hidden={!selling} sm={size.sell[0]} xs={size.sell[0]}>{info}</Col>
                    <Col hidden={!selling} className="text-end" sm={size.sell[1]} xs={size.sell[1]}>
                        <button className="btn btn-md btn-primary" onClick={(ev)=>{
                            self.clickUnSell();
                        }}>Revoke</button>
                    </Col>
                    
                </Row>
            </Col>
            
        </Row>
    )
}

export default Result;