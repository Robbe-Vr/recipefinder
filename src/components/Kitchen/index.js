import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { KitchenList } from "./KitchenList";
import { Thumbnail } from "../Global/Thumbnail";
import { RowActions } from "../Global/RowActions";
import { Grid } from "@material-ui/core";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserSelectInputComponent } from "../Global/UserSelectInputComponent";

const useStyles = makeStyles(() => ({
    form: {
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    txt: { textAlign: "center" },
    continue: {
        marginTop: "20px",
        width: "20%",
    },
}));

function KitchenHomePage({ setTitle, userId, Api }) {
    useEffect(() => {
        setTitle && setTitle("Kitchen");
    });
    
    const [kitchen, setKitchen] = useState({
        User: '',
        Ingredients: [
            {
                Ingredient: {
                    Id: '',
                    Name: '',
                    ImageLocation: '',
                    AverageVolumeInLiterPerUnit: 0.0,
                    AverageWeightInKgPerUnit: 0.0,
                    UnitTypes: [
                        {
                            Id: 1,
                            Name: '',
                            AllowDecimals: false,
                        }
                    ]
                },
                Units: 0.00,
                UnitType: {
                    Id: 1,
                    Name: '',
                    AllowDecimals: false,
                }
            }
        ],
    });
    if (kitchen.Ingredients.length === 1 && kitchen.Ingredients[0].Units === 0.00)
    {
        kitchen.Ingredients?.pop();
    }

    const [editingIngredients, setEditingIngredients] = useState([]);
    const [removingIngredients, setRemovingIngredients] = useState([]);

    const [units, setunits] = useState([{ ingredientId: '', units: 0, unitTypeId: '' }]);

    const classes = useStyles();

    useEffect(() => {
        if (!kitchen.Ingredients || kitchen.Ingredients.length > 0 || userId === kitchen.User) { return; }

        console.log("Retreiving " + userId + "s kitchen.");
        Api.Kitchens.GetKitchenByUserId(userId).then((kitchen) => {
            if (kitchen === "Error") { return; }
        
            setKitchen(kitchen);
        });
    }, [kitchen, Api.Kitchens, userId]);

    const ToggleEdit = (id) => {
        if (editingIngredients.indexOf(id) > -1) {
            setEditingIngredients(editingIngredients.filter(x => x !== id));
        }
        else {
            setEditingIngredients(editingIngredients => [...editingIngredients, id]);
            setRemovingIngredients(removingIngredients.filter(x => x !== id));
        }
    };

    const onEdit = (id) => {
        var ingredient = kitchen.Ingredients.find(x => x.Ingredient.Id === id);

        Api.Kitchens.Update(ingredient);
    };

    const onUnitsEdited = (id, newUnits) => {
        var oldUnits = units.find(x => x.ingredientId === id);

        oldUnits.units = newUnits;

        setunits(oldUnits);
    };

    const onUnitTypeEdited = (id, newUnitType) => {
        var oldUnits = units.find(x => x.ingredientId === id);

        oldUnits.unitTypeId = newUnitType;

        setunits(oldUnits);
    };

    const ToggleRemove = (id) => {
        if (removingIngredients.indexOf(id) > -1) {
            setRemovingIngredients(removingIngredients.filter(x => x !== id));
        }
        else {
            setRemovingIngredients(removingIngredients => [...removingIngredients, id]);
            setEditingIngredients(editingIngredients.filter(x => x !== id));
        }
    };

    const onRemove = (id) => {
        var ingredient = kitchen.Ingredients.find(x => x.Ingredient.Id === id);

        Api.Kitchens.Delete(ingredient);
    };

    return (
        <div className={classes.form}>
            <Typography className={classes.txt} variant="h1">
                {kitchen.User?.Name}'s Kitchen!
            </Typography>

            {kitchen.Ingredients.length < 1 ?
                "No ingredients in your kitchen!" :
                <KitchenList
                    columns={[
                        { id: 'image', label: '', minWidth: 50 },
                        { id: 'name', label: 'Name', minWidth: 150 },
                        { id: 'units', label: 'Amount', minWidth: 100 },
                        { id: 'actions', label: 'Actions', minWidth: 200 },
                    ]}
                    rows={kitchen.Ingredients.map(ingredient => [
                        {
                            id: ingredient.Ingredient.Id,
                            image: <Thumbnail source={ingredient.Ingredient.ImageLocation} size="50px" />,
                            name: ingredient.Ingredient.Name,
                            units: ingredient.Units + " " + ingredient.UnitType.Name,
                            actions: <RowActions kitchenIngredient={ingredient} onEdit={ToggleEdit} onRemove={ToggleRemove} />,
                            editComponent: editingIngredients.indexOf(ingredient.Ingredient.Id) > -1 ?
                                <div>
                                    <UserInputComponent onChange={onUnitsEdited} name="units" defaultValue={ingredient.Units} type="number" /><br />
                                    <UserSelectInputComponent onChange={onUnitTypeEdited} name="unitType" defaultValue={ingredient.UnitType.Id} type="number"
                                        options={ingredient.Ingredient.UnitTypes.map(unitType => { return { name: unitType.Name, value: unitType.Id } })} />
                                    <Button id={ingredient.Ingredient.Id} onClick={(e) => onEdit(ingredient.Ingredient.Id)}>Save</Button>
                                    <Button id={ingredient.Ingredient.Id} onClick={(e) => ToggleEdit(ingredient.Ingredient.Id)}>Cancel</Button>
                                </div> : null,
                            removeComponent: removingIngredients.indexOf(ingredient.Ingredient.Id) > -1 ?
                                <div>
                                    Are you sure you want to remove this ingredient?
                                    <Button id={ingredient.Ingredient.Id} onClick={(e) => onRemove(ingredient.Ingredient.Id)}>Remove</Button>
                                    <Button id={ingredient.Ingredient.Id} onClick={(e) => ToggleRemove(ingredient.Ingredient.Id)}>Cancel</Button>
                                </div> : null,
                        }
                    ])}
                />
            }
        </div>
    );
};

export { KitchenHomePage };