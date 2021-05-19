import React, { useEffect, useState } from "react";
import {  } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserMultiSelectInputComponent } from "../Global/UserMultiSelectInputComponent";
import { Recipe, RecipeCategory } from "../../models";
import { Grid } from "@material-ui/core";

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

    const [recipe, setRecipe] = useState(new Recipe());

    const [categories, setCategories] = useState([new RecipeCategory()]);

    useEffect(() => {
        Api.RecipeCategories.GetAll().then((categories) => {
            if (categories === "Error") { return; }
        
            setCategories(categories);
        });
    }, [Api.RecipeCategories]);

    const classes = useStyles();

    const onRecipeEdited = (update) => {
        setRecipe({
            ...recipe,
            ...update,
        });
    }

    const onEdit = () => {
        var correctedRecipe = { ...recipe };

        correctedRecipe.RequirementsList = {
            Ingredients: recipe.RequirementsList,
            RecipeId: recipe.Id,
        };

        Api.Recipes.Create(correctedRecipe);
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
                        onChange={(value) => { onRecipeEdited({ Name: value }); }}
                    />
                </Grid>
                    <Grid container direction="row" style={{ marginTop: '15px' }}>
                    <UserInputComponent
                        name="Description"
                        defaultValue={recipe?.Description}
                        onChange={(value) => { onRecipeEdited({ Description: value }); }}
                    />
                </Grid>
                <UserMultiSelectInputComponent
                    name="Categories"
                    options={categories.map(category => { return { name: category.Name, value: category.Id }; })}
                    onChange={(values) => onRecipeEdited({ Category: values })}
                />
                <Button onClick={onEdit} style={{ backgroundColor: 'forestgreen' }}>Save</Button>
            </div>
        </div>
    );
};