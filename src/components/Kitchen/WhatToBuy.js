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

import { Ingredient, Recipe, RecipeCategory, RequirementsListIngredient, UnitType } from "../../models";
import { useNotifications } from "../Global/NotificationContext";
import { useCookies } from "react-cookie";

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

const cookieName = "recipefinder_grocerylist_cookie";

function WhatToBuyPage({ setTitle, userId, Api }) {
    useEffect(() => {
        setTitle && setTitle("What to Buy");
    });

    const { error, warning, success } =  useNotifications();

    const [cookies, setCookie, /*removeCookie*/] = useCookies();

    const [listState, setListState] = useState(1);
    
    const [items, setItems] = useState([listState === 1 ? new Recipe() : new RequirementsListIngredient()]);
    if (items.length === 1 && items[0].CountId === -1)
    {
        items.pop();
    }

    useEffect(() => {
        Api.Ingredients.GetWhatToBuy(userId, (listState === 1 ? 'recipes' : 'ingredients')).then((items) => {
            if (typeof items === "string") {
                error(items);

                return;
            }
        
            setItems(items);
        });
    }, [Api.Ingredients, userId, listState, error]);

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
            if (typeof categories === "string") {
                error(categories);

                return;
            }
        
            setCategories(categories);
        });
    }, [Api, listState, error]);

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
        const cookie = cookies[cookieName];

        var ingredients = [];

        if (cookie) {
            cookie.split(' | ').map(item => {
                var content = item.trim().split(', ');

                let units = parseInt(content[1]);

                return ingredients.push(
                    new RequirementsListIngredient(0,
                        new Ingredient(0, content[0]),
                        units,
                        new UnitType(parseInt(content[2]))
                    )
                );
            });
        }
        else {
            warning("Created a temporary grocery list!");
        }

        toAddIngredients.forEach(toAddIngredient => {
            if (cookie) {
                var duplicate = ingredients.find(x => x.IngredientId === toAddIngredient.IngredientId);

                if (duplicate) {
                    var item = ingredients[ingredients.indexOf(duplicate)];
                    item.Units += toAddIngredient.UnitTypeId === item.UnitTypeId ? toAddIngredient.Units : 0;
                } else {
                    ingredients.push(toAddIngredient);
                }
            } else {
                ingredients.push(toAddIngredient);
            }

            success(`Added ${toAddIngredient.Units} ${toAddIngredient.UnitType.Name} of ${toAddIngredient.Ingredient.Name} to the grocery list!`);
        });

        var value = ingredients.map(i => `${i.IngredientId}, ${i.Units}, ${i.UnitTypeId}`).join(' | ');

        setCookie(cookieName, value);

        closeItemDialog();
    };

    const addIngredient = (toAddIngredient) => {
        const cookie = cookies[cookieName];

        var ingredients = [];

        if (cookie) {
            cookie.split(' | ').map(item => {
                var content = item.trim().split(', ');

                let units = parseInt(content[1]);

                return ingredients.push(
                    new RequirementsListIngredient(0,
                        new Ingredient(0, content[0]),
                        units,
                        new UnitType(parseInt(content[2]))
                    )
                );
            });

            var duplicate = ingredients.find(x => x.IngredientId === toAddIngredient.IngredientId);

            if (duplicate) {
                var item = ingredients[ingredients.indexOf(duplicate)];
                item.Units += toAddIngredient.UnitTypeId === item.UnitTypeId ? toAddIngredient.Units : 0;
            } else {
                ingredients.push(toAddIngredient);
            }
        }
        else {
            warning("Created a temporary grocery list!");

            ingredients.push(toAddIngredient);
        }

        var value = ingredients.map(i => `${i.IngredientId}, ${i.Units}, ${i.UnitTypeId}`).join(' | ');

        setCookie(cookieName, value);

        success(`Added ${toAddIngredient.Units} ${toAddIngredient.UnitType.Name} of ${toAddIngredient.Ingredient.Name} to the grocery list!`);

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
                                { id: 'amount', label: 'Missing Amount', minWidth: 50 },
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
                    <Button variant="outlined" onClick={() => addIngredients(selectedItem.item.RequirementsList)} style={{ color: 'forestgreen', borderColor: 'forestgreen', marginTop: '1rem', marginRight: '20px' }}>
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />Add All
                    </Button>
                    <Button variant="outlined" onClick={closeItemDialog} style={{ color: 'red', borderColor: 'red', marginTop: '1rem' }}>Cancel</Button>
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
                            Missing Amount: {selectedIngredient.item.Units} {selectedIngredient.item.UnitType?.Name}
                        </Grid>
                    </Grid>
                    <Button variant="outlined" onClick={() => addIngredient(selectedIngredient.item)} style={{ color: 'forestgreen', borderColor: 'forestgreen', marginTop: '1rem', marginRight: '20px' }}>
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />Add
                    </Button>
                    <Button variant="outlined" onClick={closeIngredientDialog} style={{ color: 'red', borderColor: 'red', marginTop: '1rem' }}>Cancel</Button>
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
                                { id: 'amount', label: 'Missing Amount', minWidth: 50 },
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
            <Grid item xs={4} style={{ borderLeft: 'solid 1px', marginLeft: '5px', padding: '5px', overflow: 'auto', justifyContent: 'center' }}>
                <Grid container direction="row" style={{ marginBottom: '8px', display: 'flex', alignContent: 'center' }}><Typography variant="h5">Filters</Typography></Grid>
                <Grid container style={{ padding: '3px', display: 'flex', alignContent: 'center', justifyContent: 'center', marginBottom: '2px' }}>
                    <Grid container direction="row" style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>Showing:</Grid>
                    <Grid container direction="row" style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                        <Button variant="outlined" onClick={() => setListState(recipeListState => recipeListState === 1 ? 0 : 1)}
                            style={{ width: '100%', color: listState === 1 ? "#ffbb00" : "forestgreen", borderColor: listState === 1 ? "#ffbb00" : "forestgreen" }}>
                            {listState === 1 ? "Recipes" : "Ingredients"}
                            <FontAwesomeIcon icon={faSync} style={{ marginLeft: '5px' }} />
                        </Button>
                    </Grid>
                </Grid>

                <Grid style={{ padding: '3px', display: 'flex', alignContent: 'center', justifyContent: 'center', width: '100%' }}>
                    <UserInputComponent
                        defaultValue={filterOptions.name}
                        name="search by name"
                        onChange={(value) => setFilterOptions(filterOptions => { return { ...filterOptions, ...{ name: value } }; })}
                    />
                </Grid>
                <Grid container style={{ padding: '3px', display: 'flex', alignContent: 'center', justifyContent: 'center', width: '100%' }}>
                    <Grid container direction="row" style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>Categories:</Grid>
                    <Grid container direction="row" style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', width: '100%' }}>
                        <UserMultiSelectInputComponent
                            name="select categories"
                            defaultValue={filterOptions.categories}
                            options={categories.map(category => { return { name: category.Name, value: category.CountId }; })}
                            onChange={(values) => setFilterOptions(filterOptions => { return { ...filterOptions, ...{ categories: values } }; })}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Link to="/kitchen/index" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" style={{ color: 'forestgreen', borderColor: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} /> Back to Kitchen</Button>
            </Link>
        </Grid>
    );
};

export { WhatToBuyPage };