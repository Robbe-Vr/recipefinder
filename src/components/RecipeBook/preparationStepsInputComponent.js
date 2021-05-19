import React, { useState } from "react";

import { Button, makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    inputBox: {
        
    },
}));

function PreparationStepsInputComponent({ name, defaultValue = '', onChange }) {
    const [value, setValue] = useState(defaultValue);

    if (!value && defaultValue) {
        setValue(defaultValue);
    }
    
    const classes = useStyles();

    const updateValue = (newValue, index) => {
        var updatedValue = value.split('{NEXT}')
            .map((step, i) => {
                if (i === index) {
                    return newValue;
                }
                else {
                    return step;
                }
            })
            .join('{NEXT}');

        setValue(updatedValue);
        onChange(updatedValue);
    };

    const addStep = (newStepIndex) => {
        const steps = value.split('{NEXT}');

        var updatedValue;

        if (newStepIndex === steps.length) {
            updatedValue = value + "{NEXT}Next step";
        }
        else {
            updatedValue = steps
                .map((step, i) => {
                    if (i === newStepIndex) {
                        return "Next step{NEXT}" + step;
                    }
                    else {
                        return step;
                    }
                })
                .join('{NEXT}');
        }

        setValue(updatedValue);
        onChange(updatedValue);
    };

    const removeStep = (index) => {
        var stepValue = value.split('{NEXT}')[index];

        if (stepValue) {
            if ((value.split(stepValue).length - 1) === 1) {
                var updatedValue = value.replace(stepValue, '').replace('{NEXT}{NEXT}', '{NEXT}');

                if (updatedValue.endsWith('{NEXT}')) {
                    updatedValue = updatedValue.substring(0, updatedValue.length - ("{NEXT}".length));
                }

                setValue(updatedValue);
                onChange(updatedValue);
            } else {

            }
        }
    };

    return (
        <Grid>
            <Grid container direction="row" style={{ marginBottom: '20px' }}>
                <Button variant="outlined" style={{ color: 'forestgreen' }}
                    onClick={() => { addStep(0); }}>Add Step here</Button>
            </Grid>
            {
                value.split('{NEXT}').map((step, index) => {
                    return (
                        <Grid container direction="row"  style={{ marginBottom: '15px', borderTop: 'solid 1px' }}>
                            <Grid container direction="row" style={{ marginBottom: '15px' }}>
                                Step {index + 1}:
                            </Grid>
                            <Grid container direction="row" style={{ marginBottom: '15px', paddingTop: '10px', paddingBottom: '10px', borderBottom: 'solid 1px' }}>
                                <TextField
                                    className={classes.inputBox}
                                    variant="outlined"
                                    id={name + "-" + index}
                                    label={name + " " + (index + 1)}
                                    value={step}
                                    type="text"
                                    onChange={(e) => {
                                        updateValue(e.target.value, index);
                                    }}
                                />
                                <Button variant="outlined" style={{ color: 'red', marginLeft: '10px' }}
                                    onClick={() => { removeStep(index); }}>Remove Step</Button>
                            </Grid>
                            <Grid container direction="row" style={{ marginBottom: '20px' }}>
                                <Button variant="outlined" style={{ color: 'forestgreen' }}
                                    onClick={() => { addStep(index + 1); }}>Add Step here</Button>
                            </Grid>
                        </Grid>
                    )
                })
            }
        </Grid>
    );
};

export { PreparationStepsInputComponent };