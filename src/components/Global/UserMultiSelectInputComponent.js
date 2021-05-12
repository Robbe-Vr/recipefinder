import React, { useState } from "react";

import { makeStyles } from "@material-ui/core";
import { Select, MenuItem, InputLabel } from "@material-ui/core";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    inputBox: {
        marginBottom: theme.spacing(3),
    },
}));

function UserMultiSelectInputComponent({ name, variant = "outlined", defaultValues = [], options, onChange }) {
    const [values, setValues] = useState(defaultValues);

    if ((!values || values.length < 1) && (defaultValues && defaultValues.length > 0)) {
        setValues(defaultValues);
    }
    
    const classes = useStyles();

    const overrideOnChange = (value) => {
        setValues(value);
        onChange(value);
    };

    return (
        <Grid
            container
            xs={6}
            justify="center"
            alignItems="center"
        >
            <Grid>
                <Select
                    multiple={true}
                    className={classes.inputBox}
                    variant={variant}
                    id={name}
                    label={name}
                    value={values}
                    onChange={(e) => {
                        overrideOnChange(e.target.value);
                    }}
                > 
                {
                    options.map(option =>
                        <MenuItem id={name + "-" + option.name} value={option.value} selected={defaultValues.indexOf(option.value) > -1}>{option.name}</MenuItem>
                    )
                }
                </Select>
            </Grid>
        </Grid>
    );
};

export { UserMultiSelectInputComponent };