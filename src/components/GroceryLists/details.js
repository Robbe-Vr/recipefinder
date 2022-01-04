import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button, Card } from "@material-ui/core";

import { Ingredient, GroceryList, UnitType } from "../../models";
import { Grid } from "@material-ui/core";
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

export default function DetailsGroceryListPage({ setTitle, Api }) {
    const { error } =  useNotifications();

    useEffect(() => {
        setTitle && setTitle("Details Grocery List");
    });

    const { id } = useParams();

    const [list, setGroceryList] = useState(new GroceryList());

    useEffect(() => {
        Api.GroceryLists.GetById(id).then((list) => {
            if (typeof list === "string") {
                error(list);
                
                return;
            }
        
            setGroceryList(list);
        });
    }, [Api.GroceryLists, id, error]);

    const [ingredients, setIngredients] = useState([new Ingredient()]);

    useEffect(() => {
        Api.Ingredients.GetAll().then((ingredients) => {
            if (typeof ingredients === "string") {
                error(ingredients);
                
                return;
            }
        
            setIngredients(ingredients);
        });
    }, [Api.Ingredients, error]);

    const [unitTypes, setUnitTypes] = useState([new UnitType()]);
    if (unitTypes.length === 1 && unitTypes[0].CountId === -1)
    {
        unitTypes?.pop();
    }

    useEffect(() => {
        Api.UnitTypes.GetAll().then((unitTypes) => {
            if (typeof unitTypes === "string") {
                error(unitTypes);
                
                return;
            }
        
            setUnitTypes(unitTypes);
        });
    }, [Api.UnitTypes, error]);

    const classes = useStyles();

    return (
        <Grid className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                Details Grocery List:<br />
                {list.Name}
            </Typography>
            <Grid style={{  borderBottom: 'solid 1px', marginBottom: '10px', padding: '5px' }}>
                <Grid className={classes.inputComponent}>
                    <Typography>
                        Name: {list.Name}
                    </Typography>
                </Grid>
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
            </Grid>
            <Link to="/grocerylists/index" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" style={{ color: 'forestgreen', borderColor: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} />Back to Grocery Lists</Button>
            </Link>
        </Grid>
    );
};