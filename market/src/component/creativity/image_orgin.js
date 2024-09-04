import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function ImageOrgin(props) {
  const size = {
    row: [12],
    grid: [1, 3],
  };

  let [orgin, setOrgin] = useState(`${window.location.origin}/imgs/logo.png`);
  let [line, setLine] = useState(8);
  let [row, setRow] = useState(4);


  const self = {
    changeLine: (ev) => {
      setLine(ev.target.value);
    },
    changeRow: (ev) => {
      setRow(ev.target.value);
    },
  }

  useEffect(() => {

  }, []);

  return (
    <Row className="pt-2">
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <div className="orgin-container" style={{ backgroundImage: `url(${orgin})` }}>
          <div className="orgin-cover" style={{ width: "100px", height: "100px", lineHeight: "100px" }}>
            <h3 style={{ lineHeight: "100px" }}>0</h3>
          </div>
          <div className="orgin-cover" style={{ width: "100px", height: "100px", lineHeight: "100px" }}>
            <h3 style={{ lineHeight: "100px" }}>1</h3>
          </div>
          <div className="orgin-cover" style={{ width: "100px", height: "100px", lineHeight: "100px" }}>
            <h3 style={{ lineHeight: "100px" }}>2</h3>
          </div>
        </div>
      </Col>
    </Row>
  );
}
export default ImageOrgin;