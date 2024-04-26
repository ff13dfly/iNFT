import { Col, Badge } from "react-bootstrap";

function RowPart(props) {
    const size = {
        row: [12],
    };

    const config={
        width:16,   //single character width;
        tag:8,
        padding:6.8,
        start:0,
    }

    const self={
        combine:(group)=>{
            const map={}
            let order=0;
            for(let i=0;i<group.length;i++){
                if(group[i]!==0){
                    const index=group[i];
                    if(!map[index]){
                        map[index]={offset:[],order:order};
                        order++;
                    } 
                    map[index].offset.push(i);
                }
            }
            map.queue=order;    //record the length of badge;
            return map;
        },
        getStruture:(n)=>{
            const arr=[];
            for(let i=0;i<n;i++){
                arr.push({index:0,position:0,data:null});
            }
            return arr;
        },
        struct:(group,section)=>{
            //1.get target data
            const map=self.combine(group);
            const arr=self.getStruture(map.queue);
            delete map.queue;

            //2.put all badges in a single queue
            for(var k in map){
                const row=map[k];
                const order=row.order;
                arr[order].index=parseInt(k);
                arr[order].data=map[k].offset;
            }

            //3.calc the position
            for(let i=0;i<arr.length;i++){
                const cur=arr[i];
                const c_len=cur.data.length;
                const index=`#${cur.index}`;
                const badge_width=index.length*config.tag+config.padding*2;
                console.log(badge_width);
                if(i===0){
                    //arr[i].position=config.start+config.width*(cur.data[c_len-1])*0.5-badge_width*0.5;
                    arr[i].position=config.width*(cur.data[c_len-1])*0.5-badge_width*0.5;
                }else{
                    const pre=arr[i-1];
                    const p_len=pre.data.length;
                    arr[i].position=config.width*(cur.data[0]-pre.data[p_len-1])-badge_width*0.5;
                }
            }

            return arr;
        }
    };
    const parts=self.struct(props.group,props.section);
    return (
        <Col className="part" sm={size.row[0]} xs={size.row[0]}>
            {parts.map((row, index) => (
                <Badge key={index} style={{marginLeft:`${row.position}px`}}>#{row.index}</Badge>
            ))}
            {/* <Badge style={{marginLeft:"50px"}}>#2</Badge>
            <Badge style={{marginLeft:"84px"}}>#3</Badge> */}
        </Col>
    )
}

export default RowPart;