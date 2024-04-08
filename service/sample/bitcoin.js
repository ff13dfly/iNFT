//https://blockchain.info

fetch('https://blockchain.info/latestblock')
    .then(response => response.json())
    .then(data => {
        const latestBlockHash = data.hash;
        console.log('Latest block hash:', latestBlockHash);
    })
    .catch(error => console.error('Error fetching latest block hash:', error));

    // fetch('https://www.blockchain.com/explorer/blocks/btc/23456')
    // .then(response => response.json())
    // .then(data => {
    //     const latestBlockHash = data.hash;
    //     console.log('Latest block hash:', latestBlockHash);
    // })
    // .catch(error => console.error('Error fetching latest block hash:', error));