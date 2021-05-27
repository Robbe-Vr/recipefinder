import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Grid, makeStyles, Typography } from "@material-ui/core";
import { Thumbnail } from "../Global/Thumbnail";
import Button from "@material-ui/core/Button";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserSelectInputComponent } from "../Global/UserSelectInputComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBackward, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Ingredient } from "../../models";
import { SelectIngredientComponent } from "../Global/SelectIngredientComponent";

const useStyles = makeStyles((theme) => ({
    ingredientSelectContainer: {

    },
    ingredientSelectedContainer: {

    }
}));

function AddIngredients({ setTitle, userId, Api }) {
    useEffect(() => {
        setTitle && setTitle("Add Ingredients");
    });

    const classes = useStyles();

    const [unitTypeChanges, setUnitTypeChanges] = useState(0);
    const [selectedIngredient, setSelectedIngredient] = useState({});
    const [saveIngredient, setSaveIngredient] = useState({
        UserId: userId,
        IngredientId: '',
        Units: 0.0,
        UnitTypeId: 1,
    });

    const [ingredients, setIngredients] = useState([new Ingredient()]);
    if (ingredients.length === 1 && ingredients[0].CountId === -1 && unitTypeChanges)
    {
        ingredients?.pop();
    }

    useEffect(() => {
        Api.Ingredients.GetAll().then((ingredients) => {
            if (ingredients === "Error") { return; }
        
            setIngredients(ingredients);
        });
    }, [Api.Ingredients]);

    const selectIngredient = (ingredient) => {
        setSelectedIngredient(ingredient);

        saveIngredient.IngredientId = ingredient.Id;
        saveIngredient.UnitTypeId = ingredient.UnitTypes[0].CountId;
        saveIngredient.Units = 1.00;
        setSaveIngredient(saveIngredient);
    };

    const SaveIngredient = () => {
        if (saveIngredient.IngredientId && saveIngredient.UserId &&
            saveIngredient.Units && saveIngredient.UnitTypeId) {
            
            Api.Kitchens.Create(saveIngredient);
        }
    };

    const allowDecimals = ingredients.find(x => x.Id === selectedIngredient.Id)?.UnitTypes.find(x => x.CountId === saveIngredient.UnitTypeId)?.AllowDecimals;

    return (
        <Grid
            container
            direction="row"
        >
            <Grid container style={{ width: '100%', marginBottom: '10px', padding: '5px' }}>
                <Grid
                    container
                    item
                    direction="column"
                    className={classes.ingredientSelectedContainer}
                    style={{ display: 'inline-block', verticalAlign: 'top', width: '50%', height: window.innerHeight * 0.8 }}
                    xs={6}
                >
                    {selectedIngredient && selectedIngredient.Id ?
                        <>
                            <Grid container direction="row" style={{ marginTop: '10%' }}>
                                <Grid container direction="row">
                                    <Grid>
                                        <Thumbnail source={selectedIngredient.ImageLocation} size={50} />
                                    </Grid>
                                    <Grid style={{ marginLeft: '5px' }}>
                                        <Typography variant="h5">{selectedIngredient.Name}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row">
                                    <Grid>
                                        <UserInputComponent type="number" name="Amount" defaultValue={1.0} inputProps={{ min: allowDecimals ? 0.01 : 1.00, max: 1000.00, step: allowDecimals ? 0.01 : 1.00 }}
                                            onChange={(value) => { saveIngredient.Units = parseFloat(value); setSaveIngredient(saveIngredient); }} />
                                    </Grid>
                                    <Grid style={{ marginLeft: '5px' }}>
                                        <UserSelectInputComponent name="Unit Type" options={selectedIngredient.UnitTypes.map(unitType => { return { value: unitType.CountId, name: unitType.Name }; })}
                                            onChange={(value) => { saveIngredient.UnitTypeId = parseInt(value); setSaveIngredient(saveIngredient); setUnitTypeChanges(unitTypeChanges => unitTypeChanges + 1); }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Button onClick={SaveIngredient} variant="outlined" style={{ marginTop: "20px", color: 'green' }}><FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} /> Add Ingredient</Button>
                        </>
                        :
                        <Typography variant="h5">Select an ingredient on the right. <FontAwesomeIcon icon={faArrowRight}/></Typography>
                    }
                </Grid>
                <Grid
                    container
                    item
                    direction="column"
                    className={classes.ingredientSelectContainer}
                    style={{ borderLeft: "solid 1px", display: 'inline-block', height: window.innerHeight * 0.8 }}
                    xs={6}
                >
                    <SelectIngredientComponent
                        Api={Api}
                        ingredients={ingredients}
                        selectIngredient={selectIngredient}
                    />
                </Grid>
            </Grid>
            <Link to="/kitchen/index">
                <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} /> Back to Kitchen</Button>
            </Link>
        </Grid>
    );
};

export { AddIngredients };