import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function TemplateRaw(props) {
  const size = {
    row: [12],
    head: [10, 2],
  };

  let [vol, setVol] = useState(0);
  let [beauty, setBeauty]= useState(false);

  const self = {
    changeBeauty:(ev)=>{
      setBeauty(!beauty);
    }
  }

  useEffect(() => {
    //const arr=[{mock:"a"},{mock:"b"}]
    //setList(arr);
  }, []);

  return (
    <Row>
      <Col md={size.head[0]} lg={size.head[0]} xl={size.head[0]} xxl={size.head[0]}>
        Total {vol} bytes.
      </Col>
      <Col md={size.head[1]} lg={size.head[1]} xl={size.head[1]} xxl={size.head[1]}>
        <Form>
          <Form.Check type="checkbox" label={`Format beauty.`} checked={beauty} onChange={(ev) => {
            self.changeBeauty(ev);
          }} />
        </Form>
      </Col>
      <Col className="pt-2" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <textarea className="form-control" disabled rows={24}></textarea>
      </Col>
    </Row>
  );
}
export default TemplateRaw;