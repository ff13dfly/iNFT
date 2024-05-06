import Viewer from "../component/viewer";
import Detail from "../component/detail";

const self={
    view:(anlink)=>{
      //setTitle("iNFT viewer");
      //setContent(<Viewer anchor={anlink}/>);
      //setShow(true);
    },
    template:(cid)=>{
      //setTitle("iNFT template previewer");
      //setContent(<Detail alink={cid} dialog={self.dialog} fresh={self.fresh}/>)
      //setShow(true);
    },
    decode:(str)=>{
      if(!str || str==="#") return false;
      const pure=str.slice(1,str.length);
      const arr=pure.split("/");

      const io={
        act:"template",
        param:[],
      }
      switch (arr.length) {
        case 1:
          if(arr[0].length!==59) return false;
          io.param.push(arr[0]);
          break;

        case 2:
          io.act=arr[0];
          io.param.push(arr[1]); 
          break;

        default:

          break;
      }
      return io;
    },
  }

  export default self;