import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
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

export default function EditRecipePage({ setTitle, Api }) {
    useEffect(() => {
        setTitle && setTitle("Edit Recipe");
    });

    const { recipeId } = useParams();

    const [currentRecipe, setCurrentRecipe] = useState(new Recipe());

    const [updateRecipe, setUpdateRecipe] = useState(new Recipe());
    const [categories, setCategories] = useState([new RecipeCategory()]);

    useEffect(() => {
        Api.Recipes.GetById(recipeId).then((recipe) => {
            if (recipe === "Error") { return; }
        
            setCurrentRecipe(recipe);
            setUpdateRecipe(recipe);
        });
    }, [Api.Recipes, recipeId]);

    const classes = useStyles();

    const onRecipeEdited = (update) => {
        setUpdateRecipe({
            ...updateRecipe,
            ...update,
        });
    }

    const onEdit = () => {
        Api.Recipes.Update(updateRecipe);
    };

    return (
        <div className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                Edit {currentRecipe.Name}
            </Typography>
            <div>
                <UserInputComponent
                    
                    defaultValue={currentRecipe.Name}
                    name="Name"
                    onChange={(value) => onRecipeEdited({ Name: value })}
                />
                <UserMultiSelectInputComponent
                    defaultValues={currentRecipe.Categories.map(category => category.Id)}
                    name="Categories"
                    options={categories.map(category => { return { name: category.Name, value: category.Id }; })}
                    onChange={(values) => onRecipeEdited({ Category: values })}
                />
                <Button onClick={onEdit} style={{ backgroundColor: 'forestgreen' }}>Save</Button>
            </div>
        </div>
    );
};