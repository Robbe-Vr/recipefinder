import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

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
import { faBackward } from "@fortawesome/free-solid-svg-icons";
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

export default function CreateRecipePage({ setTitle, Api }) {
    const { error, success } =  useNotifications();

    useEffect(() => {
        setTitle && setTitle("Create Custom Recipe");
    });

    const history = useHistory();

    const [recipe, setRecipe] = useState(new Recipe());

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

        Api.Recipes.Create(correctedRecipe).then((res) => {
            if (typeof res === "string") {
                error(res);
            } else if (typeof res.data === "string") {
                error(res.data);
            } else if (typeof res.data?.Message === "string") {
                error(res.data.Message);
            } else {
                
                success("Recipe created successfully!");

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
                        onChange={(value) => { onRecipeEdited({ PreparationSteps: value }); }}
                    />
                </DialogContent>
            </Dialog>
            <Dialog open={requirementsListOpen} onClose={() => setRequirementsListOpen(false)}>
                <DialogTitle>RequirementsList</DialogTitle>
                <DialogContent>
                    <RequirementsInputComponent
                        Api={Api}
                        parentRecipe={recipe}
                        onChange={(value) => { onRecipeEdited({ RequirementsList: value }); }}
                    />
                </DialogContent>
            </Dialog>
            <Typography className={classes.txt} variant="h2">
                Create Custom Recipe
            </Typography>
            <Grid style={{  borderBottom: 'solid 1px', marginBottom: '10px', padding: '5px' }}>
                <Grid className={classes.inputComponent}>
                    <UserInputComponent
                        name="Name"
                        onChange={(value) => onRecipeEdited({ Name: value })}
                    />
                </Grid>
                <Grid className={classes.inputComponent}>
                    <UserInputComponent
                        name="Description"
                        onChange={(value) => { onRecipeEdited({ Description: value }); }}
                    />
                </Grid>
                <Grid className={classes.inputComponent}>
                    <UserInputComponent
                        name="Image"
                        onChange={(value) => onRecipeEdited({ ImageLocation: value })}
                    />
                </Grid>
                <Grid className={classes.inputComponent}>
                    <UserInputComponent
                        name="Tutorial Video"
                        onChange={(value) => onRecipeEdited({ VideoTutorialLink: value })}
                    />
                </Grid>
                <Grid className={classes.inputComponent}>
                    <Button variant="outlined" onClick={() => setPreparationStepsOpen(true)}>
                        {recipe.PreparationSteps.split('{NEXT}').length} Steps
                    </Button>
                </Grid>
                <Grid className={classes.inputComponent}>
                    <Button variant="outlined" onClick={() => setRequirementsListOpen(true)}>
                        {recipe.RequirementsList.length} Requirements
                    </Button>
                </Grid>
                <Grid className={classes.inputComponent}>
                    <UserSelectInputComponent
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
                        name="Categories"
                        options={categories.map(category => { return { name: category.Name, value: category.CountId }; })}
                        onChange={(values) => onRecipeEdited({ Categories: values })}
                    />
                </Grid>
                <Grid className={classes.inputComponent}>
                    <Button onClick={onCreate} style={{ backgroundColor: 'forestgreen' }}>Save</Button>
                </Grid>
            </Grid>
            <Link to="/recipebook/custom/index">
                <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} /> Back to Recipes</Button>
            </Link>
        </Grid>
    );
};