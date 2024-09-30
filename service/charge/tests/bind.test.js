//https://jestjs.io/docs/using-matchers

let getHash = new Promise(function(resolve, reject) {
    const cfg=require("../config.json");
    const url=`http://localhost:${cfg.server.port}/bind`;

    fetch(url).then((res)=>{
      if(res.status!==200) return reject({error:"Server response invalid."});
      const json = res.json();
      resolve(json); // when successful
    }).catch((error)=>{
      reject(error);  // when error
      console.log(error);
    });
  });
  
  // "Consuming Code" (Must wait for a fulfilled Promise)
  // myPromise.then(
  //   function(value) { /* code if successful */ },
  //   function(error) { /* code if some error */ }
  // );

test('Account Bind Test', () => {
  //console.log("Can I ?");
  return getHash.then(data => {
    console.log(data);
    //expect(data).toBe('peanut butter');
  });
});