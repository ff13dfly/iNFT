import { Container,Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Header from "../components/header";
import Board from "../components/board";
import Slide from "../components/slide";
import Latest from "../components/latest";
import BannerMint from "../components/banner_mint";
import Selling from "../components/selling";
import BannerSelling from "../components/banner_selling";
import Template from "../components/template";
import BannerTemplate from "../components/banner_template";

import Footer from "../components/footer"

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
            <Header />
            <Board />
            <Slide />
            <Latest />
            <BannerMint />
            <Selling />
            <BannerSelling />
            <Template />
            <BannerTemplate />
            <Footer />
        </div>
    )
}

export default Home;