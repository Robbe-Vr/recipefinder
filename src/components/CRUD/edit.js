import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

import CRUDPagesInfo from "../../API/CRUDPagesInfo";

import { Ingredient, IngredientCategory, RecipeCategory, UnitType } from "../../models";

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

export default function CRUDEditPage({ setTitle, Api, TableName, DisplayName }) {
    useEffect(() => {
        setTitle && setTitle(DisplayName + " CRUD Edit");
    });

    const history = useHistory();

    const { id } = useParams();

    const [currentItem, setCurrentItem] = useState({});

    const [updateItem, setUpdateItem] = useState({});

    useEffect(() => {
        Api[TableName].GetById(id).then((obj) => {
            if (obj === "Error") { return; }
        
            setCurrentItem(obj);
            setUpdateItem(obj);
        });
    }, [Api, TableName, id]);

    const [unitTypes, setUnitTypes] = useState([new UnitType()]);
    if (unitTypes.length === 1 && unitTypes[0].CountId === -1) {
        unitTypes.pop();
    }

    useEffect(() => {
        Api.UnitTypes.GetAll().then((items) => {
            if (items === "Error") { return; }
        
            setUnitTypes(items);
        });
    }, [Api.UnitTypes]);

    const [ingredients, setIngredients] = useState([new Ingredient()]);
    if (ingredients.length === 1 && ingredients[0].CountId === -1) {
        ingredients.pop();
    }

    useEffect(() => {
        Api.Ingredients.GetAll().then((items) => {
            if (items === "Error") { return; }
        
            setIngredients(items);
        });
    }, [Api.Ingredients]);

    const [ingredientCategories, setIngredientCategories] = useState([new IngredientCategory()]);
    if (ingredientCategories.length === 1 && ingredientCategories[0].CountId === -1) {
        ingredientCategories.pop();
    }

    useEffect(() => {
        Api.IngredientCategories.GetAll().then((items) => {
            if (items === "Error") { return; }
        
            setIngredientCategories(items);
        });
    }, [Api.IngredientCategories]);

    const [recipeCategories, setRecipeCategories] = useState([new RecipeCategory()]);
    if (recipeCategories.length === 1 && recipeCategories[0].CountId === -1) {
        recipeCategories.pop();
    }

    useEffect(() => {
        Api.RecipeCategories.GetAll().then((items) => {
            if (items === "Error") { return; }
        
            setRecipeCategories(items);
        });
    }, [Api.RecipeCategories]);

    const classes = useStyles();

    const onItemEdited = (update) => {
        setUpdateItem({
            ...updateItem,
            ...update,
        });
    }

    const onEdit = () => {
        if (TableName === "Recipes") {
            var correctedRecipe = { ...updateItem };

            correctedRecipe.RequirementsList = {
                Ingredients: updateItem.RequirementsList,
                RecipeId: updateItem.Id,
            };

            Api[TableName].Update(id, correctedRecipe);
        }
        else {
            Api[TableName].Update(id, updateItem);
        }

        history.push(`/${TableName}/index`);
    };

    const CRUDInfo = CRUDPagesInfo.Pages[TableName];

    const [preparationStepsOpen, setPreparationStepsOpen] = useState(false);
    const [requirementsListOpen, setRequirementsListOpen] = useState(false);

    return (
        <Grid container direction="row" className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                {DisplayName} CRUD Edit:<br />{currentItem.Name}
            </Typography>
            <Grid container direction="row" style={{  borderBottom: 'solid 1px', marginBottom: '10px', padding: '5px', justifyContent: 'center' }}>
                {
                    CRUDInfo.getEditPage(currentItem.CountId && currentItem.CountId > 0 ? currentItem : null, { unitTypes, ingredients, ingredientCategories, recipeCategories },
                        onItemEdited, Api, { preparationStepsOpen, setPreparationStepsOpen, requirementsListOpen, setRequirementsListOpen,
                                             preparationStepsCount: updateItem?.PreparationSteps?.split('{NEXT}').length ?? currentItem?.PreparationSteps?.split('{NEXT}').length,
                                             requirementsCount: updateItem?.RequirementsList?.length ?? currentItem?.RequirementsList?.length })
                }
                <Button onClick={onEdit} style={{ backgroundColor: 'forestgreen' }}>Save</Button>
            </Grid>
            <Grid container direction="row" style={{ justifyContent: 'center' }}>
                <Link to={`/${TableName}/index`}>
                    <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} /> Back to {DisplayName}</Button>
                </Link>
            </Grid>
        </Grid>
    );
};