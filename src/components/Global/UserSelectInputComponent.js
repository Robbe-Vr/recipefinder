import React, { useState } from "react";

import { makeStyles } from "@material-ui/core";
import { Select, MenuItem, InputLabel } from "@material-ui/core";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    inputBox: {
        marginBottom: theme.spacing(3),
    },
}));

function UserSelectInputComponent({ name, label, variant = "outlined", defaultValue, options, onChange }) {
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
                <InputLabel id={name + "-label"}>{label}</InputLabel>
                <Select
                    variant={variant}
                    id={name}
                    labelId={name + "-label"}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    onKeyUp={(e) => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                > 
                {
                    options.map(option =>
                        <MenuItem value={option.value}>{option.name}</MenuItem>
                    )
                }
                </Select>
            </Grid>
        </div>
    );
};

export { UserSelectInputComponent };