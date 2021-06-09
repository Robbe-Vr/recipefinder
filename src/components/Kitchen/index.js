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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { KitchenIngredient } from "../../models";

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
        UserId: '',
        User: '',
        Ingredients: [new KitchenIngredient()],
    });
    if (kitchen?.Ingredients.length === 1 && kitchen.Ingredients[0].Units === 0.00)
    {
        kitchen.Ingredients.pop();
    }

    const [editingIngredients, setEditingIngredients] = useState([]);
    const [removingIngredients, setRemovingIngredients] = useState([]);

    const [updates, setUpdates] = useState({});
    const [unitTypeChanges, setUnitTypeChanges] = useState(0);
    if (!updates && unitTypeChanges) {
        setUpdates({});
    }

    const classes = useStyles();

    useEffect(() => {
        Api.Kitchens.GetKitchenByUserId(userId).then((kitchen) => {
            if (kitchen === "Error") { return; }
        
            setKitchen(kitchen);
        });
    }, [Api.Kitchens, userId]);

    const ToggleEdit = (id) => {
        if (editingIngredients.indexOf(id) > -1) {
            setEditingIngredients(editingIngredients => editingIngredients.filter(x => x !== id));
            setUpdates(updates => { updates[id] = undefined; return updates; });
        }
        else {
            setEditingIngredients(editingIngredients => [...editingIngredients, id]);
            setRemovingIngredients(removingIngredients => removingIngredients.filter(x => x !== id));
        }
    };

    const onEdit = async (id) => {
        if (!updates[id]) return;

        await Api.Kitchens.Update(updates[id].CountId, updates[id]);

        window.location.reload();
    };

    const onUnitsEdited = (id, newUnits) => {
        if (!updates[id]) updates[id] = kitchen.Ingredients.find(x => x.IngredientId === id);

        updates[id].Units = parseFloat(newUnits);

        setUpdates(updates => updates);
    };

    const onUnitTypeEdited = (id, newUnitType) => {
        if (!updates[id]) updates[id] = kitchen.Ingredients.find(x => x.IngredientId === id);

        updates[id].UnitTypeId = parseInt(newUnitType);

        setUpdates(x => updates);

        setUnitTypeChanges(unitTypeChanges => unitTypeChanges + 1);
    };

    const ToggleRemove = (id) => {
        if (removingIngredients.indexOf(id) > -1) {
            setRemovingIngredients(removingIngredients => removingIngredients.filter(x => x !== id));
        }
        else {
            setRemovingIngredients(removingIngredients => [...removingIngredients, id]);
            setEditingIngredients(editingIngredients => editingIngredients.filter(x => x !== id));
        }
    };

    const onRemove = (id) => {
        var ingredient = kitchen.Ingredients.find(x => x.Ingredient.Id === id);

        Api.Kitchens.Delete(kitchen.UserId + "/" + ingredient.IngredientId, ingredient);

        window.location.reload();
    };

    return (
        <Grid className={classes.form}>
            <Typography className={classes.txt} variant="h3">
                {kitchen?.User.Name}'s Kitchen
            </Typography>

            {!kitchen || kitchen.Ingredients.length < 1 ?
                "No ingredients in your kitchen." :
                <KitchenList
                    columns={[
                        { id: 'image', label: '', minWidth: 50 },
                        { id: 'name', label: 'Name', minWidth: 150 },
                        { id: 'units', label: 'Amount', minWidth: 100 },
                        { id: 'actions', label: 'Actions', minWidth: 200 },
                    ]}
                    rows={kitchen?.Ingredients.map(ingredient => {
                        const updatedUnitType = ingredient.Ingredient.UnitTypes.find(x => x.CountId === updates[ingredient.IngredientId]?.UnitTypeId);

                        const allowDecimals = updatedUnitType ? updatedUnitType.AllowDecimals : ingredient.UnitType.AllowDecimals;

                        return {
                            id: ingredient.IngredientId,
                            image: <Thumbnail source={ingredient.Ingredient.ImageLocation} size="50px" />,
                            name: ingredient.Ingredient.Name,
                            units: ingredient.Units + " " + ingredient.UnitType.Name,
                            actions: <RowActions rowEntity={ingredient} rowEntityId={ingredient.IngredientId} onEdit={ToggleEdit} onRemove={ToggleRemove} />,
                            editComponent: editingIngredients.indexOf(ingredient.Ingredient.Id) > -1 ?
                                <div>
                                    <UserInputComponent onChange={(value) => onUnitsEdited(ingredient.IngredientId, value)} name="Units" defaultValue={ingredient.Units}
                                        type="number" inputProps={{ min: allowDecimals ? 0.01 : 1.00, max: 1000.00, step: allowDecimals ? 0.01 : 1.00 }} />
                                    <UserSelectInputComponent onChange={(value) => onUnitTypeEdited(ingredient.IngredientId, value)} name="Unit Type" defaultValue={ingredient.UnitType.CountId}
                                        options={ingredient.Ingredient.UnitTypes.map(unitType => { return { id: unitType.CountId, name: unitType.Name, value: unitType.CountId } })} />
                                    <Button id={ingredient.IngredientId} style={{ backgroundColor: 'forestgreen', marginRight: '5px' }} onClick={async (e) => await onEdit(ingredient.IngredientId)}>Save</Button>
                                    <Button id={ingredient.IngredientId} style={{ backgroundColor: 'gold' }} onClick={(e) => ToggleEdit(ingredient.Ingredient.Id)}>Cancel</Button>
                                </div> : null,
                            removeComponent: removingIngredients.indexOf(ingredient.Ingredient.Id) > -1 ?
                                <div>
                                    Are you sure you want to remove this ingredient?
                                    <Button id={ingredient.IngredientId} style={{ backgroundColor: 'red', marginRight: '5px' }} onClick={async (e) => await onRemove(ingredient.IngredientId)}>Remove</Button>
                                    <Button id={ingredient.IngredientId} style={{ backgroundColor: 'forestgreen' }} onClick={(e) => ToggleRemove(ingredient.IngredientId)}>Cancel</Button>
                                </div> : null,
                        }
                    }) ?? []}
                />
            }
            <Link to="/kitchen/add">
                <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} /> Add Ingredients</Button>
            </Link>
        </Grid>
    );
};

export { KitchenHomePage };