import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faPlus, faSync } from '@fortawesome/free-solid-svg-icons';

import { EntityList } from "../Global/EntityList";
import { Thumbnail } from "../Global/Thumbnail";
import { Card, Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserMultiSelectInputComponent } from "../Global/UserMultiSelectInputComponent";

import { Recipe, RecipeCategory, RequirementsListIngredient } from "../../models";

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

function WhatToBuyPage({ setTitle, userId, Api }) {
    useEffect(() => {
        setTitle && setTitle("What to Buy");
    });

    const [listState, setListState] = useState(1);
    
    const [items, setItems] = useState([listState === 1 ? new Recipe() : new RequirementsListIngredient()]);
    if (items.length === 1 && items[0].CountId === -1)
    {
        items.pop();
    }

    useEffect(() => {
        Api.Ingredients.GetWhatToBuy(userId, (listState === 1 ? 'recipes' : 'ingredients')).then((items) => {
            if (items === "Error") { return; }
        
            setItems(items);
        });
    }, [Api.Ingredients, userId, listState]);

    const [selectedItem, setSelectedItem] = useState({ item: {}, dialogOpened: false });

    const [selectedIngredient, setSelectedIngredient] = useState({ item: {}, dialogOpened: false });

    const classes = useStyles();

    const [categories, setCategories] = useState([new RecipeCategory()]);
    if (categories.length === 1 && categories[0].CountId === -1)
    {
        categories.pop();
    }

    useEffect(() => {
        Api[`${listState === 1 ? 'Recipe' : 'Ingredient'}Categories`].GetAll().then((categories) => {
            if (categories === "Error") { return; }
        
            setCategories(categories);
        });
    }, [Api, listState]);

    const [filterOptions, setFilterOptions] = useState({ name: '', categories: [] });

    const filter = (recipe = listState === 1 ? new Recipe() : new RequirementsListIngredient()) => {
        return (
            (filterOptions.name?.length > 0 ? recipe.Name.toLowerCase().indexOf(filterOptions.name.toLowerCase()) > -1 : true) &&
            (filterOptions.categories?.length > 0 ?
                recipe.Categories.filter(c => {
                    return filterOptions.categories.filter(x => {
                        return x === c.CountId;
                    }).length > 0;
                }).length > 0
            : true)
        );
    };

    const addIngredients = (toAddIngredients) => {
        toAddIngredients.forEach(ingredient => {
            addIngredient(ingredient);
        });

        closeItemDialog();
    };

    const addIngredient = (toAddIngredient) => {
        setSelectedIngredient(selectedIngredient => { selectedIngredient.dialogOpened = false; return selectedIngredient });

        closeIngredientDialog();
    };

    const closeItemDialog = () => {
        setSelectedItem({ ...selectedItem, dialogOpened: false });
    };

    const closeIngredientDialog = () => {
        setSelectedIngredient({ ...selectedIngredient, dialogOpened: false });
    };

    return (
        <Grid
            container
            direction="row"
        >
            <Dialog open={selectedItem.dialogOpened} onClose={closeItemDialog}>
                <DialogTitle>Missing ingredients for {selectedItem.item.Name}</DialogTitle>
                <DialogContent>
                    Your kitchen is missing the following ingredients to prepare {selectedItem.item.Name}:<br />
                    <Grid>
                        <EntityList
                            columns={[
                                { id: 'img', label: '', minWidth: 100 },
                                { id: 'name', label: 'Name', minWidth: 100 },
                                { id: 'category', label: 'Categories', minWidth: 150 },
                                { id: 'amount', label: 'Amount', minWidth: 50 },
                            ]}
                            rows={selectedItem.item.RequirementsList?.map(ingredient => {
                                return {
                                    img: <Thumbnail source={ingredient.Ingredient.ImageLocation} size={50} />,
                                    name: ingredient.Ingredient.Name,
                                    category: ingredient.Ingredient.Categories.map(category => <Card>{category.Name}</Card>),
                                    amount: `${ingredient.Units} ${ingredient.UnitType.Name}`,
                                    onClick: () => { setSelectedIngredient({ item: ingredient, dialogOpened: true }) },
                                };
                            })}
                        />
                    </Grid>
                    <Button onClick={() => addIngredients(selectedItem.item.RequirementsList)} style={{ backgroundColor: 'forestgreen', marginTop: '1rem', marginRight: '20px' }}>
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />Add All
                    </Button>
                    <Button onClick={closeItemDialog} style={{ backgroundColor: 'red', marginTop: '1rem' }}>Cancel</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={selectedIngredient.dialogOpened} onClose={closeIngredientDialog}>
                <DialogTitle>
                    Missing: {selectedIngredient.item.Ingredient?.Name}
                </DialogTitle>
                <DialogContent>
                    <Grid>
                        <Grid>
                            Ingredient: {selectedIngredient.item.Ingredient?.Name}
                        </Grid>
                        <Grid>
                            Amount: {selectedIngredient.item.Units} {selectedIngredient.item.UnitType?.Name}
                        </Grid>
                    </Grid>
                    <Button onClick={() => addIngredient(selectedIngredient.item)} style={{ backgroundColor: 'forestgreen', marginTop: '1rem', marginRight: '20px' }}>
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />Add
                    </Button>
                    <Button onClick={closeIngredientDialog} style={{ backgroundColor: 'red', marginTop: '1rem' }}>Cancel</Button>
                </DialogContent>
            </Dialog>
            <Grid item xs={7}>
                <Typography className={classes.txt} variant="h3">
                    What to Buy
                </Typography>

                {items.length < 1 ?
                    "Nothing found missing in your kitchen." :
                    <EntityList
                        columns={(() => {
                            var columns = [
                                { id: 'image', label: '', minWidth: 50 },
                                { id: 'name', label: 'Name', minWidth: 150 },
                                { id: 'category', label: 'Category', minWidth: 100 },
                                { id: 'amount', label: 'Amount', minWidth: 50 },
                            ];

                            return columns;
                        })()}
                        rows={items.filter(r => filter(r)).map(item => {
                            var row = {
                                id: item.Id ?? item.IngredientId,
                                image: <Thumbnail source={item.ImageLocation ?? item.Ingredient.ImageLocation} size={50} />,
                                name: item.Name ?? item.Ingredient.Name,
                                category: item.Categories ? item.Categories.map(category => <Card>{category.Name}</Card>)
                                    : item.Ingredient.Categories.map(category => <Card>{category.Name}</Card>),
                                amount: item.RequirementsList?.length ? (item.RequirementsList?.length + ' ingredients') : (item.Units + ' ' + item.UnitType.Name),
                                onClick: () => listState === 1 ? setSelectedItem({ item: item, dialogOpened: true }) : setSelectedIngredient({ item: item, dialogOpened: true }),
                            };

                            return row;
                        })}
                    />
                }
            </Grid>
            <Grid item xs={4} style={{ borderLeft: 'solid 1px', marginLeft: '5px', padding: '5px', overflow: 'auto' }}>
                <Grid container direction="row" style={{ marginBottom: '8px', display: 'flex', alignContent: 'center' }}><Typography variant="h5">Filters</Typography></Grid>
                <Grid container style={{ padding: '3px', display: 'flex', alignContent: 'center', justifyContent: 'center', marginBottom: '2px' }}>
                    <Grid container direction="row" style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>Showing:</Grid>
                    <Grid container direction="row" style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                        <Button variant="outlined" onClick={() => setListState(recipeListState => recipeListState === 1 ? 0 : 1)}
                            style={{ width: '80%', backgroundColor: listState === 1 ? "#ffbb00" : "green" }}>
                            {listState === 1 ? "Recipes" : "Ingredients"}
                            <FontAwesomeIcon icon={faSync} style={{ marginLeft: '5px' }} />
                        </Button>
                    </Grid>
                </Grid>

                <Grid style={{ padding: '3px', display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                    <UserInputComponent
                        defaultValue={filterOptions.name}
                        name="search by name"
                        onChange={(value) => setFilterOptions(filterOptions => { return { ...filterOptions, ...{ name: value } }; })}
                    />
                </Grid>
                <Grid container style={{ padding: '3px', display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                    <Grid container direction="row" style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>Categories:</Grid>
                    <Grid container direction="row" style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                        <UserMultiSelectInputComponent
                            name="select categories"
                            defaultValue={filterOptions.categories}
                            options={categories.map(category => { return { name: category.Name, value: category.CountId }; })}
                            onChange={(values) => setFilterOptions(filterOptions => { return { ...filterOptions, ...{ categories: values } }; })}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Link to="/kitchen/index">
                <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} /> Back to Kitchen</Button>
            </Link>
        </Grid>
    );
};

export { WhatToBuyPage };