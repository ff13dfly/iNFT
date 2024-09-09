import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Task list filter by template
*   @param  {number}    page        //page of task
*/

function TaskList(props) {
  const size = {
    row: [12],
  };

  let [list, setList] = useState([]);

  const self = {
    
  }

  useEffect(() => {
    const arr=[{mock:"a"},{mock:"b"}]
    setList(arr);
  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>

      </Col>
      {list.map((row, index) => (
        <Col key={index} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
          {JSON.stringify(row)}
        </Col>
      ))}
    </Row>
  );
}
export default TaskList;