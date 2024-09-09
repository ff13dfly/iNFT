import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Original image selector 
*   @param  {string}    name        //unique name to load data from local indexedDB
*   @param  {function}  callback    //callback the selected parts index
*/

function ImageOrgin(props) {
  const size = {
    row: [12],
    grid: [1, 3],
  };

  let [list, setList]=useState([]);
  let [orgin, setOrgin] = useState(`${window.location.origin}/imgs/full.png`);    //the image to edit
  let [active, setActive]=useState(0);    //selected cover 

  let [line, setLine] = useState(8);
  let [row, setRow] = useState(4);


  const self = {
    changeLine: (ev) => {
      setLine(ev.target.value);
    },
    changeRow: (ev) => {
      setRow(ev.target.value);
    },
    clickCover:(index)=>{
      setActive(index);
      if(props.callback)  props.callback(index);
    },
    getCover:(n)=>{
      const arr=[];
      const w=100,h=200,top=200;
      for(let i=0;i<n;i++){
        arr.push({
          width:w,
          height:h,
          top:top,
        });
      }
      return arr;
    },

    //get the image basic parameters from image URL or Base64 string
    getImageDetail:(img)=>{   

    },
  }

  useEffect(() => {
    const arr=self.getCover(8);
    setList(arr);
  }, []);

  return (
    <div className="orgin-container pt-2">
      <div className="orgin-image" style={{ backgroundImage: `url(${orgin})` }}>
        {list.map((row, index) => (
          <div 
            key={index}
            className={index===active?"orgin-cover cover-active":"orgin-cover cover-default"}  
            style={{ 
              width: `${row.width}px`, 
              height: `${row.height}px`,
              lineHeight: `${row.height}px`,
              marginTop:`${row.top}px`,
            }}
            onClick={(ev)=>{
              self.clickCover(index);
            }}
          >
            <h3 style={{ lineHeight: `${row.height}px`}}>{index}</h3>
          </div>
        ))}
        {/* <div className="orgin-cover cover-default" style={{ width: "100px", height: "100px", lineHeight: "100px", marginTop:"200px" }}>
          <h3 style={{ lineHeight: "100px" }}>0</h3>
        </div>
        <div className="orgin-cover cover-default" style={{ width: "100px", height: "100px", lineHeight: "100px", marginTop:"200px" }}>
          <h3 style={{ lineHeight: "100px" }}>1</h3>
        </div>
        <div className="orgin-cover cover-active" style={{ width: "100px", height: "100px", lineHeight: "100px", marginTop:"200px" }}>
          <h3 style={{ lineHeight: "100px" }}>2</h3>
        </div>
        <div className="orgin-cover cover-default" style={{ width: "100px", height: "100px", lineHeight: "100px", marginTop:"200px" }}>
          <h3 style={{ lineHeight: "100px" }}>3</h3>
        </div> */}
      </div>
    </div>
  );
}
export default ImageOrgin;