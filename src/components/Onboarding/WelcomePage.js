import React from "react";
import { Link } from "react-router-dom";

import { makeStyles } from  "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";

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

function WelcomePage() {
    const classes = useStyles();

    return (
        <div className={classes.form}>
            <Typography className={classes.txt} variant="h1">
                Welkom!
            </Typography>
            <Typography className={classes.txt} variant="subtitle1">
                to Recipe Finder!
            </Typography>
            <Button
                className={classes.continue}
                variant="outlined"
                color="primary"
                component={Link}
                to={"/signin/register"}
            >
                Register
            </Button>
            <Typography className={classes.txt}>
                Or if you already have an account <Link to="/signin/login">Log in here</Link>
            </Typography>
        </div>
    );
};

export { WelcomePage }