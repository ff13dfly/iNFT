import BoardOverall from "../component/home/board_overall";
import Slide from "../component/home/slide";
import SectionLatest from "../component/home/section_latest";
import BannerMint from "../component/home/banner_mint";
import SectionSelling from "../component/home/section_selling";
import BannerSelling from "../component/home/banner_selling";
import SectionTemplate from "../component/home/section_template";
import BannerTemplate from "../component/home/banner_template";
import Footer from "../component/common/common_footer"

function Home(props) {
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