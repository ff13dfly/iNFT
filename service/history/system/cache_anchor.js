const { config } = require('../config_anchor.js');
const { output } = require('../lib/output.js');

const self={

}

module.exports =(map,left,ck)=>{
    output(`Got iNFT related anchors, ready to cache. Write on left side: ${left}`,'primary',true);
    const keys=config.keys;
    const prefix=keys.prefix;

    let working=0;     //working tag, when it is 0, callback
    for(let block in map){
        console.log(`Got block [${block}] list`);
        const data=map[block];
        //if(parseInt(block)===13580) console.log(data);

        if(data.set!==null){
            const list_iNFT=[];
            for(let i=0;i<data.set.length;i++){
                const row=data.set[i];

                const name=row.args.key;
                const key=`${name}_${block}`;
                
                //1.1. save raw iNFT data;
                working++;
                const NFT=self.getINFT(row,parseInt(block));
                REDIS.setKey(key,JSON.stringify(NFT),(res,err)=>{
                    working--;
                    if(err) output(`Error:${err}`,'error');
                    if(working<1) return ck && ck();
                });

                //1.2. push to template queue;
                // working++;
                // const qu_template=NFT.tpl;
                // console.log(`Template queue: ${qu_template}`);
                // REDIS.pushQueue(qu_template,key,(res,err)=>{
                //     working--;
                //     if(err) output(`Error:${err}`,'error');
                //     if(working<1) return ck && ck();
                // },left);

                //1.3. push to history queue;
                // working++;
                // const qu_history=`his_${name}`;
                // const history=[block,row.index,"set",row.signer];
                // console.log(`History queue: ${qu_history}`);
                // REDIS.pushQueue(qu_history,JSON.stringify(history),(res,err)=>{
                //     working--;
                //     if(err) output(`Error:${err}`,'error');
                //     if(working<1) return ck && ck();
                // },left);

                //1.4. push to account queue;
                // working++;
                // const qu_account=`acc_${row.signer}`;
                // console.log(`Account queue: ${qu_account}`);
                // REDIS.pushQueue(qu_account,key,(res,err)=>{
                //     working--;
                //     if(err) output(`Error:${err}`,'error');
                //     if(working<1) return ck && ck();
                // },left);

                //1.5. push to block queue;
                working++;
                const qu_block=`block_${block}`;
                const block_data=[row.index,name,"set",row.signer];
                console.log(`History queue: ${qu_block}`);
                REDIS.pushQueue(qu_block,JSON.stringify(block_data),(res,err)=>{
                    working--;
                    if(err) output(`Error:${err}`,'error');
                    if(working<1) return ck && ck();
                },left);
            }

            //1.6. push to iNFT list
        }

        if(data.sell!==null){
            for(let i=0;i<data.sell.length;i++){
                working++;
                const row=data.sell[i];
                //1.1. push to selling queue;
                
                //1.2. push to history queue;

                //1.3. push to block queue;
            }
        }

        if(data.buy!==null){
            for(let i=0;i<data.buy.length;i++){
                working++;
                const row=data.buy[i];
                //1.1. remove from selling queue;

                //1.2. push to done queue;
                
                //1.2. push to history queue;

                //1.3. push to block queue;
            }
        }

        if(data.revoke!==null){
            for(let i=0;i<data.buy.length;i++){
                working++;
                const row=data.buy[i];
                //1.1. remove from selling queue;
                
                //1.2. push to history queue;

                //1.3. push to block queue;
            }
        }
    }
};