import React, { useState } from "react";

import { InputLabel, makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    inputBox: {
        
    },
}));

function UserInputComponent({ name, variant = "outlined", type = 'text', inputProps, defaultValue, onChange, isAsync = false }) {
    const [value, setValue] = useState(defaultValue);

    if (!value && defaultValue) {
        setValue(defaultValue);
    }
    
    const classes = useStyles();

    if (type === 'number') {
        if (inputProps.step && inputProps.step === 1.00 && value % 1 !== 0) {
            const correction = parseInt((parseFloat(value) + 0.50).toString()).toString();
            setValue(correction);
            onChange(correction);
        }
    }

    return (
        <Grid
            container
            xs={6}
            direction="row"
            justify="center"
            alignItems="center"
        >
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <TextField
                    className={classes.inputBox}
                    variant={variant}
                    id={name}
                    label={name}
                    value={value}
                    type={type}
                    inputProps={inputProps}
                    onChange={isAsync ? async (e) => {
                        setValue(e.target.value);
                        await onChange(e.target.value);
                    } : (e) => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                />
            </Grid>
        </Grid>
    );
};

export { UserInputComponent };