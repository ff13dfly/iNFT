import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Data from "../lib/data";
import Local from "../lib/local";
import tools from "../lib/tools"

import Tpl from "../lib/tpl";

import Network from "../network/router";

function Setting(props) {
    const size = {
        row: [12],
        offset:[1,9,2],
        multi:[4,4,4],
        calc:[8,1,2],
        grid:1,
        head:[7,5]
    };

    const config={
        multiMax:9,
    }

    let [hash, setHash]=useState("0x0e70dc74951952060b5600949828445eb0acbc6d9b8dbcc396c853f889fea9bb");
    
    let [grid,setGrid]=useState([]);

    let [amount, setAmount]=useState(0);
    let [cid, setCid]=useState("");

    let [list,setList]=useState([]);
    let [multi, setMulti]=useState(1);

    const self={
        clickSingleOffset:(index,val)=>{
            const active=Data.get("template");
            const max=active.parts[index].value[2];
            list[index]=(val>max-2)?0:val+1;
            const nlist=tools.clone(list);
            setList(nlist);
            self.updateTemplate(active.cid,"offset",nlist);
        },
        clickIncMulti:(ev)=>{
            if(multi!==config.multiMax){
                const n=multi+1;
                //console.log(n);
                setMulti(n);

                const active=Data.get("template");
                self.updateTemplate(active.cid,"multi",n);
            }
        },
        clickDecMulti:(ev)=>{
            if(multi!==1){
                const n=multi-1;
                setMulti(n);

                const active=Data.get("template");
                self.updateTemplate(active.cid,"multi",n);
            }
        },
        getHashGrid:(str,divide)=>{
            const pure=str.slice(2);
            const n=Math.ceil(pure.length/divide);
            //console.log(pure,n);
            const arr=[];
            for(let i=0;i<n;i++){
                //console.log(str.slice(i*divide,i*divide+divide))
                arr.push(pure.slice(i*divide,i*divide+divide))
            }
            return arr;
        },
        getTemplate:(cid)=>{
            const ts = Local.get("template");
            if(!ts) return false;
            try {
                const tpls=JSON.parse(ts);
                for(let i=0;i<tpls.length;i++){
                    const row=tpls[i];
                    if(row.alink===cid) return row;
                }
            } catch (error) {
               return false; 
            }
        },
        updateTemplate:(cid,key,offset)=>{
            const ts = Local.get("template");
            if(!ts) return false;
            try {
                const tpls=JSON.parse(ts);
                //console.log(cid,offset);
                for(let i=0;i<tpls.length;i++){
                    if(tpls[i].alink===cid) tpls[i][key]=offset;
                }
                Local.set("template",JSON.stringify(tpls));
            } catch (error) {
               return false; 
            }
        },
        getOffset: (tpl,parts) => {
            if(!tpl.offset || tpl.offset.length!==parts.length){
                //create offset setting, if not;
                const os=[];
                for(let i=0;i<parts.length;i++){
                    const part=parts[i];
                    const divide=part.value[2];
                    //console.log(divide);
                    os.push(tools.rand(0,divide-1));
                }

                //update to template;
                self.updateOffset(tpl.alink,os);

                return os;
            }else{
                //confirm the offset;
                return tpl.offset;
            }   
        },
        autoShow:()=>{
            const active=Data.get("template");
            if(active===null) return setTimeout(()=>{
                self.autoShow();
            },1000);

            //console.log(active.cid);
            const tpl=self.getTemplate(active.cid);
            if(!tpl) return setTimeout(()=>{
                self.autoShow();
            },1000);

            const offset=self.getOffset(tpl,active.parts);
            setAmount(active.parts.length);
            setCid(active.cid);
            setList(offset);
            setMulti(tpl.multi!==undefined?tpl.multi:1);
        },

        getValue:(index)=>{
            const active=Data.get("template");
            const part=active.parts[index];
            const start=part.value[0];
            const step=part.value[1];
            //console.log(start,step);
            return `0x${hash.slice(2).slice(start,start+step)}`
        },
        getDec:(index)=>{
            const active=Data.get("template");
            const part=active.parts[index];
            const start=part.value[0];
            const step=part.value[1];
            //console.log(start,step);
            return  parseInt(`0x${hash.slice(2).slice(start,start+step)}`);
        },
        getDivide:(index)=>{
            const active=Data.get("template");
            const part=active.parts[index];
            return part.value[2];
        },
        getOffetOfTemplate:(index)=>{
            const active=Data.get("template");
            const part=active.parts[index];
            return part.value[3];
        },
        getFinal:(index,offset)=>{
            const val=self.getDec(index);
            const tpl_offset=self.getOffetOfTemplate(index);
            const final=val+tpl_offset+offset;
            return final
        },
        getPartValue:(index,offset)=>{
            const divide=self.getDivide(index);
            const final=self.getFinal(index,offset);
            return final%divide;
        },
    }

    useEffect(() => {
        self.autoShow();
        const arr=self.getHashGrid(hash,16);
        setGrid(arr);
        // Network("tanssi").subscribe("setting",(bk, bhash)=>{
        //     const arr=self.getHashGrid(bhash,16);
        //     setGrid(arr);
        //     setHash(bhash);
        // });
    }, [props.update]);

    const cmap={
        background:"#555555",
        borderRadius:"10px"
    }

    return (
        <Row>
            <Col className="text-center board" style={cmap} sm={size.head[0]} xs={size.head[0]}>
                <Row>
                    <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                    Mock hash
                    </Col>
                    <Col className="text-center pt-1" sm={size.row[0]} xs={size.row[0]}>
                        {grid.map((row, index) => (
                            <p className="hash_setting" key={index}>{row}</p>
                        ))}
                    </Col>
                </Row>
            </Col>
            <Col className="text-center" sm={size.head[1]} xs={size.head[1]}>
                <Row>
                    <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                    Selected part
                    </Col>
                    <Col className="text-center pt-1" sm={size.row[0]} xs={size.row[0]}>
                        
                    </Col>
                </Row>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                Image thumb here to show select part.
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <strong>{amount}</strong> parts of template <strong>{tools.shorten(cid,8)}</strong>
            </Col>
            <Col className="pt-2 pb-2" style={cmap} sm={size.row[0]} xs={size.row[0]}>
                <div className="setting">
                {list.map((row, index) => (        
                    <Row key={index}>
                        <Col className="pt-2" sm={size.offset[0]} xs={size.offset[0]}>
                            <h5>#{index+1}</h5>
                        </Col>
                        <Col className="pt-2 text-center" sm={size.offset[1]} xs={size.offset[1]}>
                            <Row>
                                <Col className="text-end" sm={size.calc[0]} xs={size.calc[0]}>
                                    {"( "}{self.getDec(index)}{" + "}{self.getOffetOfTemplate(index)}
                                    {" + "}
                                    <span className="text-primary"><strong>{row}</strong></span>
                                    {" )"}{" % "}{self.getDivide(index)}
                                </Col>
                                <Col className="text-center" sm={size.calc[1]} xs={size.calc[1]}>=</Col>
                                <Col className="" sm={size.calc[2]} xs={size.calc[2]}>
                                    <span className="text-warning"><strong>{self.getPartValue(index,row)}</strong></span>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="pt-1" sm={size.offset[2]} xs={size.offset[2]}>
                            <button className="btn btn-md btn-primary offset" onClick={(ev)=>{
                                self.clickSingleOffset(index,row);
                            }}>{row}</button> 
                        </Col>
                    </Row>
                
                ))}
                </div>
            </Col>
            <Col className="pt-2" sm={size.row[0]} xs={size.row[0]}>
                Set up your offset to win iNFT.
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                <hr />
            </Col>
            <Col className="text-center" sm={size.row[0]} xs={size.row[0]}>
                Set the mint times/click, {config.multiMax} max.
            </Col>
            <Col className="pt-2 text-end" sm={size.multi[0]} xs={size.multi[0]}>
                <button disabled={multi===1} className="btn btn-md btn-secondary" onClick={(ev)=>{
                    self.clickDecMulti(ev);
                }}>-</button>
            </Col>
            <Col className="pt-2 text-center unselect" sm={size.multi[1]} xs={size.multi[1]}>
                <h2 className="text-warning">{multi}</h2>
            </Col>
            <Col className="pt-2" sm={size.multi[2]} xs={size.multi[2]}>
                <button disabled={multi===config.multiMax} className="btn btn-md btn-secondary" onClick={(ev)=>{
                    self.clickIncMulti(ev);
                }}>+</button>
            </Col>
        </Row>
    )
}

export default Setting;