//https://blockchain.info

// fetch("https://blockchain.info/latestblock")
//     .then(response => response.json())
//     .then(data => {
//         const latestBlockHash = data.hash;
//         console.log("Latest block hash:", latestBlockHash);
//     })
//     .catch(error => console.error("Error fetching latest block hash:", error));

    // fetch("https://www.blockchain.com/explorer/blocks/btc/23456")
    // .then(response => response.json())
    // .then(data => {
    //     const latestBlockHash = data.hash;
    //     console.log("Latest block hash:", latestBlockHash);
    // })
    // .catch(error => console.error("Error fetching latest block hash:", error));


    //https://bafkreihze725zh5uqcffao5w27qdmaihjffjzj3wvtdfjocc33ajqtzc7a.ipfs.w3s.link/

    fetch("https://bafkreihze725zh5uqcffao5w27qdmaihjffjzj3wvtdfjocc33ajqtzc7a.ipfs.w3s.link")
    .then((res)=>{
        console.log(res);
    })
    .catch(error => console.error("Error fetching latest block hash:", error));