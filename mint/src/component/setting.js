import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Data from "../lib/data";
import Local from "../lib/local";
import tools from "../lib/tools"

function Setting(props) {
    const size = {
        row: [12],
        offset:[1,9,2],
        multi:[4,4,4]
    };

    const config={
        multiMax:9,
    }

    let [hash, setHash]=useState("0x");
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

            console.log(active.cid);
            const tpl=self.getTemplate(active.cid);
            if(!tpl) return setTimeout(()=>{
                self.autoShow();
            },1000);

            const offset=self.getOffset(tpl,active.parts);
            setList(offset);
            setMulti(tpl.multi!==undefined?tpl.multi:1);
        },
        
    }

    useEffect(() => {
        self.autoShow();
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col sm={size.row[0]} xs={size.row[0]}>
                Mock hash: 0x000000000000000000000000000000
            </Col>
            <Col  className="pt-1" sm={size.row[0]} xs={size.row[0]}>
                <div className="setting">
                {list.map((row, index) => (        
                
                    <Row key={index}>
                        <Col className="pt-2" sm={size.offset[0]} xs={size.offset[0]}>
                            <h5>#{index+1}</h5>
                        </Col>
                        
                        <Col className="pt-2" sm={size.offset[1]} xs={size.offset[1]}>
                            Value:
                        </Col>
                        <Col className="text-end" sm={size.offset[2]} xs={size.offset[2]}>
                            <button className="btn btn-md btn-primary offset" onClick={(ev)=>{
                                self.clickSingleOffset(index,row);
                            }}>{row}</button> 
                        </Col>
                    </Row>
                
                ))}
                </div>
            </Col>
            <Col sm={size.row[0]} xs={size.row[0]}>
                Set up your offset to win rare iNFT.
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
                <h2>{multi}</h2>
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