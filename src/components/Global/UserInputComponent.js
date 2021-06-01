import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField } from "@material-ui/core";

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
            var correction = parseInt((parseFloat(value) + 0.50).toString()).toString();
            if (correction === 0) {
                correction = 1;
            }

            setValue(correction);
            onChange(correction);
        }
    }

    return (
        <Grid>
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
    );
};

export { UserInputComponent };