import { useState,useEffect} from "react";

import  Data from "../lib/data";

function Mocker(props) {
    const size = {
        row: [12],
    };

    let [selected,setSelected]=useState(0);

    const self = {
        changeTemplate:(ev)=>{
            const val=ev.target.value;
            setSelected(val);
            if(val==="0"){
                Data.reset();
                props.fresh();
            }else{
                const fa=window.mock_template(val);
                if(fa!==undefined){
                    const NFT={
                        puzzle:fa.parts,
                        series:fa.series,
                    }
                    Data.set("NFT",NFT);

                    //2.加载图像文件
                    if(fa.image){
                        Data.set("template",fa.image);
                    }

                    //3.更新基本参数
                    const imp_size={
                        cell:fa.cell,
                        grid:fa.grid,
                        target:fa.size,
                    };
                    Data.set("size",imp_size);

                    props.fresh();
                }
            }
        },
    }

    useEffect(() => {

    }, []);

    return (
        <select className="form-control" onChange={(ev)=>{
            self.changeTemplate(ev)
        }} value={selected}>
            <option value="0">Mock Template: None</option>
            <option value="ape">Mock Template: Bored Ape</option>
            <option value="solana">Mock Template: Solana Logo</option>
        </select>
    )
}

export default Mocker;