import React from "react";

import { makeStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    inputBox: {
        marginBottom: theme.spacing(3),
    },
}));

function Thumbnail({ source, size = "256px" }) {
    const classes = useStyles();

    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.inputBox}
        >
            <img
                alt=""
                src={source}
                width={size}
                height={size}
            />
        </Grid>
    );
};

export { Thumbnail };