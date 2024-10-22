import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import PriveiwINFT from "../common/inft_preview";

import tools from "../../lib/tools";

import { FaChevronUp, FaChevronDown } from "react-icons/fa";

/* Component Sample
*   @param  {boolean}    sidebar        //wether show sidebar

*/
function CreativityPreview(props) {
  const size = {
    row: [12],
    left:[8,4],
    right:[3,9],
  };

  const style={
    hidden:{
      height:"50px",
      width:"300px",
    },
    show:{
      height:"300px",
      width:"60%",
    },
  }

  let [list, setList] = useState([]);
  let [hidden, setHidden] = useState(false);
  let [cmap, setCmap]=useState(style.show);

  //tag for the first running of creativity.
  let first=true;
  const self = {
    clickHide:(ev)=>{
      setCmap(tools.clone(!hidden?style.hidden:style.show));
      setHidden(!hidden);
    },
  }

  useEffect(() => {
    const arr=[{mock:"a"},{mock:"b"}]
    setList(arr);

    if(hidden===false && first===true){
      setTimeout(()=>{
        setCmap(tools.clone(style.hidden));
        setHidden(true);
        first=false;
      },3000)
    }
  }, []);

  return (
    <div className="container_preview">
      <Row className="content_mock" style={cmap}>
        <Col className="text-start" md={size.left[0]} lg={size.left[0]} xl={size.left[0]} xxl={size.left[0]}>
          <h5 className="pt-2">iNFT Preview</h5>
        </Col>
        <Col className="text-end" md={size.left[1]} lg={size.left[1]} xl={size.left[1]} xxl={size.left[1]}>
          <button className="btn btn-md btn-default" onClick={(ev)=>{
            self.clickHide(ev);
          }}> {hidden?<FaChevronUp size={20}/>:<FaChevronDown size={20}/>}</button>
        </Col>

        <Col style={{background:"#FFFFFF"}} hidden={hidden} md={size.left[0]} lg={size.right[0]} xl={size.right[0]} xxl={size.right[0]}>
            <PriveiwINFT
              id={"editor_preview"}
              hash={"0xffaabbccffaabbccffaabbccffaabbccffaabbccffaabbccffaabbccffaabbcc"}
              hidden={false}
              template={"bafkreibtt7ciqypa3vogodmdmvyd3trwajv3l7cqi43yk4hrtgpyopn2e4"}
              offset={[]}
              force={true}
              hightlight={false}
            />
        </Col>
        <Col style={{background:"#FFFFFF"}} hidden={hidden} md={size.left[1]} lg={size.right[1]} xl={size.right[1]} xxl={size.right[1]}>
          Mocker float on bottom
        </Col>
      </Row>
    </div>
  );
}
export default CreativityPreview;