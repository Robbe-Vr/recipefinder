import React, { useState } from "react";

import { makeStyles } from "@material-ui/core";
import { Select, MenuItem, InputLabel } from "@material-ui/core";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    inputBox: {
        marginBottom: theme.spacing(3),
    },
}));

function UserSelectInputComponent({ name, label, variant = "outlined", defaultValue = '', options, onChange }) {
    const [value, setValue] = useState(defaultValue);

    if (!value && defaultValue) {
        setValue(defaultValue);
    }
    
    const classes = useStyles();

    return (
        <Grid
            container
            xs={6}
            justify="center"
            alignItems="center"
        >
            <Grid>
                <InputLabel id={name}>{name}: </InputLabel>
            </Grid>
            <Grid>
                <InputLabel id={name + "-label"}>{label}</InputLabel>
                <Select
                    className={classes.inputBox}
                    variant={variant}
                    id={name}
                    label={name + "-label"}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                > 
                {
                    options.map(option =>
                        <MenuItem key={option.id ?? options.name + '-' + option.value} value={option.value} selected={option.value === defaultValue}>{option.name}</MenuItem>
                    )
                }
                </Select>
            </Grid>
        </Grid>
    );
};

export { UserSelectInputComponent };