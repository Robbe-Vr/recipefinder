import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Grid, makeStyles, Typography } from "@material-ui/core";
import { EntityList } from "../Global/EntityList";
import { Thumbnail } from "../Global/Thumbnail";
import Button from "@material-ui/core/Button";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserSelectInputComponent } from "../Global/UserSelectInputComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faPlus } from '@fortawesome/free-solid-svg-icons';

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

    const [ingredients, setIngredients] = useState([
        {
            Id: '',
            Name: '',
            ImageLocation: '',
            AverageVolumeInLiterPerUnit: 0.0,
            AverageWeightInKgPerUnit: 0.0,
            Categories: [
                {
                    CountId: '',
                    Name: '',
                }
            ],
            UnitTypes: [
                {
                    CountId: 1,
                    Name: '',
                    AllowDecimals: false,
                }
            ]
        }
    ]);
    if (ingredients.length === 1 && ingredients[0].Id === '' && unitTypeChanges)
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
            <Grid
                className={classes.ingredientSelectedContainer}
                xs={6}
            >
                {selectedIngredient && selectedIngredient.Id ?
                    <Grid>
                        <Grid>
                            <Grid xs={6}>
                                <Thumbnail source={selectedIngredient.ImageLocation} size="50px" />
                            </Grid>
                            <Grid xs={6}>
                                <Typography variant="h4">{selectedIngredient.Name}</Typography>
                            </Grid>
                        </Grid>
                        <Grid>
                            <UserInputComponent type="number" name="Amount" defaultValue={1.0} inputProps={{ min: allowDecimals ? 0.01 : 1.00, max: 1000.00, step: allowDecimals ? 0.01 : 1.00 }}
                                onChange={(value) => { saveIngredient.Units = parseFloat(value); setSaveIngredient(saveIngredient); }} />
                            <UserSelectInputComponent name="Unit Type" options={selectedIngredient.UnitTypes.map(unitType => { return { value: unitType.CountId, name: unitType.Name }; })}
                                onChange={(value) => { saveIngredient.UnitTypeId = parseInt(value); setSaveIngredient(saveIngredient); setUnitTypeChanges(unitTypeChanges => unitTypeChanges + 1); }} />
                        </Grid>
                    </Grid>
                    :
                    <Typography variant="h5">Select an ingredient first!</Typography>
                }
                <Button onClick={SaveIngredient} variant="outlined" style={{ marginTop: "20px", color: 'green' }}><FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} /> Add Ingredient</Button>
            </Grid>
            <Grid
                className={classes.ingredientSelectContainer}
                style={{ borderLeft: "solid", paddingLeft: "10px" }}
                xs={6}
            >
                <Typography variant="h3">Select an ingredient</Typography>
                <EntityList
                    columns={[
                        { id: 'image', label: '', minWidth: 50 },
                        { id: 'name', label: 'Name', minWidth: 100 },
                        { id: 'unitTypes', label: 'Available Types', minWidth: 125 },
                        { id: 'categories', label: 'Categories', minWidth: 125 },
                        { id: 'select', label: 'Choose', minWidth: 100 },
                    ]}
                    rows={ingredients.map(ingredient => {
                        return {
                            id: ingredient.Id,
                            image: <Thumbnail source={ingredient.ImageLocation} size="50px" />,
                            name: ingredient.Name,
                            unitTypes: ingredient.UnitTypes.map((unitType, index) => { if (index > 0) return ", " + unitType.Name; else return unitType.Name; }),
                            categories: ingredient.Categories.map((category, index) => { if (index > 0) return ", " + category.Name; else return category.Name; }),
                            select: <Button onClick={() => selectIngredient(ingredient)} style={{ color: 'forestgreen' }}>Select</Button>
                        };
                    })}
                />
            </Grid>
            <Link to="/kitchen/index">
                <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} /> Back to Kitchen</Button>
            </Link>
        </Grid>
    );
};

export { AddIngredients };