import Viewer from "../component/viewer";
import Detail from "../component/detail";
import TPL from "../lib/tpl";

const self={    
    view:(UI,alink)=>{

    },
    template:(UI,cid)=>{
      //1.save the template to local as the first one;
      TPL.view(cid,(def)=>{
        if(!def) return false;

        TPL.add(cid,()=>{
          
        },true);

         //2.show details of the template
        if(UI.dialog){
          UI.dialog(<Detail alink={cid} dialog={UI.dialog} fresh={UI.fresh}/>,"iNFT template previewer");
        }
      });
    },
  }

  export default self;