import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Select, MenuItem, InputLabel } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    inputBox: {
        
    },
}));

function UserMultiSelectInputComponent({ name, variant = "outlined", defaultValues = [], options, onChange, isError = false }) {
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
        <Grid style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
            <InputLabel id={name}/>
            <Select
                style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', color: isError ? 'red' : '' }}
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
                    <MenuItem key={name + "-" + option.name} id={name + "-" + option.name} value={option.value} selected={values.indexOf(option.value) > -1}>{option.name}</MenuItem>
                )
            }
            </Select>
        </Grid>
    );
};

export { UserMultiSelectInputComponent };