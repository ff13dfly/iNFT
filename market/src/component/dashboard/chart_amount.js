import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import ReactEcharts from 'echarts-for-react';

import tools from "../../lib/tools";

/* Line chart of iNFT minted on each block
*   @param  {}   props.hash        //unique hash
*/

function ChartAmount(props) {
  const size = {
    row: [12],
  };

  let [list, setList] = useState([]);
  let [chart, setChart] = useState({
    xAxis: {
      type: 'category',
      data: [41960,41961,41962, 41963, 41964, 41965,41966,41967,41968,41969,41970]
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [10,18,20,33,12,2,80,92,20,11,33],
        type: 'bar',
        smooth: true
      }
    ]
  });

  const self = {
    
  }

  useEffect(() => {
    setInterval(()=>{
      chart.series[0].data.shift();
      chart.series[0].data.push(tools.rand(10,100));
      for(let i=0;i<chart.xAxis.data.length;i++){
        chart.xAxis.data[i]+=1;
      }
      setChart(tools.clone(chart))
    },2000);
  }, []);

  return (
    <Row>
      <Col id="line_amount" md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
      <ReactEcharts option={chart} style={{ height: '180px' }}/>
      </Col>
    </Row>
  );
}
export default ChartAmount;