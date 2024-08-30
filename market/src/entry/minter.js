import { useEffect } from "react";

function Minter(props) {
    
    const size = {
        row: [12],
    };

    useEffect(() => {
    }, []);

    return (
        <iframe id="minter" title="iNFT minter" src="https://minter.inft.w3os.net/" frameBorder="0"></iframe>
    )
}

export default Minter;