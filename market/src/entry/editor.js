import { useEffect } from "react";

function Editor(props) {
    useEffect(() => {
    }, []);

    return (
        <iframe id="minter" title="iNFT minter" src="https://editor.inft.w3os.net" frameBorder="0"></iframe>
    )
}

export default Editor;