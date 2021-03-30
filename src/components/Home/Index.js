import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(() => ({
    form: {
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    txt: { textAlign: "center" },
    continue: {
        marginTop: "20px",
        width: "20%",
    },
}));

function HomePage({ setTitle, userId }) {
    useEffect(() => {
        setTitle && setTitle("Home");
    });

    const classes = useStyles();

    return (
        <div className={classes.form}>
            <Typography className={classes.txt} variant="h1">
                Hallo!
            </Typography>
            <Link to="/kitchen/index">Your Kitchen</Link>
            <Button color="primary" variant="outlined">Does nothing</Button>
        </div>
    );
};

export { HomePage };