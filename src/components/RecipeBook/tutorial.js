import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import { Recipe } from "../../models";
import { Button, Grid, Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faList, faVideo } from "@fortawesome/free-solid-svg-icons";

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
    useEffect(() => {
        setTitle && setTitle("Recipe Tutorial");
    });

    const { recipeId } = useParams();

    const [recipe, setRecipe] = useState(new Recipe());

    useEffect(() => {
        Api.Recipes.GetById(recipeId).then((recipe) => {
            if (recipe === "Error") { return; }
        
            setRecipe(recipe);
        });
    }, [Api.Recipes, recipeId]);

    const [tutorialMode, setTutorialMode] = useState(0);

    const classes = useStyles();

    return (
        <div className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                {recipe.Name} Tutorial
            </Typography>
            <Grid container direction="row" style={{ borderBottom: 'solid 1px', paddingbottom: '15px' }}>
                <Button variant="outlined" onClick={() => setTutorialMode(0)}><FontAwesomeIcon icon={faList} style={{ marginRight: '5px' }} />Preparation Steps</Button>
                {recipe.VideoTutorialLink ? <Button onClick={() => setTutorialMode(1)}><FontAwesomeIcon icon={faVideo} style={{ marginRight: '5px' }} />Video Tutorial</Button> : <></>}
            </Grid>
            <Grid container direction="row" style={{ paddingTop: '15px', paddingLeft: '10px' }}>
                {
                    tutorialMode === 0 ?
                        <Grid container direction="row">
                            <Table>
                                <TableBody>
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
                        :
                        <Grid container style={{ justifyContent: 'center', alignContent: 'center' }}>
                            <iframe title={`Tutorial for ${recipe.Name}`} src={recipe.VideoTutorialLink} style={{ width: '90%', height: '90%' }}/>
                        </Grid>
                }
            </Grid>
            <Link to="/recipebook/index">
                <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} /> Back to Recipes</Button>
            </Link>
        </div>
    );
};