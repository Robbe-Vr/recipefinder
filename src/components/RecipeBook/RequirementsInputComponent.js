import React, { useEffect, useState } from "react";

import { Button, Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";

import { SelectIngredientComponent } from "../Global/SelectIngredientComponent";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserSelectInputComponent } from "../Global/UserSelectInputComponent";

import { Ingredient, RequirementsListIngredient, UnitType } from "../../models";
import { useNotifications } from "../Global/NotificationContext";

function RequirementsInputComponent({ Api, defaultValues = [new RequirementsListIngredient()], parentRecipe, onChange }) {
    const { error } =  useNotifications();

    const [values, setValues] = useState(defaultValues);

    if (!values && defaultValues) {
        setValues(defaultValues);
    }

    const [ingredients, setIngredients] = useState([new Ingredient()]);
    if (ingredients.length === 1 && ingredients[0].CountId === -1)
    {
        ingredients?.pop();
    }

    useEffect(() => {
        Api.Ingredients.GetAll().then((ingredients) => {
            if (typeof ingredients === "string") {
                error(ingredients);
                return;
            }
        
            setIngredients(ingredients);
        });
    }, [Api.Ingredients, error]);

    const [unitTypes, setUnitTypes] = useState([new UnitType()]);
    if (unitTypes.length === 1 && unitTypes[0].CountId === -1)
    {
        unitTypes?.pop();
    }

    useEffect(() => {
        Api.UnitTypes.GetAll().then((unitTypes) => {
            if (typeof unitTypes === "string") {
                error(unitTypes);
                return;
            }
        
            setUnitTypes(unitTypes);
        });
    }, [Api.UnitTypes, error]);
    
    const removeRequirement = (index) => {
        setValues(values => { var vals = [...values]; vals.splice(index, 1); return vals; });

        var ingredientsSelects = [...ingredientSelectsOpen];

        ingredientsSelects.pop();

        setIngredientSelectsOpen(ingredientsSelects);
    };

    const addRequirement = () => {
        setValues([...values, new RequirementsListIngredient(null, null, null, null, parentRecipe)]);

        var ingredientsSelects = [...ingredientSelectsOpen];

        ingredientsSelects.push(false);

        setIngredientSelectsOpen(ingredientsSelects);
    };

    const updateValue = (newValue, index, propName) => {
        var updatedValues = [...values];

        updatedValues[index][propName] = newValue;

        setValues(updatedValues);
        onChange(updatedValues);
    };

    const selectIngredient = (ingredient, index) => {
        updateValue(ingredient, index, "Ingredient");
        updateValue(ingredient.Id, index, "IngredientId");

        closeIngredientSelect(index);
    };

    const openIngredientSelect = (index) => {
        var ingredientsSelects = [...ingredientSelectsOpen];

        ingredientsSelects[index] = true;

        setIngredientSelectsOpen(ingredientsSelects);
    };

    const closeIngredientSelect = (index) => {
        var ingredientsSelects = [...ingredientSelectsOpen];

        ingredientsSelects[index] = false;

        setIngredientSelectsOpen(ingredientsSelects);
    };

    const updateUnitType = (unitTypeId, index) => {
        var unitType = unitTypes.find(u => u.CountId === unitTypeId);

        updateValue(unitType, index, "UnitType");
        updateValue(unitType.CountId, index, "UnitTypeId");
    };

    const [ingredientSelectsOpen, setIngredientSelectsOpen] = useState(defaultValues.map(val => false));

    return (
        <Grid>
            {
                values.map((requirement, index) => {
                    const allowDecimals = ingredients.find(x => x.CountId === requirement.Ingredient?.CountId)?.UnitTypes.find(x => x.CountId === requirement.UnitType?.CountId)?.AllowDecimals ?? false;

                    return (
                        <Grid container direction="row"  style={{ marginBottom: '15px', borderTop: 'solid 1px' }}>
                            <Dialog open={ingredientSelectsOpen[index] ?? false} onClose={() => closeIngredientSelect(index)}>
                                <DialogTitle>Ingredient</DialogTitle>
                                <DialogContent>
                                    <SelectIngredientComponent
                                        Api={Api}
                                        ingredients={ingredients.filter(i => values.filter(x => x.CountId === requirement.CountId).filter(x => x.Ingredient?.CountId === i.CountId).length === 0)}
                                        selectIngredient={(ingredient) => { selectIngredient(ingredient, index); }}
                                    />
                                </DialogContent>
                            </Dialog>
                            <Grid container direction="row" style={{ marginBottom: '5px' }}>
                                Requirement {index + 1}:
                            </Grid>
                            <Grid container direction="row" style={{ marginBottom: '5px' }}>
                                <Grid container direction="row" style={{ marginBottom: '10px' }}>
                                    <Button variant="outlined" onClick={() => { openIngredientSelect(index); }}>{requirement.Ingredient?.Name.length > 0 ? requirement.Ingredient.Name : "Choose Ingredient"}</Button>
                                </Grid>
                                <Grid container direction="row" style={{ width: '100%', marginBottom: '5px' }}>
                                    <Grid style={{ width: '40%' }}>
                                        <UserInputComponent
                                            name="Amount"
                                            defaultValue={requirement.Units}
                                            inputProps={{ min: allowDecimals ? 0.01 : 1.00, max: 1000.00, step: allowDecimals ? 0.01 : 1.00 }}
                                            type="number"
                                            onChange={(value) => {
                                                updateValue(value, index, "Units");
                                            }}
                                        />
                                    </Grid>
                                    <Grid style={{ width: '50%', marginLeft: '5px' }}>
                                        <UserSelectInputComponent
                                            name="UnitTypes"
                                            defaultValue={requirement.UnitType?.CountId ?? -1}
                                            options={requirement.Ingredient?.UnitTypes.map(unitType => { return { name: unitType.Name, value: unitType.CountId }; }) ?? []}
                                            onChange={(value) => {
                                                updateUnitType(value, index);
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row">
                                    <Button variant="outlined" style={{ color: 'red', borderColor: 'red' }}
                                        onClick={() => { removeRequirement(index); }}>Remove Requirement</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    )
                })
            }
            <Grid container direction="row" style={{ marginBottom: '20px' }}>
                <Button variant="outlined" style={{ color: 'forestgreen', borderColor: 'forestgreen' }}
                    onClick={() => { addRequirement(); }}>Add Requirement</Button>
            </Grid>
        </Grid>
    );
};

export { RequirementsInputComponent };