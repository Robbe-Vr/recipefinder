import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Thumbnail } from "../Global/Thumbnail";
import { RowActions } from "../Global/RowActions";
import { Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import { UserInputComponent } from "../Global/UserInputComponent";
import { RecipeList } from "./RecipeList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCross, faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
import { Recipe, RecipeCategory } from "../../models";
import { UserMultiSelectInputComponent } from "../Global/UserMultiSelectInputComponent";

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
            if (recipes === "Error") { return; }
        
            setRecipes(recipes);
        });
    }, [Api.Recipes, userId, recipeListState]);

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
            if (categories === "Error") { return; }
        
            setCategories(categories);
        });
    }, [Api.RecipeCategories]);

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
            <Dialog open={removeItem.dialogOpened} onClose={() => setRemoveItem(removeItem => { removeItem.dialogOpened = false; return removeItem })}>
                <DialogTitle>Remove item {removeItem.item.Name}</DialogTitle>
                <DialogContent>
                    Are you sure you want to remove this recipe: {removeItem.item.Name} ?<br />
                    <Button onClick={() => onRemove(removeItem.item.CountId)} style={{ backgroundColor: 'red', marginRight: '1rem', marginTop: '1rem' }}><FontAwesomeIcon icon={faCross} style={{ marginRight: '5px' }}/> Remove</Button>
                    <Button onClick={() => ToggleRemove(removeItem.item.CountId)} style={{ backgroundColor: 'forestgreen', marginTop: '1rem' }}>Cancel</Button>
                </DialogContent>
            </Dialog>
            <Grid item xs={7}>
                <Typography className={classes.txt} variant="h3">
                    {recipeListState === 0 ? "Custom" : recipeListState === 1 ? "Preparable" : "Full"} Recipe Book
                </Typography>

                {
                    isCook && recipeListState === 0 ?
                        <Grid>
                            <Link to={"/recipebook/custom/create"}>
                                <Button variant="outlined" style={{ marginTop: "20px", color: 'green' }}><FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} /> Add Custom Recipe</Button>
                            </Link>
                        </Grid>
                        : <></>
                }
                {recipes.length < 1 ?
                    "No recipes found." :
                    <RecipeList
                        columns={(() => {
                            var columns = [
                                { id: 'image', label: '', minWidth: 50 },
                                { id: 'name', label: 'Name', minWidth: 150 },
                                { id: 'category', label: 'Category', minWidth: 100 },
                                { id: 'actions', label: 'Actions', minWidth: 200 },
                            ];

                            if (isCook && recipeListState === 0) {
                                columns.push({ id: 'public', label: 'Public', minWidth: 50 });
                            }

                            return columns;
                        })()}
                        rows={recipes.filter(r => filter(r)).map(recipe => {
                            var row = {
                                id: recipe.Id,
                                image: <Thumbnail source={recipe.ImageLocation} size={50} />,
                                name: recipe.Name,
                                actions: isCook && recipeListState === 0 ? <RowActions rowEntity={recipe} rowEntityId={recipe.Id} onDetails={onDetails} onEdit={onEdit} onRemove={() => ToggleRemove(recipe.CountId)} />
                                    : <RowActions rowEntity={recipe} rowEntityId={recipe.Id} onDetails={onDetails} />,
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
                            style={{ width: '80%', backgroundColor: recipeListState === 0 ? "orange" : recipeListState === 1 ? "#ffbb00" : "green" }}>
                            {recipeListState === 0 ? "Your Custom Recipes" : recipeListState === 1 ? "Recipes You Can Prepare" : "All Recipes"}
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
        </Grid>
    );
};

export { RecipeBookHomePage };