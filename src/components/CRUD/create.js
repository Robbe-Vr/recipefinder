import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button, Typography } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faPlus } from "@fortawesome/free-solid-svg-icons";

import CRUDPagesInfo from "../../API/CRUDPagesInfo";
import { Ingredient, IngredientCategory, Recipe, RecipeCategory, UnitType } from "../../models";
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

    }
}));

export default function CRUDCreatePage({ setTitle, Api, TableName, DisplayName }) {
    useEffect(() => {
        setTitle && setTitle(DisplayName + " CRUD Create");
    });

    const { error, success } =  useNotifications();

    const history = useHistory();

    const [item, setItem] = useState(TableName === "Recipes" ? new Recipe() :
                                     TableName === "Ingredients" ? new Ingredient() :
                                     TableName === "UnitTypes" ? new UnitType() :
                                     TableName === "RecipeCategories" ? new RecipeCategory() :
                                     TableName === "IngredientCategory" ? new IngredientCategory() :
                                     null);

    const [unitTypes, setUnitTypes] = useState([new UnitType()]);
    if (unitTypes.length === 1 && unitTypes[0].CountId === -1) {
        unitTypes.pop();
    }

    useEffect(() => {
        Api.UnitTypes.GetAll().then((items) => {
            if (typeof items === "string") {
                error(items);

                return;
            }
        
            setUnitTypes(items);
        });
    }, [Api.UnitTypes, error]);

    const [ingredients, setIngredients] = useState([new Ingredient()]);
    if (ingredients.length === 1 && ingredients[0].CountId === -1) {
        ingredients.pop();
    }

    useEffect(() => {
        Api.Ingredients.GetAll().then((items) => {
            if (typeof items === "string") {
                error(items);

                return;
            }
        
            setIngredients(items);
        });
    }, [Api.Ingredients, error]);

    const [ingredientCategories, setIngredientCategories] = useState([new IngredientCategory()]);
    if (ingredientCategories.length === 1 && ingredientCategories[0].CountId === -1) {
        ingredientCategories.pop();
    }

    useEffect(() => {
        Api.IngredientCategories.GetAll().then((items) => {
            if (typeof items === "string") {
                error(items);

                return;
            }
        
            setIngredientCategories(items);
        });
    }, [Api.IngredientCategories, error]);

    const [recipeCategories, setRecipeCategories] = useState([new RecipeCategory()]);
    if (recipeCategories.length === 1 && recipeCategories[0].CountId === -1) {
        recipeCategories.pop();
    }

    useEffect(() => {
        Api.RecipeCategories.GetAll().then((items) => {
            if (typeof items === "string") {
                error(items);

                return;
            }
        
            setRecipeCategories(items);
        });
    }, [Api.RecipeCategories, error]);

    const classes = useStyles();

    const onItemEdited = (update) => {
        setItem({
            ...item,
            ...update,
        });
    }

    const [errors, setErrors] = useState([]);
    useEffect(() => {
        for (var errorMsg in errors) {
            error(errorMsg);
        }
    }, [errors, error]);

    const onCreate = () => {
        var validation = item.Validate();

        if (Array.isArray(validation)) {
            validation.forEach((validationError) => {
                error(validationError.message);
            });

            setErrors(validation);

            return;
        }

        if (TableName === "Recipes") {
            var correctedRecipe = { ...item };

            correctedRecipe.RequirementsList = {
                Ingredients: item.RequirementsList,
                RecipeId: item.Id,
            };

            Api[TableName].Create(correctedRecipe).then((res) => {
                if (typeof res === "string") {
                    error(res);
                } else if (typeof res.data === "string") {
                    error(res.data);
                } else if (typeof res.data?.Message === "string") {
                    error(res.data.Message);
                } else {
                    
                    success("Recipe created successfully!");

                    history.push(`/${TableName}/index`);
                }
            });
        }
        else {
            Api[TableName].Create(item).then((res) => {
                if (typeof res === "string") {
                    error(res);
                } else if (typeof res.data === "string") {
                    error(res.data);
                } else if (typeof res.data?.Message === "string") {
                    error(res.data.Message);
                } else {
                    
                    success(DisplayName + " item created successfully!");

                    history.push(`/${TableName}/index`);
                }
            });
        }
    };

    const CRUDInfo = CRUDPagesInfo.Pages[TableName];

    const [preparationStepsOpen, setPreparationStepsOpen] = useState(false);
    const [requirementsListOpen, setRequirementsListOpen] = useState(false);

    return (
        <Grid container direction="row" className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                {DisplayName} CRUD Create
            </Typography>
            <Grid container direction="row" style={{ borderBottom: 'solid 1px', marginBottom: '10px', padding: '5px', width: '80%' }}>
                {
                    CRUDInfo.getEditPage(null, { unitTypes, ingredients, ingredientCategories, recipeCategories },
                        onItemEdited, Api, { preparationStepsOpen, setPreparationStepsOpen, requirementsListOpen, setRequirementsListOpen,
                                             preparationStepsCount: item?.PreparationSteps?.split('{NEXT}').length ?? item?.PreparationSteps?.split('{NEXT}').length,
                                             requirementsCount: item?.RequirementsList?.length })
                }
                <Grid style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="outlined" onClick={onCreate} style={{ color: 'forestgreen', borderColor: 'forestgreen' }}><FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />Create</Button>
                </Grid>
            </Grid>
            <Link to={`/${TableName}/index`} style={{ textDecoration: 'none' }}>
                <Button variant="outlined" style={{ color: 'forestgreen', borderColor: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} />Back to {DisplayName}</Button>
            </Link>
        </Grid>
    );
};