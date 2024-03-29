import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";

import { UserInputComponent } from "../Global/UserInputComponent";
import { GroceryList } from "../../models";
import { Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { GroceryListIngredientInputComponent } from "./GroceryListIngredientInputComponent";
import { useNotifications } from "../Global/NotificationContext";

const useStyles = makeStyles((theme) => ({
    paper: {
        width: "100%",
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
    },
    txt: { textAlign: "center" },
    errorTxt: { textAlign: "center", color: "#ff0000" },
    form: {

    },
    inputComponent: {
        marginBottom: '15px',
    }
}));

export default function CreateGroceryListPage({ setTitle, Api, userId }) {
    useEffect(() => {
        setTitle && setTitle("Create Grocery List");
    });

    const { error, success } = useNotifications();

    const history = useHistory();

    const [list, setGroceryList] = useState(new GroceryList());

    const classes = useStyles();

    const onRecipeEdited = (update) => {
        setGroceryList({
            ...list,
            ...update,
            UserId: userId,
        });
    }

    const [errors, setErrors] = useState([]);

    const onCreate = () => {
        var validation = list.Validate();

        if (Array.isArray(validation)) {
            validation.forEach((validationError) => {
                error(validationError.message);
            });

            setErrors(validation);

            return;
        }

        Api.GroceryLists.Create(list).then((res) => {
            if (typeof res === "string") {
                error(res);
            } else if (typeof res.data === "string") {
                error(res.data);
            } else if (typeof res.data?.Message === "string") {
                error(res.data.Message);
            } else {
                
                success("Grocery list created succesfully!");

                history.push('/grocerylists/index');
            }
        });
    };

    const onIngredientSelected = (ingredients) => {
        const value = ingredients.map(i => `${i.IngredientId}, ${i.Units}, ${i.UnitTypeId}`).join(' | ');

        setGroceryList({ ...list, Value: value });
    };

    const [valuesEditorOpen, setValuesEditorOpen] = useState(false);

    return (
        <Grid className={classes.paper}>
            <Dialog open={valuesEditorOpen} onClose={() => setValuesEditorOpen(false)}>
                <DialogTitle>Grocery List Contents</DialogTitle>
                <DialogContent>
                    <GroceryListIngredientInputComponent
                        Api={Api}
                        defaultValues={[]}
                        onChange={onIngredientSelected}
                    />
                </DialogContent>
            </Dialog>
            <Typography className={classes.txt} variant="h2">
                Create Grocery List
            </Typography>
            <Grid style={{  borderBottom: 'solid 1px', marginBottom: '10px', padding: '5px' }}>
                <Grid className={classes.inputComponent}>
                    <UserInputComponent
                        isError={errors.filter(x => x.prop === "Name").length > 0}
                        name="Name"
                        onChange={(value) => onRecipeEdited({ Name: value })}
                    />
                </Grid>
                <Grid className={classes.inputComponent}>
                    <Button variant="outlined" style={{ color: errors.filter(x => x.prop === "Name").length > 0 ? 'red': '' }} onClick={() => setValuesEditorOpen(true)}>
                        {list.Value.split(' | ').length} Ingredients
                    </Button>
                </Grid>
                <Grid className={classes.inputComponent}>
                    <Button onClick={onCreate} style={{ backgroundColor: 'forestgreen' }}>Save</Button>
                </Grid>
            </Grid>
            <Link to="/grocerylists/index">
                <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} /> Back to Grocery Lists</Button>
            </Link>
        </Grid>
    );
};