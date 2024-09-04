import Launch from "../component/launch";

const self={    
    template:(UI,cid)=>{
        console.log(UI);
        UI.dialog(<Launch alink={cid} dialog={UI.dialog}/>,"Launching...")
    },
}

export default self;