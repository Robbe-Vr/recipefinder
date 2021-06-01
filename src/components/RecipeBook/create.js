import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

import { UserInputComponent } from "../Global/UserInputComponent";
import { UserMultiSelectInputComponent } from "../Global/UserMultiSelectInputComponent";

import { Recipe, RecipeCategory } from "../../models";

const useStyles = makeStyles((theme) => ({
    paper: {
        width: "100%",
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
    },
    txt: { textAlign: "center" },
    errorTxt: { textAlign: "center", color: "#ff0000" },
    form: {

    }
}));

export default function CreateRecipePage({ setTitle, Api }) {
    useEffect(() => {
        setTitle && setTitle("Create Recipe");
    });

    const history = useHistory();

    const [recipe, setRecipe] = useState(new Recipe());

    const [categories, setCategories] = useState([new RecipeCategory()]);

    useEffect(() => {
        Api.RecipeCategories.GetAll().then((categories) => {
            if (categories === "Error") { return; }
        
            setCategories(categories);
        });
    }, [Api.RecipeCategories]);

    const classes = useStyles();

    const onRecipeValueEdited = (update) => {
        setRecipe({
            ...recipe,
            ...update,
        });
    }

    const onCreate = () => {
        var correctedRecipe = { ...recipe };

        correctedRecipe.RequirementsList = {
            Ingredients: recipe.RequirementsList,
            RecipeId: recipe.Id,
        };

        Api.Recipes.Create(correctedRecipe);

        history.push('/recipebok/custom/index');
    };

    return (
        <div className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                Create New Recipe
            </Typography>
            <div>
                <Grid container direction="row" style={{ marginTop: '15px' }}>
                    <UserInputComponent
                        name="Name"
                        defaultValue={recipe?.Name}
                        onChange={(value) => { onRecipeValueEdited({ Name: value }); }}
                    />
                </Grid>
                    <Grid container direction="row" style={{ marginTop: '15px' }}>
                    <UserInputComponent
                        name="Description"
                        defaultValue={recipe?.Description}
                        onChange={(value) => { onRecipeValueEdited({ Description: value }); }}
                    />
                </Grid>
                <UserMultiSelectInputComponent
                    name="Categories"
                    options={categories.map(category => { return { name: category.Name, value: category.Id }; })}
                    onChange={(values) => onRecipeValueEdited({ Category: values })}
                />
                <Button onClick={onCreate} style={{ backgroundColor: 'forestgreen' }}>Save</Button>
            </div>
            <Link to="/recipebook/custom/index">
                <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} /> Back to Recipes</Button>
            </Link>
        </div>
    );
};