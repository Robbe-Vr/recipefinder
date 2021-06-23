import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Dialog, DialogContent, DialogTitle, Grid, Button } from "@material-ui/core";

import { EntityList } from "../Global/EntityList";
import { Thumbnail } from "../Global/Thumbnail";
import { RowActions } from "../Global/RowActions";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserSelectInputComponent } from "../Global/UserSelectInputComponent";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { KitchenIngredient } from "../../models";
import { useNotifications } from "../Global/NotificationContext";

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
    const { error, warning, success } =  useNotifications();

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

    const [editItem, setEditItem] = useState({ item: {}, dialogOpened: false });
    const [removeItem, setRemoveItem] = useState({ item: {}, dialogOpened: false });

    const [updates, setUpdates] = useState({});
    const [unitTypeChanges, setUnitTypeChanges] = useState(0);
    if (!updates && unitTypeChanges) {
        setUpdates({});
    }

    const classes = useStyles();

    useEffect(() => {
        Api.Kitchens.GetKitchenByUserId(userId).then((kitchen) => {
            if (kitchen instanceof String) {
                error(kitchen);
                return;
            }
        
            setKitchen(kitchen);
        });
    }, [Api.Kitchens, userId, error]);

    const onEdit = async (id) => {
        if (!updates[id]) return;

        await Api.Kitchens.Update(updates[id].CountId, updates[id]).then((res) => {
            var updatedKitchen = { ...kitchen };
            let index = updatedKitchen.Ingredients.indexOf(updatedKitchen.Ingredients.find(x => x.CountId === updates[id].CountId));
            updatedKitchen.Ingredients[index] = updates[id];
            setKitchen(updatedKitchen);

            if (res.data instanceof String) {
                warning(res.data);
            }
            else if (res.data instanceof String) {
                warning(res.data);
            }
            else success("Ingredient in your kitchen edited successfully!");

            closeEditDialog();
        });;
    };

    const onUnitsEdited = (id, newUnits) => {
        if (!id) { return; }

        if (!updates[id]) updates[id] = kitchen.Ingredients.find(x => x.IngredientId === id);

        updates[id].Units = parseFloat(newUnits);

        setUpdates(updates);
    };

    const onUnitTypeEdited = (id, newUnitType) => {
        if (!id) { return; }

        if (!updates[id]) updates[id] = kitchen.Ingredients.find(x => x.IngredientId === id);

        updates[id].UnitTypeId = parseInt(newUnitType);

        setUpdates(updates);

        setUnitTypeChanges(unitTypeChanges => unitTypeChanges + 1);
    };

    const onRemove = (id) => {
        var ingredient = kitchen.Ingredients.find(x => x.Ingredient.Id === id);

        var updatedKitchen = [...kitchen.Ingredients];
        updatedKitchen.splice(kitchen.Ingredients.indexOf(ingredient), 1);

        setKitchen({ ...kitchen, Ingredients: updatedKitchen });

        Api.Kitchens.Delete(kitchen.UserId + "/" + ingredient.IngredientId, ingredient).then((res) => {
            warning("Ingredient has been removed from your kitchen!");

            closeRemoveDialog();
        });
    };

    const closeEditDialog = () => {
        setEditItem({ ...removeItem, dialogOpened: false });
    };

    const closeRemoveDialog = () => {
        setRemoveItem({ ...removeItem, dialogOpened: false });
    };

    return (
        <Grid className={classes.form}>
            <Dialog open={removeItem.dialogOpened} onClose={closeRemoveDialog}>
                <DialogTitle>Remove {removeItem.item.Ingredient?.Name}</DialogTitle>
                <DialogContent>
                    Are you sure you want to remove this ingredient?
                    <Button id={removeItem.item.IngredientId} style={{ backgroundColor: 'red', marginRight: '5px' }} onClick={async (e) => await onRemove(removeItem.item.IngredientId)}>Remove</Button>
                    <Button style={{ backgroundColor: 'forestgreen' }} onClick={closeRemoveDialog}>Cancel</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={editItem.dialogOpened} onClose={closeEditDialog}>
                <DialogTitle>Edit {editItem.item.Ingredient?.Name}</DialogTitle>
                <DialogContent>
                    <UserInputComponent onChange={(value) => onUnitsEdited(editItem.item.IngredientId, value)} name="Units" defaultValue={editItem.item.Units}
                        type="number" inputProps={{ min: editItem.allowDecimals ? 0.01 : 1.00, max: 1000.00, step: editItem.allowDecimals ? 0.01 : 1.00 }} />
                    <UserSelectInputComponent onChange={(value) => onUnitTypeEdited(editItem.item.IngredientId, value)} name="Unit Type" defaultValue={editItem.item.UnitType?.CountId}
                        options={editItem.item.Ingredient?.UnitTypes.map(unitType => { return { id: unitType.CountId, name: unitType.Name, value: unitType.CountId } }) ?? []} />
                    <Button id={editItem.item.IngredientId} style={{ backgroundColor: 'forestgreen', marginRight: '5px' }} onClick={async (e) => await onEdit(editItem.item.IngredientId)}>Save</Button>
                    <Button style={{ backgroundColor: 'gold' }} onClick={closeEditDialog}>Cancel</Button>
                </DialogContent>
            </Dialog>

            <Typography className={classes.txt} variant="h3">
                {kitchen?.User?.Name}'s Kitchen
            </Typography>

            {!kitchen || kitchen.Ingredients?.length < 1 ?
                "No ingredients in your kitchen." :
                <EntityList
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
                            actions: <RowActions rowEntity={ingredient} rowEntityId={ingredient.IngredientId}
                                onEdit={() => setEditItem({ item: ingredient, allowDecimals: allowDecimals, dialogOpened: true })}
                                onRemove={() => setRemoveItem({ item: ingredient, dialogOpened: true })} />,
                        }
                    }) ?? []}
                />
            }
            <Grid style={{ marginRight: '5px', marginBottom: '20px' }}>
                <Link to="/kitchen/add">
                    <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faPlus} /> Add Ingredients</Button>
                </Link>
            </Grid>
            <Grid style={{ marginRight: '5px' }}>
                <Link to="/kitchen/whattobuy">
                    <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faPlus} /> What to Buy</Button>
                </Link>
            </Grid>
        </Grid>
    );
};

export { KitchenHomePage };
