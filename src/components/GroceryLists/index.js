import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import { useCookies } from "react-cookie";

import { makeStyles } from "@material-ui/core/styles";
import { Dialog, DialogContent, DialogTitle, Grid, Button, Typography, Card } from "@material-ui/core";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

import { RowActions } from "../Global/RowActions";
import { UserInputComponent } from "../Global/UserInputComponent";
import { EntityList } from "../Global/EntityList";

import { GroceryList, Ingredient, UnitType } from "../../models";
import { useNotifications } from "../Global/NotificationContext";

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

const cookieName = "recipefinder_grocerylist_cookie";

function GroceryListsHomePage({ setTitle, userId, Api }) {
    useEffect(() => {
        setTitle && setTitle("GroceryLists");
    });

    const { error, warning } =  useNotifications();

    const [/*cookies*/, setCookie, /*removeCookie*/] = useCookies();

    const history = useHistory();

    const [groceryLists, setGroceryLists] = useState([new GroceryList()]);
    if (groceryLists.length === 1 && groceryLists[0].CountId === -1)
    {
        groceryLists.pop();
    }

    useEffect(() => {
        Api.GroceryLists.GetAllByUserId(userId).then((lists) => {
            if (typeof lists === "string") {
                error(lists);
                
                return;
            }
        
            setGroceryLists(lists);
        });
    }, [Api.GroceryLists, userId, error]);

    const [ingredients, setIngredients] = useState([new Ingredient()]);
    if (ingredients.length === 1 && ingredients[0].CountId === -1)
    {
        ingredients.pop();
    }

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
        unitTypes.pop();
    }

    useEffect(() => {
        Api.UnitTypes.GetAll().then((types) => {
            if (typeof types === "string") {
                error(types);
                
                return;
            }
        
            setUnitTypes(types);
        });
    }, [Api.UnitTypes, error]);

    const onDetails = (listId) => {
        history.push('/grocerylists/details/' + listId);
    };

    const onEdit = (listId) => {
        history.push('/grocerylists/edit/' + listId);
    };

    const [removeItem, setRemoveItem] = useState({ item: {}, dialogOpened: false });

    const ToggleRemove = (listId) => {
        const item = groceryLists.find(x => x.CountId === listId);

        if (item) {
            setRemoveItem({ item: item, dialogOpened: !removeItem.dialogOpened });
        }
        else {
            console.log(`No item found with key '${listId}'!`);
        }
    };

    const onRemove = (listId) => {
        Api.GroceryLists.Delete(listId).then((res) => {
            if (typeof res === "string") {
                error(res);
            } else if (typeof res.data === "string") {
                error(res.data);
            } else if (typeof res.data?.Message === "string") {
                error(res.data.Message);
            } else {
                var updatedList = [...groceryLists];

                updatedList.splice(updatedList.indexOf(updatedList.find(x => x.Id === listId)), 1);

                setGroceryLists(updatedList);

                warning("Grocery lists has been removed!");

                setRemoveItem({ item: {}, dialogOpened: false });
            }
        });;
    };

    const setAsCurrentGroceryList = (id) => {
        var list = groceryLists.find(x => x.CountId === id);

        setCookie(cookieName, list.Value);

        history.push('/grocerylists/current');
    };

    const classes = useStyles();

    const [filterOptions, setFilterOptions] = useState({ name: '', categories: [] });

    const filter = (recipe = new GroceryList()) => {
        return (
            (filterOptions.name?.length > 0 ? recipe.Name.toLowerCase().indexOf(filterOptions.name.toLowerCase()) > -1 : true)
        );
    };

    return (
        <Grid
            container
            direction="row"
        >
            <Dialog open={removeItem.dialogOpened} onClose={() => ToggleRemove(removeItem.item.CountId)}>
                <DialogTitle>Remove item {removeItem.item.Name}</DialogTitle>
                <DialogContent>
                    Are you sure you want to remove this grocery list: {removeItem.item.Name} ?<br />
                    <Button variant="outlined" onClick={() => onRemove(removeItem.item.Id)} style={{ color: 'red', borderColor: 'red', marginRight: '1rem', marginTop: '1rem' }}><FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px' }}/>Remove</Button>
                    <Button variant="outlined" onClick={() => ToggleRemove(removeItem.item.CountId)} style={{ color: 'forestgreen', borderColor: 'forestgreen', marginTop: '1rem' }}><FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }}/>Cancel</Button>
                </DialogContent>
            </Dialog>
            <Grid item xs={7}>
                <Typography className={classes.txt} variant="h3">
                    Grocery Lists
                </Typography>

                <Grid>
                    <Link to="/grocerylists/create" style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" style={{ marginTop: "20px", color: 'forestgreen', borderColor: 'forestgreen' }}><FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />Add Grocery List</Button>
                    </Link>
                </Grid>

                {groceryLists.length < 1 ?
                    "No grocerylists found." :
                    <EntityList
                        columns={(() => {
                            var columns = [
                                { id: 'name', label: 'Name', minWidth: 150 },
                                { id: 'value', label: 'Contents', minWidth: 350},
                                { id: 'setcurrent', label: 'Choose', minWidth: 100 },
                                { id: 'actions', label: 'Actions', minWidth: 200 },
                            ];

                            return columns;
                        })()}
                        rows={groceryLists.filter(r => filter(r)).map(list => {
                            var row = {
                                id: list.Id,
                                name: list.Name,
                                value: list.Value.split(' | ').map(item => {
                                    var content = item.trim().split(', ');
                                    return (
                                        <Card key={item} variant="outlined" style={{ margin: '2px', padding: '5px' }}>
                                            {content[1]}{" "}
                                            {unitTypes.find(u => u.CountId === parseInt(content[2]))?.Name}{" "}
                                            {ingredients.find(i => i.Id === content[0])?.Name}
                                        </Card>
                                    );
                                }),
                                setcurrent:
                                <Grid>
                                    <Button name="optionsButton" variant="outlined" style={{ marginTop: "20px", color: 'green', borderColor: 'forestgreen' }}
                                        onClick={() => setAsCurrentGroceryList(list.CountId)}>
                                        Set as current grocerylist
                                    </Button>
                                </Grid>,
                                actions: <RowActions rowEntity={list} rowEntityId={list.Id} onDetails={onDetails} onEdit={onEdit} onRemove={() => ToggleRemove(list.CountId)} />,
                                onClick: (id) => { onDetails(id); },
                            };

                            return row;
                        })}
                    />
                }
            </Grid>
            <Grid item xs={4} style={{ borderLeft: 'solid 1px', marginLeft: '5px', padding: '5px', overflow: 'auto' }}>
                <Grid style={{ padding: '3px', display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                    <UserInputComponent
                        defaultValue={filterOptions.name}
                        name="search by name"
                        onChange={(value) => setFilterOptions(filterOptions => { return { ...filterOptions, ...{ name: value } }; })}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export { GroceryListsHomePage };