import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";

import { UserInputComponent } from "../Global/UserInputComponent";
import { Ingredient, GroceryList } from "../../models";
import { Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { SelectIngredientComponent } from "../Global/SelectIngredientComponent";

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

export default function CreateGroceryListPage({ setTitle, Api }) {
    useEffect(() => {
        setTitle && setTitle("Create Grocery List");
    });

    const history = useHistory();

    const [list, setGroceryList] = useState(new GroceryList());

    const [ingredients, setIngredients] = useState([new Ingredient()]);

    useEffect(() => {
        Api.Ingredients.GetAll().then((ingredients) => {
            if (ingredients === "Error") { return; }
        
            setIngredients(ingredients);
        });
    }, [Api.Ingredients]);

    const classes = useStyles();

    const onRecipeEdited = (update) => {
        setGroceryList({
            ...list,
            ...update,
        });
    }

    const onEdit = () => {
        Api.GroceryLists.Create(list);

        history.push('/grocerylists/index');
    };

    const selectIngredient = (ingredient, index) => {
        
    };

    const [valuesEditorOpen, setValuesEditorOpen] = useState(false);

    return (
        <Grid className={classes.paper}>
            <Dialog open={valuesEditorOpen} onClose={() => setValuesEditorOpen(false)}>
                <DialogTitle>Grocery List Contents</DialogTitle>
                <DialogContent>
                    <SelectIngredientComponent
                        Api={Api}
                        ingredients={ingredients.filter(i => list.Value.split(' | ').filter(x => x.split(', ')[0] === i.Id).length === 0)}
                        selectIngredient={(ingredient) => { selectIngredient(ingredient); }}
                    />
                </DialogContent>
            </Dialog>
            <Typography className={classes.txt} variant="h2">
                Create Grocery List
            </Typography>
            <Grid style={{  borderBottom: 'solid 1px', marginBottom: '10px', padding: '5px' }}>
                <Grid className={classes.inputComponent}>
                    <UserInputComponent
                        name="Name"
                        onChange={(value) => onRecipeEdited({ Name: value })}
                    />
                </Grid>
                <Grid className={classes.inputComponent}>
                    <Button variant="outlined" onClick={() => setValuesEditorOpen(true)}>
                        {list.Value.split(' | ').length} Ingredients
                    </Button>
                </Grid>
                <Grid className={classes.inputComponent}>
                    <Button onClick={onEdit} style={{ backgroundColor: 'forestgreen' }}>Save</Button>
                </Grid>
            </Grid>
            <Link to="/grocerylists/index">
                <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} /> Back to Grocery Lists</Button>
            </Link>
        </Grid>
    );
};