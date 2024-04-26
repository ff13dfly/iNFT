import { useEffect, useState } from "react";

import tools from "../lib/tools";

//block hash interval

let timer=null;

function Counter(props) {
    const size = {
        row: [12],
    };

    let [circleLeft,setLeft]=useState("circle-pro leftstatic");
    let [circleRight,setRight]=useState("circle-pro rightstatic");
    let [info,setInfo]=useState("Loading...");

    const self = {
        start:()=>{
            setLeft("circle-pro leftcircle");
            setRight("circle-pro rightcircle");

            let count=120;
            timer=setInterval(()=>{
                
                if(count===0){
                    count=120;
                    clearInterval(timer);
                    timer=null;
                    return self.stop();
                } 
                count--;

                //set the left time
                if(count<30){
                    setInfo(`${tools.toF(count*0.1,1)} s`);
                }else{
                    setInfo(`${Math.ceil(count*0.1)} s`);
                }
            },100);
        },
        stop:()=>{
            if(timer!==null) clearInterval(timer);
            setLeft("circle-pro leftstatic");
            setRight("circle-pro rightstatic");
        },
    }

    useEffect(() => {
        if(props.start) self.start();
    }, [props.start]);

    return (
        <div className="circle-box">
            <div className="circle-item right">
                <div className={circleRight}></div>
            </div>
            <div className="circle-item left">
                <div className={circleLeft}></div>
            </div>
            <p className="circle-text">{info}</p>
        </div>
    )
}

export default Counter;