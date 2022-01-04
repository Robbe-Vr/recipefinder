import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Grid, Button, makeStyles, Typography } from "@material-ui/core";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBackward, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Thumbnail } from "../Global/Thumbnail";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserSelectInputComponent } from "../Global/UserSelectInputComponent";
import { SelectIngredientComponent } from "../Global/SelectIngredientComponent";

import { Ingredient, KitchenIngredient } from "../../models";
import { useNotifications } from "../Global/NotificationContext";

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

    const { error, success } =  useNotifications();

    const classes = useStyles();

    const [selectedIngredient, setSelectedIngredient] = useState({});
    const [saveIngredient, setSaveIngredient] = useState(new KitchenIngredient());

    const [ingredients, setIngredients] = useState([new Ingredient()]);
    if (ingredients.length === 1 && ingredients[0].CountId === -1)
    {
        ingredients?.pop();
    }

    useEffect(() => {
        Api.Ingredients.GetAll().then((ingredients) => {
            if (typeof ingredients === "string")  {
                error(ingredients);
                return;
            }
        
            setIngredients(ingredients);
        });
    }, [Api.Ingredients, error]);

    const selectIngredient = (ingredient) => {
        if (ingredient.CountId < 1) { return; }

        setSelectedIngredient(ingredient);

        saveIngredient.IngredientId = ingredient.Id;
        saveIngredient.UnitTypeId = ingredient.UnitTypes[0].CountId;
        saveIngredient.Units = 1.00;
        saveIngredient.UserId = userId;
        setSaveIngredient(saveIngredient);
    };

    const [errors, setErrors] = useState([]);
    useEffect(() => {
        for (var errorMsg in errors) {
            error(errorMsg);
        }
    }, [errors, error]);

    const SaveIngredient = () => {
        var validation = saveIngredient.Validate();

        if (Array.isArray(validation)) {
            validation.forEach((validationError) => {
                error(validationError.message);
            });

            setErrors(validation);

            return;
        }

        Api.Kitchens.Create(saveIngredient).then((res) => {
            if (typeof res === "string") {
                error(res);
            } else if (typeof res.data === "string") {
                error(res.data);
            } else if (typeof res.data?.Message === "string") {
                error(res.data.Message);
            } else {
                success("Ingredient added to your kitchen!");

                setSelectedIngredient({});
            }
        });
    };

    const allowDecimals = ingredients.find(x => x.Id === selectedIngredient.Id)?.UnitTypes.find(x => x.CountId === saveIngredient.UnitTypeId)?.AllowDecimals;

    const [selectedUnitType, setSelectedUnitType] = useState(0);

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
                            <Grid container direction="row" style={{ marginTop: '10%', width: '75%' }}>
                                <Grid container direction="row">
                                    <Grid>
                                        <Thumbnail source={selectedIngredient.ImageLocation} size={50} />
                                    </Grid>
                                    <Grid style={{ marginLeft: '5px' }}>
                                        <Typography variant="h5">{selectedIngredient.Name}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row">
                                    <Grid item style={{ display: 'inline-block', width: '30%' }}>
                                        <UserInputComponent type="number" name="Amount" defaultValue={1.0} inputProps={{ min: allowDecimals ? 0.01 : 1.00, max: 1000.00, step: allowDecimals ? 0.01 : 1.00 }}
                                            onChange={(value) => { saveIngredient.Units = parseFloat(value); setSaveIngredient(saveIngredient); }} />
                                    </Grid>
                                    <Grid item style={{ display: 'inline-block', width: '40%', marginLeft: '5px' }}>
                                        <UserSelectInputComponent name="Unit Type" options={selectedIngredient.UnitTypes.map(unitType => { return { value: unitType.CountId, name: unitType.Name }; })} defaultValue={selectedUnitType}
                                            onChange={(value) => { saveIngredient.UnitTypeId = parseInt(value); setSaveIngredient(saveIngredient); setSelectedUnitType(saveIngredient.UnitTypeId); }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Button onClick={SaveIngredient} variant="outlined" style={{ marginTop: "20px", color: 'forestgreen', borderColor: 'forestgreen' }}><FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />Add Ingredient</Button>
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
            <Link to="/kitchen/index" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" style={{ color: 'forestgreen', borderColor: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} />Back to Kitchen</Button>
            </Link>
        </Grid>
    );
};

export { AddIngredients };