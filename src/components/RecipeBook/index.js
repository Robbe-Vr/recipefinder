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
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Recipe } from "../../models";

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

function RecipeBookHomePage({ setTitle, userId, Api }) {
    useEffect(() => {
        setTitle && setTitle("RecipeBook");
    });

    const history = useHistory();
    
    const [recipes, setRecipes] = useState([new Recipe()]);
    if (recipes.length === 1 && recipes[0].Id === '')
    {
        recipes.pop();
    }

    const classes = useStyles();

    useEffect(() => {
        Api.Recipes.GetAll().then((recipes) => {
            if (recipes === "Error") { return; }
        
            setRecipes(recipes);
        });
    }, [Api.Recipes]);

    const onDetails = (recipeId) => {
        history.push('/recipebook/details/' + recipeId);
    };

    return (
        <Grid className={classes.form}>
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
                    rows={recipes.map(recipe => {
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
    );
};

export { RecipeBookHomePage };