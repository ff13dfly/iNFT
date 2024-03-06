import { Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";

import { FaPlus } from "react-icons/fa";

import  Data from "../lib/data";

function Rarity(props) {
    const size = {
        row: [12],
        title: [8, 4],
        select:[2,10],
        button:[2],
    };

    let [ series, setSeries]=useState([]);

    const self={
        clickAdd:(ev)=>{
            const def=Data.get("NFT");
            if(def.series===undefined) def.series=[];

            //1.增加系列
            def.series.push({name:"",desc:""});
            const sum=def.series.length;

            //2.整理puzzle里的rarity的数据
            for(let i=0;i<def.puzzle.length;i++){
                if(!def.puzzle[i].rarity) def.puzzle[i].rarity=[];
                def.puzzle[i].rarity=self.getNewRarity(def.puzzle[i].rarity,sum)
            }

            Data.set("NFT",JSON.parse(JSON.stringify(def)));
            props.fresh();
        },
        clickRare:(series,index)=>{
            //console.log(series,index);
            const def=Data.get("NFT");
            const active=props.index;
            if(!def.puzzle || !def.puzzle[active]) return false;
            const target=def.puzzle[active].rarity;

            if(!target[series].includes(index)){
                target[series].push(index);
            }else{
                const arr=[];
                for(let i=0;i<target[series].length;i++){
                    const atom=target[series][i];
                    if(atom!==index) arr.push(atom);
                }
                target[series]=arr;
            }
            def.puzzle[active].rarity=target;
            //console.log(def);

            Data.set("NFT",JSON.parse(JSON.stringify(def)));
            props.fresh();
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
        getMatrix:(rarity,max,series)=>{
            console.log(rarity,series);
            const nlist=[];
            for(let i=0;i<series;i++){
                if(rarity!==undefined && rarity[i]!==undefined){
                    nlist.push(self.fillArray(rarity[i],max));
                }else{
                    nlist.push(self.fillArray([],max));
                }
            }
            return nlist;
        },
        fillArray:(arr,max)=>{
            console.log(arr,max)
            const nlist=[];
            for(let i=0;i<max;i++){
                nlist.push(arr.includes(i)?1:0);
            }
            return nlist;
        },
    }

    useEffect(() => {
        const active=props.index;
        const def=Data.get("NFT");
        const dt=def.puzzle[active];
        const sum=def.series===undefined?0:def.series.length;
        //console.log(def);
        const list=self.getMatrix(dt.rarity,dt.value[2],sum);
        console.log(list);
        setSeries(list);
    }, [props.index,props.update]);

    return (
        <Row className="pt-4">
            <Col lg={size.title[0]} xl={size.title[0]} xxl={size.title[0]}>
                <h5>iNFT Rarity</h5>
            </Col>
            <Col className="text-end" lg={size.title[1]} xl={size.title[1]} xxl={size.title[1]}>
                <FaPlus style={{ color: "rgb(13, 110, 253)", cursor: "pointer" }} onClick={(ev)=>{
                    self.clickAdd(ev);
                }}/>
            </Col>
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                {series.map((row, index) => (
                    <Row className="" key={index}>
                        <Col lg={size.select[0]} xl={size.select[0]} xxl={size.select[0]}>
                            #{index}
                        </Col>
                        <Col lg={size.select[1]} xl={size.select[1]} xxl={size.select[1]}>
                            <Row className="">
                                {row.map((single, skey) => (
                                    <Col key={skey} lg={size.button[0]} xl={size.button[0]} xxl={size.button[0]}>
                                        <button className={single?"btn btn-md btn-primary":"btn btn-md btn-default"} onClick={(ev)=>{
                                            self.clickRare(index,skey);
                                        }}>{skey}</button>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                ))}
            </Col>
        </Row>
    )
}

export default Rarity;