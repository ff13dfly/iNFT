import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

//block hash interval

function Counter(props) {
    const size = {
        row: [12],
    };

    const self={

    }

    useEffect(() => {

    }, [props.update]);

    return (
        <div className="countdown pt-2">
            <div className="timer"></div>
        </div>
    )
}

export default Counter;