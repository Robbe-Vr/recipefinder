import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Dialog, DialogContent, DialogTitle, Grid, Button, Typography, Card } from "@material-ui/core";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSync, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Thumbnail } from "../Global/Thumbnail";
import { RowActions } from "../Global/RowActions";
import { UserInputComponent } from "../Global/UserInputComponent";
import { EntityList } from "../Global/EntityList";
import { UserMultiSelectInputComponent } from "../Global/UserMultiSelectInputComponent";

import { Recipe, RecipeCategory } from "../../models";
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

function RecipeBookHomePage({ setTitle, isCook, userId, Api, defaultRecipeListState = 1 }) {
    const { error } =  useNotifications();

    useEffect(() => {
        setTitle && setTitle("RecipeBook");
    });

    const history = useHistory();

    const [recipeListState, setRecipeListState] = useState(defaultRecipeListState);
    
    const [recipes, setRecipes] = useState([new Recipe()]);
    if (recipes.length === 1 && recipes[0].CountId === -1)
    {
        recipes.pop();
    }

    useEffect(() => {
        (recipeListState === 0 ? Api.Recipes.GetAllFromCook(userId) :
        recipeListState === 1 ? Api.Recipes.GetPreparableForUser(userId) :
        Api.Recipes.GetAll()).then((recipes) => {
            if (typeof recipes === "string") {
                error(recipes);
                return;
            }
        
            setRecipes(recipes);
        });
    }, [Api.Recipes, userId, recipeListState, error]);

    const onDetails = (recipeId) => {
        history.push('/recipebook/details/' + recipeId);
    };

    const onEdit = (recipeId) => {
        history.push('/recipebook/custom/edit/' + recipeId);
    };

    const [removeItem, setRemoveItem] = useState({ item: {}, dialogOpened: false });

    const ToggleRemove = (recipeId) => {
        const item = recipes.find(x => x.CountId === recipeId);

        if (item) {
            setRemoveItem({ item: item, dialogOpened: !removeItem.dialogOpened });
        }
        else {
            console.log(`No item found with key '${recipeId}'!`);
        }
    };

    const onRemove = (recipeId) => {
        Api.Recipes.Delete(recipeId);
    };

    const classes = useStyles();

    const [categories, setCategories] = useState([new RecipeCategory()]);
    if (categories.length === 1 && categories[0].CountId === -1)
    {
        categories.pop();
    }

    useEffect(() => {
        Api.RecipeCategories.GetAll().then((categories) => {
            if (typeof categories === "string") {
                error(categories);
                return;
            }
        
            setCategories(categories);
        });
    }, [Api.RecipeCategories, error]);

    const [filterOptions, setFilterOptions] = useState({ name: '', categories: [] });

    const filter = (recipe = new Recipe()) => {
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

    return (
        <Grid
            container
            direction="row"
        >
            <Dialog open={removeItem.dialogOpened} onClose={() => ToggleRemove(removeItem.item.CountId)}>
                <DialogTitle>Remove item {removeItem.item.Name}</DialogTitle>
                <DialogContent>
                    Are you sure you want to remove this recipe: {removeItem.item.Name} ?<br />
                    <Button variant="outlined" onClick={() => onRemove(removeItem.item.CountId)} style={{ color: 'red', borderColor: 'red', marginRight: '1rem', marginTop: '1rem' }}><FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px' }}/>Remove</Button>
                    <Button variant="outlined" onClick={() => ToggleRemove(removeItem.item.CountId)} style={{ color: 'forestgreen', borderColor: 'forestgreen', marginTop: '1rem' }}><FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }}/>Cancel</Button>
                </DialogContent>
            </Dialog>
            <Grid item xs={7}>
                <Typography className={classes.txt} variant="h3">
                    {recipeListState === 0 ? "Custom" : recipeListState === 1 ? "Preparable" : "Full"} Recipe Book
                </Typography>

                {
                    isCook && recipeListState === 0 ?
                        <Grid>
                            <Link to="/recipebook/custom/create" style={{ textDecoration: 'none' }}>
                                <Button variant="outlined" style={{ marginTop: "20px", color: 'forestgreen', borderColor: 'forestgreen' }}><FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />Add Custom Recipe</Button>
                            </Link>
                        </Grid>
                        : <></>
                }
                {recipes.length < 1 ?
                    "No recipes found." :
                    <EntityList
                        columns={(() => {
                            var columns = [
                                { id: 'image', label: '', minWidth: 50 },
                                { id: 'name', label: 'Name', minWidth: 150 },
                                { id: 'category', label: 'Category', minWidth: 100 },
                            ];

                            if (isCook && recipeListState === 0) {
                                columns.push({ id: 'public', label: 'Public', minWidth: 50 });
                            }

                            columns.push({ id: 'actions', label: '', minWidth: 200 });

                            return columns;
                        })()}
                        rows={recipes.filter(r => filter(r)).map(recipe => {
                            var row = {
                                id: recipe.Id,
                                image: <Thumbnail source={recipe.ImageLocation} size={50} />,
                                name: recipe.Name,
                                category: recipe.Categories.map(category => <Card key={category.CountId} variant="outlined" style={{ margin: '2px', padding: '5px' }}>{category.Name}</Card>),
                                actions: isCook && recipeListState === 0 ? <RowActions rowEntity={recipe} rowEntityId={recipe.Id} onDetails={onDetails} onEdit={onEdit} onRemove={() => ToggleRemove(recipe.CountId)} />
                                    : <RowActions rowEntity={recipe} rowEntityId={recipe.Id} onDetails={onDetails} />,
                                onClick: (id) => { onDetails(id); },
                            };

                            if (isCook && recipeListState === 0) {
                                row.public = recipe.IsPublic ? "Public" : "Private";
                            }

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
                        <Button variant="outlined" onClick={() => setRecipeListState(recipeListState => recipeListState + 1 > 2 ? (isCook ? 0 : 1) : recipeListState + 1)}
                            style={{ width: '100%', color: recipeListState === 0 ? "orange" : recipeListState === 1 ? "#ffbb00" : "green", borderColor: recipeListState === 0 ? "orange" : recipeListState === 1 ? "#ffbb00" : "green" }}>
                            {recipeListState === 0 ? "Your Custom Recipes" : recipeListState === 1 ? "Recipes You Can Prepare" : "All Recipes"}
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
        </Grid>
    );
};

export { RecipeBookHomePage };