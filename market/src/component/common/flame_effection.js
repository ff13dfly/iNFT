import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

/* Component Sample
*   @param  {string}    hash        //unique hash
*/

function EffectionFlame(props) {
  const size = {
    row: [12],
  };

  let [list, setList] = useState([]);

  const self = {

  }

  useEffect(() => {
    const arr = [{ mock: "a" }, { mock: "b" }]
    setList(arr);
  }, []);

  return (
    <div class="g-btn">
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
      <div class="g-ball"></div>
    </div>
  );
}
export default EffectionFlame;