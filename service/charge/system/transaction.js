/* Charge the target Anchor Network account, record the charge on chain
 *  auth: Fuu
 *  date: 2024-10-3
 */

const { REDIS } = require("../lib/redis.js");
const IO = require("../lib/file.js");
const tools = require("../lib/tools.js");

const AnchorJS = require("../network/anchor.js");

const status = {
    payment: {
        ANK_PAYMENT_DONE: 1,             //$ANK payed
        WAITING_FOR_PAYMENT: 2,          //
        CHECK_FAILED: 44,
    },
    salt: {
        PENDING: 6,
        CHECKED: 1,
    },
};

const range=100000;     //0.1 $ANK range 
let config=null;
const self = {
    set:(setting)=>{
        config=setting;
    },
    sender:(amount,ck,index)=>{
        //console.log(`Here to pick up the account.Amount: ${amount}`);
        if(index===undefined) index=0;
        const accs=config.accounts.list;
        if(!accs[index]) return ck && ck({error:"Unknown charge account."});

        const [address,pass]=accs[index];
        
        index++;
        //1.check balanc to confirm the payment.
        AnchorJS.balance(address,(dt)=>{
            if(!dt) return self.sender(amount,ck,index);

            console.log(`Checking ${address}, amount: ${dt.free}, need ${amount}.`);
            if(dt.free < amount + range ){
                return self.sender(amount,ck,index);
            }

            //2.get the signature.
            const path=`./${config.accounts.folder}/${address}.json`;
            IO.read(path,(fa)=>{
                if(!fa) return ck && ck({error:"Failed to load charge account."});
                if(fa.error) return ck && ck(fa);
                AnchorJS.load(JSON.stringify(fa),pass,(pair)=>{
                    if(!pair) return ck && ck({error:"Failed to decode charge account."});
                    return ck && ck(pair);
                });
            },true);
        });
    },

    onchain:(raw,ck)=>{
        const signer=config.record.account;
        const pass=config.record.password;
        const path=`./${config.record.folder}/${signer}.json`;
        IO.read(path,(fa)=>{
            if(!fa) return ck && ck({error:"Failed to load record account."});
            if(fa.error) return ck && ck(fa);

            AnchorJS.load(JSON.stringify(fa),pass,(pair)=>{
                if(!pair) return ck && ck({error:"Failed to decode charge account."});
                
                //AnchorJS.write();
                //console.log(pair.address);

                const name=config.record.anchor;
                
                AnchorJS.view(name,"owner",(dt)=>{
                    console.log(dt);
                    const pre=dt===false?0:dt.block;
                    const obj={
                        anchor:name,
                        raw:raw,
                        protocol:{"fmt":"json","type":"data"},
                        pre:pre,
                    }

                    AnchorJS.write(pair,obj,(progress)=>{
                        console.log(progress);
                        if(progress.status==="Finalized"){
                            AnchorJS.view(name,"owner",(now)=>{
                                console.log(now);
                                const alink=`anchor://${name}/${now.block}`;
                                //console.log(alink);
                                return ck && ck(alink);
                            });
                        }
                        
                    });

                   
                });
            });
        },true);
    },

    record:(hash,amount,target,from,more,ck)=>{
        const prefix = config.keys.prefix_charge;
        const record = {
            charge: amount,
            target:target,
            block: hash,
            from:from,
            token: {
                network:more.network,
                amount:more.amount,
                token:more.token,
            },
            status: status.payment.WAITING_FOR_PAYMENT,
        }
        const key=`${prefix}${hash}`;
        REDIS.setKey(key, JSON.stringify(record), (tag) => {
            if (!tag) return ck && ck({ error: "Failed to record payment on local." });

            return ck && ck(key);
        });
    },
    update:(key,alink,ck)=>{
        REDIS.getKey(key,(str)=>{
            if(!str) return ck && ck({error:`No data of ${key}`});
            console.log(str);
            try {
                const data=JSON.parse(str);
                data.alink=alink;
                data.status=status.payment.ANK_PAYMENT_DONE;
                REDIS.setKey(key, JSON.stringify(data), (tag) => {
                    if (!tag) return ck && ck({ error: "Failed to update payment status on local." });
                    return ck && ck(true);
                });

            } catch (error) {
                return ck && ck({error:`Invalid data format of ${key}`})
            }
        });
    },
    exsist:(hash,ck)=>{
        if (hash.length !== 66) return ck && ck({ error: "Invalid transaction hash." });
        const prefix = config.keys.prefix_record;
        const key = `${prefix}${hash}`;
        REDIS.exsistKey(key, (here) => {
            if (here) return ck && ck({ error: "Dumplicate request." });
            return ck && ck(false);
        });
    },
    run:(target,amount,ck,more)=>{
        console.log(more,amount,target);

        //FIXME, here to adjust the calculation by Bigint
        const val=parseInt(amount)/(parseInt(more.accuracy)*more.rate)
        const related_amount=parseInt(val*AnchorJS.accuracy());
        //1.get the senter account and pair
        self.sender(related_amount,(pair)=>{
            if(pair.error) return ck && ck(pair);

            //2.do transfer
            //2.1. pay the amount to target.
            //console.log(`Ready to pay ${amount} to ${target}`);
            AnchorJS.transfer(pair,target,related_amount,(process)=>{
                console.log(process);
                //2.2. destory the signature.
                if(process.finalized){
                    //3. record the transaction local. 
                    //3.1. confirm the transaction success.
                    //TODO, here to check and confirm the transaction
                    const transaction_hash=process.finalized;
                    self.record(transaction_hash,related_amount,target,pair.address,more,(record)=>{
                        if(record.error) return ck && ck({error:`Failed to local record, hash: ${transaction_hash}`});
                        
                        //3.record the charge on chain.
                        const raw={
                            block:transaction_hash,
                            from:pair.address,
                            to:target,
                            amount:related_amount,
                        }
                        self.onchain(raw,(alink)=>{
                            if(alink.error) return ck && ck(alink);

                            //4.update local redis record
                            self.update(record,alink,(updated)=>{
                                if(updated.error) return ck && ck(updated);

                                const result={
                                    block:transaction_hash,
                                    amount:related_amount,
                                    alink:alink,
                                    stamp:tools.stamp(),
                                }
                                return ck && ck(result);
                            });
                        });
                    });
                };
            });
        });
    },
};

module.exports = self;