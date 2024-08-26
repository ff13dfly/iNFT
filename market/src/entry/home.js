import { useEffect } from "react";

import BoardOverall from "../component/home/board_overall";
import Slide from "../component/slide";
import SectionLatest from "../component/section_latest";
import BannerMint from "../component/home/banner_mint";
import SectionSelling from "../component/section_selling";
import BannerSelling from "../component/home/banner_selling";
import SectionTemplate from "../component/section_template";
import BannerTemplate from "../component/home/banner_template";
import Footer from "../component/common/common_footer"

function Home(props) {
    const size = {
        row: [12],
        flow:[3,6,3]
    };

    const self={

    }

    useEffect(() => {
        
    }, [props.update]);

    return (
        <div>
            <BoardOverall />
            <Slide />
            <SectionLatest />
            <BannerMint />
            <SectionSelling />
            <BannerSelling />
            <SectionTemplate />
            <BannerTemplate />
            <Footer />
        </div>
    )
}

export default Home;