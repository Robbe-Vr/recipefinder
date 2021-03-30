import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

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

function KitchenHomePage({ setTitle, userId, GetEntityGroup }) {
    useEffect(() => {
        setTitle && setTitle("Kitchen");
    });
    
    const [kitchen, setKitchen] = useState({
        user: '',
        ingredients: [
            {
                ingredient: {
                    id: '',
                    name: '',
                },
                units: 1.00,
                unitType: {
                    id: 1,
                    name: '',
                }
            }
        ],
    });
    kitchen.ingredients.pop();

    const classes = useStyles();

    const kitchenEntityGroup = GetEntityGroup("Kitchens");

    useEffect(() => {
        if (!kitchen.ingredients || kitchen.ingredients.length > 0 || userId === kitchen.user) { return; }

        console.log("Retreiving " + userId + "s kitchen.");
        kitchenEntityGroup.GetById(userId).then((kitchen) => {
            if (kitchen === "Error") { return; }
        
            setKitchen(kitchen);
        });
    }, [kitchen, kitchenEntityGroup, userId]);

    return (
        <div className={classes.form}>
            <Typography className={classes.txt} variant="h1">
                {kitchen.user.name}'s Kitchen!
            </Typography>
            <div>
                <ul>
                    {kitchen.ingredients.length < 1 ?
                        "No ingredients in your kitchen!" :
                        kitchen.ingredients.map((kitchenIngredient) => (
                    <li key={kitchenIngredient.ingredient.id}>
                        <Typography className={classes.txt} variant="h4">
                            {kitchenIngredient.ingredient.name}
                        </Typography>
                        <Typography className={classes.txt} variant="h6">
                            {kitchenIngredient.units} {kitchenIngredient.unitType?.name}
                        </Typography>
                    </li>
                    ))
                    }
                    {
                        console.log(kitchen.ingredients.map((e) => { return e.ingredient; }))
                    }
                </ul>
            </div>
        </div>
    );
};

export { KitchenHomePage };