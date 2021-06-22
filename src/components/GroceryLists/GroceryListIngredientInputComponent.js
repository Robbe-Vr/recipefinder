import React, { useEffect, useState } from "react";

import { Button, Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";

import { SelectIngredientComponent } from "../Global/SelectIngredientComponent";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserSelectInputComponent } from "../Global/UserSelectInputComponent";

import { Ingredient, UnitType } from "../../models";
import { useNotifications } from "../Global/NotificationContext";

function GroceryListIngredientInputComponent({ Api, defaultValues = [], onChange }) {
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
            if (ingredients instanceof String) {
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
            if (unitTypes instanceof String) {
                error(unitTypes);
                
                return;
            }
        
            setUnitTypes(unitTypes);
        });
    }, [Api.UnitTypes, error]);
    
    const removeGroceryListIngredient = (index) => {
        setValues(values => { var vals = [...values]; vals.splice(index, 1); return vals; });

        var ingredientsSelects = [...ingredientSelectsOpen];

        ingredientsSelects.pop();

        setIngredientSelectsOpen(ingredientsSelects);
    };

    const addGroceryListIngredient = () => {
        setValues([...values, { Ingredient: null, IngredientId: '', Units: 0, UnitType: null, UnitTypeId: 0 }]);

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
                values.map((groceryListIngredient, index) => {
                    const allowDecimals = ingredients.find(x => x.Id === groceryListIngredient.IngredientId)?.UnitTypes.find(x => x.CountId === groceryListIngredient.UnitTypeId)?.AllowDecimals ?? false;

                    const unselectedIngredients = ingredients.filter(i => values.filter(x => x.IngredientId === i.Id).length === 0);

                    return (
                        <Grid container direction="row"  style={{ marginBottom: '15px', borderTop: 'solid 1px' }}>
                            <Dialog open={ingredientSelectsOpen[index] ?? false} onClose={() => closeIngredientSelect(index)}>
                                <DialogTitle>Ingredient</DialogTitle>
                                <DialogContent>
                                    <SelectIngredientComponent
                                        Api={Api}
                                        ingredients={unselectedIngredients}
                                        selectIngredient={(ingredient) => { selectIngredient(ingredient, index); }}
                                    />
                                </DialogContent>
                            </Dialog>
                            <Grid container direction="row" style={{ marginBottom: '15px' }}>
                                Ingredient {index + 1}:
                            </Grid>
                            <Grid container direction="row" style={{ marginBottom: '15px' }}>
                                <Grid container direction="row" style={{ marginBottom: '15px' }}>
                                    <Button variant="outlined" onClick={() => { openIngredientSelect(index); }}>{groceryListIngredient.IngredientId ? ingredients.find(x => x.Id === groceryListIngredient.IngredientId)?.Name : "Choose Ingredient"}</Button>
                                </Grid>
                                <Grid container direction="row" style={{ marginBottom: '15px' }}>
                                    <UserInputComponent
                                        name="Amount"
                                        defaultValue={groceryListIngredient.Units}
                                        inputProps={{ min: allowDecimals ? 0.01 : 1.00, max: 1000.00, step: allowDecimals ? 0.01 : 1.00 }}
                                        type="number"
                                        onChange={(value) => {
                                            updateValue(value, index, "Units");
                                        }}
                                    />
                                    <UserSelectInputComponent
                                        name="UnitTypes"
                                        defaultValue={groceryListIngredient.UnitTypeId}
                                        options={ingredients.find(x => x.Id === groceryListIngredient.IngredientId)?.UnitTypes.map(unitType => { return { name: unitType.Name, value: unitType.CountId }; }) ?? []}
                                        onChange={(value) => {
                                            updateUnitType(value, index);
                                        }}
                                    />
                                </Grid>
                                <Grid container direction="row" style={{ marginBottom: '20px' }}>
                                    <Button variant="outlined" style={{ color: 'red', marginLeft: '10px' }}
                                        onClick={() => { removeGroceryListIngredient(index); }}>Remove Ingredient</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    )
                })
            }
            <Grid container direction="row" style={{ marginBottom: '20px' }}>
                <Button variant="outlined" style={{ color: 'forestgreen' }}
                    onClick={() => { addGroceryListIngredient(); }}>Add Ingredient</Button>
            </Grid>
        </Grid>
    );
};

export { GroceryListIngredientInputComponent };