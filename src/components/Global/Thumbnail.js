import React from "react";

import { makeStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    inputBox: {
        marginBottom: theme.spacing(3),
    },
}));

function Thumbnail({ source, size = 256 }) {
    const classes = useStyles();

    return (
        <Grid
            style={{ border: 'solid 1px', width: ((size + 2) + "px").toString(), maxWidth: ((size + 2) + "px").toString(), height: ((size + 2) + "px").toString(), maxHeight: ((size + 2) + "px").toString() }}
            className={classes.inputBox}
        >
            <img
                alt=""
                src={source}
                width={(size + "px").toString()}
                height={(size + "px").toString()}
            />
        </Grid>
    );
};

export { Thumbnail };