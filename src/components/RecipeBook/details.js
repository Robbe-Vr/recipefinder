import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Card, Grid, Typography } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

import { Recipe } from "../../models";
import { useNotifications } from "../Global/NotificationContext";

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
    const { error } =  useNotifications();

    useEffect(() => {
        setTitle && setTitle("Recipe Details");
    });

    const history = useHistory();

    const { recipeId } = useParams();

    const [recipeDetails, setRecipeDetails] = useState(new Recipe());

    useEffect(() => {
        Api.Recipes.GetById(recipeId).then((recipe) => {
            if (typeof recipe === "string") {
                error(recipe);
                return;
            }
        
            setRecipeDetails(recipe);
        });
    }, [Api.Recipes, recipeId, error]);

    const classes = useStyles();

    const onTutorial = () => {
        history.push(`/recipebook/tutorial/${recipeId}`);
    };

    return (
        <Grid className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                {recipeDetails.Name} Details
            </Typography>
            <Grid style={{  borderBottom: 'solid 1px', marginBottom: '10px', padding: '5px' }}>
                <Typography>
                    Name: {recipeDetails.Name}
                </Typography>
                <Typography>
                    Created by: {recipeDetails.User?.Name}
                </Typography>
                <Typography>
                    Categories:
                </Typography>
                    {recipeDetails.Categories.map(cat =>
                        <Card key={`${cat.Name}-${cat.CountId}`} variant="outlined" style={{ margin: '2px', padding: '5px' }}>{cat.Name}</Card>
                    )}
                <Typography>
                    Requirements:
                </Typography>
                    {recipeDetails.RequirementsList.map((requirement) =>
                        <Card key={requirement.CountId} style={{ margin: '2px', padding: '3px' }}>
                            {requirement.Ingredient.Name} - {requirement.Units} {requirement.UnitType.Name}
                        </Card>
                    )}
                <Button variant="outlined" onClick={onTutorial} style={{ marginTop: '15px' }}>View Tutorial</Button>
            </Grid>
            <Link to="/recipebook/index" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" style={{ color: 'forestgreen', borderColor: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} />Back to Recipes</Button>
            </Link>
        </Grid>
    );
};