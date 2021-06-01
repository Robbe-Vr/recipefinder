import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Select, MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    inputBox: {
        
    },
}));

function UserSelectInputComponent({ name, variant = "outlined", defaultValue = '', options, onChange }) {
    const [value, setValue] = useState(defaultValue);

    if (!value && defaultValue) {
        setValue(defaultValue);
    }
    
    const classes = useStyles();

    return (
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
    );
};

export { UserSelectInputComponent };