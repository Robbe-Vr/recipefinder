import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Thumbnail } from "../Global/Thumbnail";
import { RowActions } from "../Global/RowActions";
import { Grid } from "@material-ui/core";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserSelectInputComponent } from "../Global/UserSelectInputComponent";
import { RecipeList } from "./RecipeList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
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
            <Grid item xs={7}>
                <Typography className={classes.txt} variant="h3">
                    Recipe Book
                </Typography>

                {recipes.length < 1 ?
                    "No recipes found." :
                    <RecipeList
                        columns={[
                            { id: 'image', label: '', minWidth: 50 },
                            { id: 'name', label: 'Name', minWidth: 150 },
                            { id: 'category', label: 'Category', minWidth: 100 },
                            { id: 'actions', label: 'Actions', minWidth: 200 },
                        ]}
                        rows={recipes.filter(r => filter(r)).map(recipe => {
                            return {
                                id: recipe.Id,
                                image: <Thumbnail source={recipe.ImageLocation} size="50px" />,
                                name: recipe.Name,
                                actions: <RowActions rowEntity={recipe} rowEntityId={recipe.Id} onDetails={onDetails} />,
                            };
                        })}
                    />
                }
            </Grid>
            <Grid item xs={4}>
                Showing:
                <Button variant="outlined" onClick={() => setRecipeListState(recipeListState => recipeListState + 1 > 2 ? (isCook ? 0 : 1) : recipeListState + 1)}
                    style={{ backgroundColor: recipeListState === 0 ? "orange" : recipeListState === 1 ? "#ffbb00" : "green" }}>
                    {recipeListState === 0 ? "Your Custom Recipes" : recipeListState === 1 ? "Recipes You Can Prepare" : "All Recipes"}
                    <FontAwesomeIcon icon={faSync} style={{ marginLeft: '5px' }} />
                </Button>

                <UserInputComponent
                    defaultValue={filterOptions.name}
                    name="search by name"
                    onChange={(value) => setFilterOptions(filterOptions => { return { ...filterOptions, ...{ name: value } }; })}
                />

                <UserMultiSelectInputComponent
                    name="select categories"
                    defaultValue={filterOptions.categories}
                    options={categories.map(category => { return { name: category.Name, value: category.CountId }; })}
                    onChange={(values) => setFilterOptions(filterOptions => { return { ...filterOptions, ...{ categories: values } }; })}
                />
            </Grid>
        </Grid>
    );
};

export { RecipeBookHomePage };