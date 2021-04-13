import React, { useState } from "react";

import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    inputBox: {
        marginBottom: theme.spacing(3),
    },
}));

function UserInputComponent({ name, label, variant = "outlined", type = 'text', defaultValue, onChange }) {
    const [value, setValue] = useState(defaultValue);
    
    const classes = useStyles();

    return (
        <div class="row">
            <Grid 
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <label htmlFor={name}>{name}: </label>
            </Grid>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                className={classes.inputBox}
            >
                <TextField
                    variant={variant}
                    id={name}
                    label={label}
                    value={value}
                    type={type}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    onKeyUp={(e) => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                />
            </Grid>
        </div>
    );
};

export { UserInputComponent };