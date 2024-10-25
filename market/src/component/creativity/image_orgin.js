import { Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";

import GENE from "../../system/gene";
import Drawing from "../../system/drawing";

/* Original image selector 
*   @param  {string}    props.name        //unique name to load data from local indexedDB
*   @param  {number}    props.index       //parts index
*   @param  {function}  props.callback    //callback the selected parts index
*/

function ImageOrgin(props) {
  const size = {
    row: [12],
    grid: [1, 3],
  };

  let [list, setList] = useState([]);
  let [orgin, setOrgin] = useState(`${window.location.origin}/imgs/full.png`);    //the image to edit
  let [active, setActive] = useState(0);      //selected cover 
  let [cmap, setCmap] = useState({backgroundImage: `url(${window.location.origin}/imgs/full.png)`})

  const container = useRef(null);
  const self = {
    clickCover: (index) => {
      setActive(index);
      if (props.callback) props.callback(index);
    },
    changeFile: (ev) => {
      const fa = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = e.target.result;
        const source = {
          image: img,
          start: [0, 0],
          end: [900, 900],
        }
        const target = {
          start: [0, 0],
          end: [80, 80],
        }
        Drawing.combine(source, target, (bs64) => {
          setOrgin(bs64);
          GENE.update.image(props.name, bs64, (res) => {
            console.log(res);
            if (res.error) return false;
            if (props.fresh) props.fresh();
          });
        });
      };
      reader.readAsDataURL(fa);
    },
    getCover: (part, basic, rate) => {
      const arr = [];
      const [line, row, ex, ey] = part.img;
      const [start, step, divide, offset] = part.value;
      const w = (1 + ex) * basic.cell[0] * rate;
      const h = (1 + ey) * basic.cell[1] * rate;
      const top = row * basic.cell[1] * rate;

      const max = basic.grid[0] / (1 + ex);

      for (let i = 0; i < divide; i++) {
        const bs = Math.floor((i * (1 + ex) + line) / basic.grid[0]);
        const be = ((i + 1) * (1 + ex) + line) / basic.grid[0];
        const br = (be <= 1) ? bs : Math.floor(be);
        //console.log(`Index[${i}]: max ${max},start ${bs}, end ${be}, line:${br}`);
        arr.push({
          width: w,
          height: h,
          top: br === 0 ? top : 0,
          left: (i === 0 ? line * basic.cell[0]*rate : 0),
        });
      }
      setList(arr);
    },
    calcRate: (width) => {
      const w = container.current.clientWidth;
      if (!width || !w) return false;
      return (w / width);
    },
    getImageDetail: (bs64, ck) => {
      const img = new Image();
      img.src = bs64;
      img.onload = (e) => {
        return ck && ck({ width: img.width, height: img.height });
      }
    },
    showImage: (image, iw, ih, rate) => {
      
      if (!image) {
        Drawing.create(iw, ih, (bs64) => {
          const imap={
            backgroundImage:`url(${image})`,
            height:`${ih*rate}px`,
            //width:`${iw/rate}px`,
          }
          setCmap(imap);

          GENE.update.image(props.name, bs64, (res) => {
            console.log(res);
            if (res.error) return false;
            if (props.fresh) props.fresh();
          });
        })
      } else {
        self.getImageDetail(image, (img) => {
          console.log(iw,ih,ih*rate,img);
          if (img.width !== iw || img.height !== ih) {
            console.log(`Here to reset the image size.`);
            
            return Drawing.extend(image, iw, ih, (bs64) => {
              const imap={
                backgroundImage:`url(${image})`,
                height:`${ih*rate}px`,
              }
              setCmap(imap);
              GENE.update.image(props.name, bs64, (res) => {
                //console.log(res);
                if (res.error) return false;
                if (props.fresh) props.fresh();
              });
            })
          }else{
            console.log(`Here to set container style.`);
            const imap={
              backgroundImage:`url(${image})`,
              height:`${ih*rate}px`,
            }
            setCmap(imap);
          }
        });
      }
    },
    fresh: () => {
      GENE.get(props.name, (dt) => {
        const rate=self.calcRate(dt.cell[0] * dt.grid[0]);
        //console.log(rt);
        //setRate(rt);
        if (dt.error) return false;
        if (!dt.parts || !dt.parts[props.index]) return false;

        //1.check wether image here
        const iw = dt.cell[0] * dt.grid[0];
        const ih = dt.cell[1] * dt.grid[1];
        self.showImage(dt.image, iw, ih, rate);

        //2.show cover of image
        const basic = {
          cell: dt.cell,
          size: dt.size,
          grid: dt.grid,
        }
        const part = dt.parts[props.index];
        self.getCover(part, basic, rate);
      });
    },
    getImageStyle:()=>{

    },
  }

  useEffect(() => {
    self.fresh();
  }, [props.name, props.index, props.update]);

  //<div className="orgin-image" style={{backgroundImage: `url(${orgin})`}} ref={container}>

  return (
    <div className="orgin-container pt-2" ref={container}>
      {/* <input type="file" className="form-control" onChange={(ev) => {
        self.changeFile(ev);
      }} /> */}
      <div className="orgin-image" style={cmap} >
        {list.map((row, index) => (
          <div
            key={index}
            className={index === active ? "orgin-cover cover-active" : "orgin-cover cover-default"}
            style={{
              width: `${row.width}px`,
              height: `${row.height}px`,
              lineHeight: `${row.height}px`,
              marginTop: `${row.top}px`,
              marginLeft: `${row.left}px`,
            }}
            onClick={(ev) => {
              self.clickCover(index);
            }}
          >
            <h3 style={{ lineHeight: `${row.height}px` }}>{index}</h3>
          </div>
        ))}
      </div>

    </div>
  );
}
export default ImageOrgin;