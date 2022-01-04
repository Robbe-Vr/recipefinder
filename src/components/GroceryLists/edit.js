import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button, Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faSave } from "@fortawesome/free-solid-svg-icons";

import { UserInputComponent } from "../Global/UserInputComponent";
import { GroceryListIngredientInputComponent } from "./GroceryListIngredientInputComponent";

import { GroceryList } from "../../models";
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

export default function EditGroceryListPage({ setTitle, Api }) {
    const { error, success } =  useNotifications();

    useEffect(() => {
        setTitle && setTitle("Edit Grocery List");
    });

    const history = useHistory();

    const { id } = useParams();

    const [list, setGroceryList] = useState(new GroceryList());

    useEffect(() => {
        Api.GroceryLists.GetById(id).then((list) => {
            if (typeof list === "string") {
                error(list);
                return;
            }
        
            setGroceryList(list);
        });
    }, [Api.GroceryLists, id, error]);

    const classes = useStyles();

    const onRecipeEdited = (update) => {
        setGroceryList({
            ...list,
            ...update,
        });
    }

    const [errors, setErrors] = useState([]);
    useEffect(() => {
        for (var errorMsg in errors) {
            error(errorMsg);
        }
    }, [errors, error]);

    const onEdit = () => {
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
                
                success("Grocery lists edited successfully!");

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
                        defaultValues={list.Value.split(' | ').map(str => {
                            const splitStr = str.split(', ');

                            return {
                                IngredientId: splitStr[0],
                                Units: splitStr[1],
                                UnitTypeId: splitStr[2],
                            };
                        })}
                        onChange={onIngredientSelected}
                    />
                </DialogContent>
            </Dialog>
            <Typography className={classes.txt} variant="h2">
                Edit Grocery List:<br />
                {list.Name}
            </Typography>
            <Grid style={{  borderBottom: 'solid 1px', marginBottom: '10px', padding: '5px', width: '80%' }}>
                <Grid className={classes.inputComponent}>
                    <UserInputComponent
                        name="Name"
                        defaultValue={list.Name}
                        onChange={(value) => onRecipeEdited({ Name: value })}
                    />
                </Grid>
                <Grid className={classes.inputComponent}>
                    <Button variant="outlined" onClick={() => setValuesEditorOpen(true)} style={{ width: '100%' }}>
                        {list.Value.split(' | ').length} Ingredients
                    </Button>
                </Grid>
                <Grid className={classes.inputComponent} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="outlined" onClick={onEdit} style={{ color: 'forestgreen', borderColor: 'forestgreen' }}><FontAwesomeIcon icon={faSave} style={{ marginRight: '5px' }} />Save</Button>
                </Grid>
            </Grid>
            <Link to="/grocerylists/index" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" style={{ color: 'forestgreen', borderColor: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} />Back to Grocery Lists</Button>
            </Link>
        </Grid>
    );
};