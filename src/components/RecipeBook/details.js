import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import { EntityList } from "../Global/EntityList";
import { Recipe } from "../../models";
import { Card } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCross } from "@fortawesome/free-solid-svg-icons";

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
}));

export default function RecipeDetailsPage({ setTitle, Api }) {
    useEffect(() => {
        setTitle && setTitle("Recipe Details");
    });

    const { recipeId } = useParams();

    const [recipeDetails, setRecipeDetails] = useState(new Recipe());

    useEffect(() => {
        Api.Recipes.GetById(recipeId).then((recipe) => {
            if (recipe === "Error") { return; }
        
            setRecipeDetails(recipe);
        });
    }, [Api.Recipes, recipeId]);

    const classes = useStyles();

    return (
        <div className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                {recipeDetails.Name} Details
            </Typography>
            <div>
                <Typography>
                    Name: {recipeDetails.Name}
                </Typography>
                <Typography>
                    Created by: {recipeDetails.User.Name}
                </Typography>
                <Typography>
                    Categories: {recipeDetails.Categories.map(cat => <Card variant="outlined" style={{ margin: '1rem', padding: '5px' }}>{cat.Name}</Card>)}
                </Typography>
            </div>
        </div>
    );
};