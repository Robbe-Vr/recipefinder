import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { useCookies } from "react-cookie";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button, Card } from "@material-ui/core";

import { Ingredient, GroceryList, UnitType, KitchenIngredient } from "../../models";
import { Grid } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { useAccount } from "../../API";
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

const cookieName = "recipefinder_grocerylist_cookie";

export default function CurrentGroceryListPage({ setTitle, Api }) {
    useEffect(() => {
        setTitle && setTitle("Current Grocery List");
    });

    const { error, success, warning } = useNotifications();

    const history = useHistory();

    const { currentUser } = useAccount();

    const [cookies, setCookie, removeCookie] = useCookies();

    const [list, setGroceryList] = useState(new GroceryList());

    useEffect(() => {
        const cookie = cookies[cookieName];

        if (cookie && cookie.length > 5) {

            setGroceryList(new GroceryList(0, '', '', cookie, currentUser));
        }

    }, [cookies, currentUser, error]);

    const [ingredients, setIngredients] = useState([new Ingredient()]);

    useEffect(() => {
        Api.Ingredients.GetAll().then((ingredients) => {
            if (ingredients instanceof String) {
                error("Failed to load ingredients!");

                return;
            }
        
            setIngredients(ingredients);
        });
    }, [Api.Ingredients, error]);

    const [unitTypes, setUnitTypes] = useState([new UnitType()]);
    if (unitTypes.length === 1 && unitTypes[0].CountId === -1) {
        unitTypes?.pop();
    }

    useEffect(() => {
        Api.UnitTypes.GetAll().then((unitTypes) => {
            if (unitTypes instanceof String) {
                error("Failed to load unit types!");

                return;
            }
        
            setUnitTypes(unitTypes);
        });
    }, [Api.UnitTypes, error]);

    const addListToKitchen = async () => {
        var ingredientStrs = list.Value.split(' | ');

        await Promise.all(ingredientStrs.map(async (ingredient) => {
            var splitStr = ingredient.split(', ');
            var ingredientId = splitStr[0];
            var amount = splitStr[1]
            var unitTypeId = splitStr[2];

            var saveIngredient = new KitchenIngredient(0, ingredients.find(x => x.Id === ingredientId), parseFloat(amount), unitTypes.find(x => x.CountId === parseInt(unitTypeId)), currentUser);

            if (saveIngredient.IngredientId && saveIngredient.UserId?.length > 0 &&
                saveIngredient.Units && saveIngredient.UnitTypeId) {
                
                await Api.Kitchens.Create(saveIngredient);
            }
        })).then(() => {
            success("Ingredients have been added to your kitchen!");
        });

        removeGroceryList();

        history.push('/kitchen/index');
    };

    const removeGroceryList = () => {
        removeCookie(cookieName);

        setGroceryList(new GroceryList());

        warning("Stopped saving your grocery list!");
    };

    const classes = useStyles();

    return (
        <Grid className={classes.paper}>
            {list.CountId >= 0 ?
                <>
                    <Typography className={classes.txt} variant="h2">
                        Current Grocery List: {list.Name}
                    </Typography>
                    <Grid style={{  borderBottom: 'solid 1px', marginBottom: '10px', padding: '5px' }}>
                        <Grid className={classes.inputComponent}>
                            {
                                list.Value.split(' | ').map(item => {
                                    var content = item.trim().split(', ');
                                    return (
                                        <Card key={item} variant="outlined" style={{ margin: '2px', padding: '5px' }}>
                                            {content[1]}{" "}
                                            {unitTypes.find(u => u.CountId === parseInt(content[2]))?.Name}{" "}
                                            {ingredients.find(i => i.Id === content[0])?.Name}
                                        </Card>
                                    );
                                })
                            }
                        </Grid>
                        <Grid>
                            <Button variant="outlined" style={{ color: 'forestgreen' }} onClick={addListToKitchen}>
                                Add Grocery List Content to Kitchen
                            </Button>
                            <Button variant="outlined" style={{ color: 'red' }} onClick={removeGroceryList}>
                                Remove Grocery List
                            </Button>
                        </Grid>
                    </Grid>
                    <Link to="/grocerylists/index">
                        <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} /> Back to Grocery Lists</Button>
                    </Link>
                </>
                :
                <Grid>
                    <Typography variant="h3">
                        No Grocery List chosen
                    </Typography>
                    <Grid>
                        {"Select a Grocery List "}{<Link to="/grocerylists/index">here</Link>}{"."}
                    </Grid>
                </Grid>
            }
        </Grid>
    );
};