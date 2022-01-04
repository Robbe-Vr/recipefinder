import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Table, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faList, faVideo } from "@fortawesome/free-solid-svg-icons";

import { Recipe } from "../../models";
import { useNotifications } from "../Global/NotificationContext";
import { Thumbnail } from "../Global/Thumbnail";

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

export default function RecipeTutorialPage({ setTitle, Api }) {
    const { error } =  useNotifications();

    useEffect(() => {
        setTitle && setTitle("Recipe Tutorial");
    });

    const { recipeId } = useParams();

    const [recipe, setRecipe] = useState(new Recipe());

    useEffect(() => {
        Api.Recipes.GetById(recipeId).then((recipe) => {
            if (typeof recipe === "string")  {
                error("Failed to load recipe!");
                return;
            }
        
            setRecipe(recipe);
        });
    }, [Api.Recipes, recipeId, error]);

    const [tutorialMode, setTutorialMode] = useState(0);

    const classes = useStyles();

    return (
        <div className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                {recipe.Name} Tutorial
            </Typography>
            <Grid container direction="row" style={{ borderBottom: 'solid 1px', paddingbottom: '15px' }}>
                <Button variant="outlined" style={{ backgroundColor: tutorialMode === 0 ? 'lightgrey' : 'white' }} onClick={() => setTutorialMode(0)}><FontAwesomeIcon icon={faList} style={{ marginRight: '5px' }} />Requirements</Button>
                <Button variant="outlined" style={{ backgroundColor: tutorialMode === 1 ? 'lightgrey' : 'white' }} onClick={() => setTutorialMode(1)}><FontAwesomeIcon icon={faList} style={{ marginRight: '5px' }} />Preparation Steps</Button>
                {recipe.VideoTutorialLink ? <Button variant="outlined" style={{ backgroundColor: tutorialMode === 2 ? 'lightgrey' : 'white' }} onClick={() => setTutorialMode(2)}><FontAwesomeIcon icon={faVideo} style={{ marginRight: '5px' }} />Video Tutorial</Button> : <></>}
            </Grid>
            <Grid container direction="row" style={{ paddingTop: '15px', paddingLeft: '10px' }}>
                {
                    tutorialMode === 0 ?
                        <Grid container direction="row" style={{ overflowY: 'auto', height: '80%' }}>
                            <Table style={{ height: '100%' }}>
                                <TableBody style={{ height: '100%' }}>
                                    {
                                        recipe.RequirementsList.map((requirement, index) => {
                                            return (
                                                <TableRow>
                                                    <TableCell><Thumbnail source={requirement.Ingredient.ImageLocation} size={50} /></TableCell>
                                                    <TableCell>{`${requirement.Units} ${requirement.UnitType.Name} of ${requirement.Ingredient.Name}`}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </Grid>
                    : tutorialMode === 1 ?
                        <Grid container direction="row" style={{ overflowY: 'auto', height: '80%' }}>
                            <Table style={{ height: '100%' }}>
                                <TableBody style={{ height: '100%' }}>
                                    {
                                        recipe.PreparationSteps.split('{NEXT}').map((step, index) => {
                                            return (
                                                <TableRow>
                                                    <TableCell>Step {index + 1}.</TableCell>
                                                    <TableCell>{step}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </Grid>
                    : tutorialMode === 2 ?
                        <Grid container style={{ justifyContent: 'center', alignContent: 'center' }}>
                            <iframe title={`Tutorial for ${recipe.Name}`} src={recipe.VideoTutorialLink} style={{ width: '90%', height: '90%' }}/>
                        </Grid>
                    : <></>
                }
            </Grid>
            <Link to="/recipebook/index" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" style={{ color: 'forestgreen', borderColor: 'forestgreen', marginTop: '10px' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} /> Back to Recipes</Button>
            </Link>
        </div>
    );
};