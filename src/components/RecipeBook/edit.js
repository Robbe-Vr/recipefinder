import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";

import { UserInputComponent } from "../Global/UserInputComponent";
import { UserMultiSelectInputComponent } from "../Global/UserMultiSelectInputComponent";
import { Recipe, RecipeCategory } from "../../models";
import { UserSelectInputComponent } from "../Global/UserSelectInputComponent";
import { Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import { PreparationStepsInputComponent } from "./preparationStepsInputComponent";
import { RequirementsInputComponent } from "./RequirementsInputComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faSave } from "@fortawesome/free-solid-svg-icons";
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
    errorTxt: { textAlign: "center", color: "#ff0000" },
    form: {

    },
    inputComponent: {
        marginBottom: '15px',
    }
}));

export default function EditRecipePage({ setTitle, Api }) {
    const { error, success } =  useNotifications();

    useEffect(() => {
        setTitle && setTitle("Edit Recipe");
    });

    const history = useHistory();

    const { recipeId } = useParams();

    const [currentRecipe, setCurrentRecipe] = useState(new Recipe());

    const [updateRecipe, setUpdateRecipe] = useState(new Recipe());

    useEffect(() => {
        Api.Recipes.GetById(recipeId).then((recipe) => {
            if (typeof recipe === "string") {
                error(recipe);
                return;
            }
        
            setCurrentRecipe(recipe);
            setUpdateRecipe(recipe);
        });
    }, [Api.Recipes, recipeId, error]);

    const [categories, setCategories] = useState([new RecipeCategory()]);

    useEffect(() => {
        Api.RecipeCategories.GetAll().then((categories) => {
            if (typeof categories === "string") {
                error(categories);
                return;
            }
        
            setCategories(categories);
        });
    }, [Api.RecipeCategories, error]);

    const classes = useStyles();

    const onRecipeEdited = (update) => {
        setUpdateRecipe({
            ...updateRecipe,
            ...update,
        });
    }

    const [errors, setErrors] = useState([]);
    useEffect(() => {
        for (var errorMsg in errors) {
            error(errorMsg);
        }
    }, [errors, error]);

    const onEdit = () => {
        var validation = updateRecipe.Validate();

        if (Array.isArray(validation)) {
            validation.forEach((validationError) => {
                error(validationError.message);
            });

            setErrors(validation);

            return;
        }

        var correctedRecipe = { ...updateRecipe };

        correctedRecipe.RequirementsList = {
            Ingredients: updateRecipe.RequirementsList,
            RecipeId: updateRecipe.Id,
        };

        Api.Recipes.Update(recipeId, correctedRecipe).then((res) => {
            if (typeof res === "string") {
                error(res);
            } else if (typeof res.data === "string") {
                error(res.data);
            } else if (typeof res.data?.Message === "string") {
                error(res.data.Message);
            } else {
                
                success("Recipe edited successfully!");

                history.push('/recipebook/custom/index');
            }
        });
    };

    const [preparationStepsOpen, setPreparationStepsOpen] = useState(false);
    const [requirementsListOpen, setRequirementsListOpen] = useState(false);

    return (
        <Grid className={classes.paper}>
            <Dialog open={preparationStepsOpen} onClose={() => setPreparationStepsOpen(false)}>
                <DialogTitle>Preparation Steps</DialogTitle>
                <DialogContent>
                    <PreparationStepsInputComponent
                        name="Preparation Step"
                        defaultValue={currentRecipe.PreparationSteps}
                        onChange={(value) => { onRecipeEdited({ PreparationSteps: value }); }}
                    />
                </DialogContent>
            </Dialog>
            <Dialog open={requirementsListOpen} onClose={() => setRequirementsListOpen(false)}>
                <DialogTitle>RequirementsList</DialogTitle>
                <DialogContent>
                    <RequirementsInputComponent
                        Api={Api}
                        defaultValues={currentRecipe.RequirementsList}
                        parentRecipe={updateRecipe}
                        onChange={(value) => { onRecipeEdited({ RequirementsList: value }); }}
                    />
                </DialogContent>
            </Dialog>
            <Typography className={classes.txt} variant="h2">
                Edit Recipe:<br />{currentRecipe.Name}
            </Typography>
            <Grid style={{  borderBottom: 'solid 1px', marginBottom: '10px', padding: '5px', width: '80%' }}>
                <Grid className={classes.inputComponent}>
                    <UserInputComponent
                        defaultValue={currentRecipe.Name}
                        name="Name"
                        onChange={(value) => onRecipeEdited({ Name: value })}
                    />
                </Grid>
                <Grid className={classes.inputComponent}>
                    <UserInputComponent
                        name="Description"
                        defaultValue={currentRecipe?.Description}
                        onChange={(value) => { onRecipeEdited({ Description: value }); }}
                    />
                </Grid>
                <Grid className={classes.inputComponent}>
                    <UserInputComponent
                        defaultValue={currentRecipe.ImageLocation}
                        name="Image"
                        onChange={(value) => onRecipeEdited({ ImageLocation: value })}
                    />
                </Grid>
                <Grid className={classes.inputComponent}>
                    <UserInputComponent
                        defaultValue={currentRecipe.VideoTutorialLink}
                        name="Tutorial Video"
                        onChange={(value) => onRecipeEdited({ VideoTutorialLink: value })}
                    />
                </Grid>
                <Grid className={classes.inputComponent}>
                    <Button style={{ width: '100%' }} variant="outlined" onClick={() => setPreparationStepsOpen(true)}>
                        {updateRecipe.PreparationSteps.split('{NEXT}').length} Steps
                    </Button>
                </Grid>
                <Grid className={classes.inputComponent}>
                    <Button style={{ width: '100%' }} variant="outlined" onClick={() => setRequirementsListOpen(true)}>
                        {updateRecipe.RequirementsList.length} Requirements
                    </Button>
                </Grid>
                <Grid className={classes.inputComponent}>
                    <UserSelectInputComponent
                        defaultValue={currentRecipe.IsPublic}
                        Name={"Public?"}
                        options={[
                            { name: "Public", value: true },
                            { name: "Private", value: false },
                        ]}
                        onChange={(value) => { onRecipeEdited({ IsPublic: value }) }}
                    />
                </Grid>
                <Grid className={classes.inputComponent}>
                    <UserMultiSelectInputComponent
                        defaultValues={currentRecipe.Categories.map(category => category.CountId)}
                        name="Categories"
                        options={categories.map(category => { return { name: category.Name, value: category.CountId }; })}
                        onChange={(values) => onRecipeEdited({ Categories: values })}
                    />
                </Grid>
                <Grid className={classes.inputComponent} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="outlined" onClick={onEdit} style={{ color: 'forestgreen', borderColor: 'forestgreen' }}><FontAwesomeIcon icon={faSave} style={{ marginRight: '5px' }} />Save</Button>
                </Grid>
            </Grid>
            <Link to="/recipebook/custom/index" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" style={{ color: 'forestgreen', borderColor: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} />Back to Recipes</Button>
            </Link>
        </Grid>
    );
};