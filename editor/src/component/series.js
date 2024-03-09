import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { FaPlus,FaTrash } from "react-icons/fa";

import  Data from "../lib/data";

function Series(props) {

    const size = {
        row: [12],
        title:[8,4],
        list:[8,4],
    };

    let [series,setSeries]=useState([]);

    const self={
        clickAdd:(ev)=>{
            const def=Data.get("NFT");
            if(def===null) return false;
            if(def.series===undefined) def.series=[];

            //1.增加系列
            def.series.push({name:"",desc:""});
            const sum=def.series.length;

            //2.整理puzzle里的rarity的数据
            for(let i=0;i<def.puzzle.length;i++){
                if(!def.puzzle[i].rarity) def.puzzle[i].rarity=[];
                def.puzzle[i].rarity=self.getNewRarity(def.puzzle[i].rarity,sum)
            }

            self.save(def);
        },
        clickRemove:(index)=>{
            const def=Data.get("NFT");
            if(def===null) return false;
            def.series=self.getArrayRemoved(def.series,index);

            for(let i=0;i<def.puzzle.length;i++){
                if(!def.puzzle[i].rarity) def.puzzle[i].rarity=[];
                def.puzzle[i].rarity=self.getArrayRemoved(def.puzzle[i].rarity,index)
            }
            self.save(def);
        },
        getArrayRemoved:(list,index)=>{
            const arr=[];
            for(let i=0;i<list.length;i++){
                if(i!==index) arr.push(list[i]);
            }
            return arr;
        },
        getNewRarity:(old,sum)=>{
            const result=[];
            for(let i=0;i<sum;i++){
                if(old!==undefined && old[i]!==undefined){
                    result.push(JSON.parse(JSON.stringify(old[i])));
                }else{
                    result.push([]);
                }
            }
            return result;
        },
        save:(def)=>{
            Data.set("NFT",JSON.parse(JSON.stringify(def)));
            props.fresh();
        },
        calcRarity:(puzzle,series)=>{
            //console.log(puzzle,series);
            for(let i=0;i<series.length;i++){
                series[i].rate=1;
                for(let j=0;j<puzzle.length;j++){
                    const part=puzzle[j];
                    const max=part.value[2];
                    const bingo=part.rarity[i];
                    //console.log(bingo);
                    series[i].rate=series[i].rate*(bingo.length/max);
                }
            }
            return series;
        },
    };

    useEffect(() => {
        const def=Data.get("NFT");
        if(def!==null){
            if(def.series===undefined) def.series=[];
            
            const nlist=self.calcRarity(def.puzzle,def.series);
            //console.log(nlist);
            setSeries(nlist);
        }
    }, [props.update]);

    return (
        <Row>
            <Col lg={size.title[0]} xl={size.title[0]} xxl={size.title[0]}>
                <h5>iNFT Series</h5>
            </Col>
            <Col className="text-end" lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]}>
                <FaPlus style={{ color: "rgb(13, 110, 253)", cursor: "pointer" }} onClick={(ev)=>{
                    self.clickAdd(ev);
                }}/>
            </Col>
            {series.map((row, index) => (
                <Col key={index} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                    <Row className="pb-2">
                        <Col lg={size.list[0]} xl={size.list[0]} xxl={size.list[0]}>
                        #{index} {row.name}
                        </Col>
                        <Col className="text-end" lg={size.list[1]} xl={size.list[1]} xxl={size.list[1]}>
                        <FaTrash style={{ color: "rgb(13, 110, 253)", cursor: "pointer" }} onClick={(ev)=>{
                            self.clickRemove(index);
                        }}/>
                        </Col>
                    </Row>
                </Col>
            ))}
        </Row>
    )
}

export default Series;