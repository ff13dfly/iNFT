import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import Value from "./value";

import Data from "../lib/data";
import Render from "../lib/render";
import ETH from '../lib/eth';

import tools from "../lib/tools";
//context.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)

const cfg = {
    id: "NFT_canvas",
    //width: 400,
    //height: 400,
}

function Board(props) {
    const size = {
        row: [12],
        hash: [8, 4],
        rare: [8, 4],
        rate: [3, 9],
    };

    let [width, setWidth] = useState(400);
    let [height, setHeight] = useState(400);

    let [hash, setHash] = useState("0x0e70dc74951952060b5600949828445eb0acbc6d9b8dbcc396c853f8891c0486");
    let [highlight, setHighlight] = useState(true);
    let [series, setSeries] = useState([]);
    let [rate, setRate] = useState(0);
    let [win, setWin] = useState("");

    let [start, setStart] = useState(0);
    let [step, setStep] = useState(0);
    let [divide, setDivide] = useState(1);
    let [offset, setOffset] = useState(0);

    if (Data.get("hash") === null) {
        Data.set("hash", hash);
    }

    const self = {
        changeHash: (ev) => {
            setHash(ev.target.value);
            Data.set("hash", ev.target.value);
            props.fresh();
        },
        changeHighlight: (ev) => {
            setHighlight(!highlight);
            props.fresh();
        },
        clickFresh: () => {
            Data.set("hash", self.randomHash(64));
            props.fresh();
        },
        randomHash: (n) => {
            const str = "01234567890abcdef";
            let hex = "0x";
            for (let i = 0; i < n; i++) hex += str[tools.rand(0, str.length - 1)];
            return hex;
        },
        calcRarity: (puzzle, series) => {
            //console.log(puzzle,series);
            for (let i = 0; i < series.length; i++) {
                series[i].rate = 1;
                for (let j = 0; j < puzzle.length; j++) {
                    const part = puzzle[j];
                    const max = part.value[2];
                    const bingo = part.rarity[i];
                    //console.log(bingo);
                    series[i].rate = series[i].rate * (bingo.length / max);
                }
            }
            return series;
        },
        getTotalRate: (series) => {
            let rate = 0;
            for (let i = 0; i < series.length; i++) {
                rate += series[i].rate;
            }
            return rate;
        },
        calcResult: (hash, parts, s_amount) => {
            //console.log(hash,parts,series);
            let series = [];
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const [hash_start, hash_step, amount, offset] = part.value;
                const num = parseInt("0x" + hash.substring(hash_start + 2, hash_start + 2 + hash_step));
                const index = (num + offset) % amount;
                if (part.rarity === undefined) continue;

                const rlist = part.rarity;
                const in_asset = [];
                for (let j = 0; j < rlist.length; j++) {
                    const asset = rlist[j];
                    if (asset.includes(index)) {
                        in_asset.push(j);
                    }
                }
                series.push(in_asset);
            }
            //console.log(series);

            const index = [];
            for (let i = 0; i < s_amount; i++) {
                let not = false;           //i系列是否被包括了
                for (let j = 0; j < parts.length; j++) {
                    const arr = series[j];
                    if (!arr.includes(i)) not = true;
                }

                if (!not) index.push(i);
            }

            if (index.length === 0) return false;
            //console.log(series);
            return index;
        },
        decode: (hash, pen, img, parts, tpl, active) => {
            const { cell, grid } = tpl;
            const multi = 1;
            let cache = null;
            for (let i = 0; i < parts.length; i++) {
                //获取不同的图像
                const part = parts[i];
                const [hash_start, hash_step, amount, offset] = part.value;
                const [gX, gY, eX, eY] = part.img;
                const [px, py] = part.position;
                const [zx, zy] = part.center;

                const num = parseInt("0x" + hash.substring(hash_start + 2, hash_start + 2 + hash_step));
                const index = (num + offset) % amount;     //图像的位次
                const max = Math.floor(grid[0] / (1 + eX)); //处理无法整除的情况
                const br = Math.floor((index + gX) / max);

                const cx = cell[0] * (eX + 1) * ((index + gX) % max);
                const cy = cell[1] * gY + br * cell[1] * (1 + eY);
                const dx = cell[0] * (eX + 1);
                const dy = cell[1] * (eY + 1);
                const vx = px - zx * cell[0] * (1 + eX);
                const vy = py - zy * cell[1] * (1 + eY);
                pen.drawImage(img, cx * multi, cy * multi, dx * multi, dy * multi, vx, vy, dx, dy);

                if (active === i) {
                    cache = [dx, dy, vx, vy, "#FF0000", 2];
                }
            }

            if (cache !== null) {
                const [dx, dy, vx, vy, color, pw] = cache
                Render.active(pen, dx, dy, vx, vy, color, pw);
            }
        },
        autofresh: (hash) => {
            
            const pen = Render.create(cfg.id);
            const bs64 = Data.get("template");
            const def = Data.get("NFT");
            
            if(def===null) return false;

            const ss = Data.get("size");
            const selected = Data.get("selected");

            //console.log(hash,def,selected);

            if (selected !== null) {
                const part = def.puzzle[selected];
                const [p_start, p_step, p_divide, p_offset] = part.value;
                setStart(p_start);
                setStep(p_step);
                setDivide(p_divide);
                setOffset(p_offset);
            }

            if (bs64 === null || def === null) {
                Render.fill(pen);
                return false;
            }


            const img = new Image();
            img.src = bs64;
            img.onload = (e) => {
                Render.clear(cfg.id);
                const active = Data.get("selected");
                self.decode(hash, pen, img, def.puzzle, ss, highlight ? active : undefined);

                const rlist = self.calcRarity(def.puzzle, def.series);
                setSeries(rlist);
                setRate(tools.toF(100 * self.getTotalRate(rlist), 5));

                const sindex = self.calcResult(hash, def.puzzle, def.series.length);
                if (sindex !== false) {
                    let min = undefined;
                    for (let i = 0; i < sindex.length; i++) {
                        const tindex = sindex[i];
                        const rare = rlist[tindex].rate;
                        if (min === undefined) min = rare;
                        if (rare < min) min = rare
                    }
                    setWin(`Series ${JSON.stringify(sindex)}, rate: ${tools.toF(100 * min, 8)} %`)
                } else {
                    setWin("")
                }
            }

        },
    }

    useEffect(() => {
        setHash(Data.get("hash"));
        const { target } = Data.get("size");
        setWidth(target[0]);
        setHeight(target[1]);

        setTimeout(()=>{
            self.autofresh(Data.get("hash"));
        },50);
    }, [props.update]);

    return (
        <Row className="pt-2">
            <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                <h5>iNFT Preview</h5>
            </Col>
            <Col className="pt-2" lg={size.hash[0]} xl={size.hash[0]} xxl={size.hash[0]} >
                <small>{hash.length - 2} bytes hexadecimal mock hash.</small>
                <Value start={start} step={step} divide={divide} offset={offset} hash={hash} />
            </Col>
            <Col className="pt-2" lg={size.hash[1]} xl={size.hash[1]} xxl={size.hash[1]} >
                <Row>
                    <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                        <Form>
                            {/* <Form.Check type="checkbox" label={`Enable hash check.`} /> */}
                            <Form.Check type="checkbox" label={`Enable highlight.`} checked={highlight} onChange={(ev) => {
                                self.changeHighlight(ev);
                            }} />
                        </Form>
                    </Col>
                    <Col className="text-end pt-2" lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                        <button className="btn btn-sm btn-warning" onClick={(ev) => {
                            self.clickFresh();
                        }}>Fresh</button>
                    </Col>
                </Row>
            </Col>
            <Col className="text-center pt-4" lg={size.rare[0]} xl={size.rare[0]} xxl={size.rare[0]} >
                <canvas width={width} height={height} id={cfg.id}></canvas>
            </Col>
            <Col className="pt-2" lg={size.rare[1]} xl={size.rare[1]} xxl={size.rare[1]} >
                <Row className="pb-2">
                    <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                        Total Rarity: {rate}%
                    </Col>
                </Row>
                {series.map((row, index) => (
                    <Row key={index}>
                        <Col lg={size.rate[0]} xl={size.rate[0]} xxl={size.rate[0]}>
                            #{index}
                        </Col>
                        <Col lg={size.rate[1]} xl={size.rate[1]} xxl={size.rate[1]}>
                            {tools.toF(row.rate * 100, 7)}%
                        </Col>
                    </Row>
                ))}
                <Row className="pt-4">
                    <Col lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]} >
                        Mint Result:<br /> {win}
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Board;