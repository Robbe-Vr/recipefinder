import React, { useState } from "react";

import { makeStyles } from "@material-ui/core";
import { Select, MenuItem, InputLabel } from "@material-ui/core";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    inputBox: {
        marginBottom: theme.spacing(3),
    },
}));

function UserSelectInputComponent({ name, variant = "outlined", defaultValue = '', options, onChange }) {
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
                <Select
                    className={classes.inputBox}
                    variant={variant}
                    id={name}
                    label={name}
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