import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Thumbnail } from "../Global/Thumbnail";
import { RowActions } from "../Global/RowActions";
import { Card, Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCross, faPlus } from '@fortawesome/free-solid-svg-icons';
import { EntityList } from "../Global/EntityList";
import { Ingredient, IngredientCategory, Recipe, RecipeCategory, RequirementsListIngredient, UnitType, User } from "../../models";

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

function CRUDPage({ setTitle, Api, TableName, DisplayName }) {
    useEffect(() => {
        setTitle && setTitle("CRUD " + TableName);
    });

    const [entityGroup] = useState(Api[TableName]);
    
    const history = useHistory();

    const [entityListData, setEntityListData] = useState({ columns: [], rows: [] });

    const onDetails = useCallback((id) => {
        history.push(`/${TableName}/details/${id}`);
    }, [TableName, history]);

    const onEdit = useCallback((id) => {
        history.push(`/${TableName}/edit/${id}`);
    }, [TableName, history]);

    const [removeItem, setRemoveItem] = useState({ item: {}, dialogOpened: false });

    const ToggleRemove = useCallback((id) => {
        const item = entityListData.rows.find(x => x.Id === id || x.CountId === id);

        if (item) {
            setRemoveItem({ item: item, dialogOpened: !removeItem.dialogOpened });
        }
        else {
            console.log(`No item found with key '${id}'!`);
        }
    }, [removeItem.dialogOpened, entityListData.rows]);

    const onRemove = (id) => {
        entityGroup.Delete(id);
    };

    const classes = useStyles();

    useEffect(() => {
        entityGroup.GetAll().then((items) => {
            if (items === "Error") { return; }
        
            const columns = [];
            const rows = [];

            if (items.length > 0) {
                var keys = Object.keys(items[0]);

                keys.forEach(key => {
                    columns.push({
                        id: key,
                        label: key,
                        align: 'center',
                        minWidth: 50,
                    });
                });
                columns.push({
                    id: 'actions',
                    label: 'Actions',
                    align: 'center',
                    minWidth: 100,
                });

                items.forEach((item) => {
                    var obj = {};

                    keys.forEach((key) => {
                        var value;

                        if (Array.isArray(item[key])) {
                            value = item[key].map(el => (el instanceof IngredientCategory || el instanceof RecipeCategory) ? <Card key={el.Name + "-" + el.CountId} style={{ margin: '2px', padding: '3px' }}>{el.Name}</Card> :
                                                         el instanceof UnitType ? <Card key={el.Name + "-" + el.CountId} style={{ margin: '2px', padding: '3px' }}>{el.Name} ({el.AllowDecimals ? "decimals" : "integers"})</Card> :
                                                         el instanceof RequirementsListIngredient ? <Card key={el.Ingredient.Id} style={{ margin: '2px', padding: '3px' }}>{el.Ingredient.Name} ({el.Units} {el.UnitType.Name})</Card> : <Card key={el} style={{ margin: '2px', padding: '3px' }}>{el}</Card>);
                        }
                        else if (item[key]instanceof Object ||
                                 item[key] instanceof Ingredient ||
                                 item[key] instanceof IngredientCategory ||
                                 item[key] instanceof UnitType ||
                                 item[key] instanceof Recipe ||
                                 item[key] instanceof RecipeCategory ||
                                 item[key] instanceof User) {
                            value = item[key].Name;
                        }
                        else if (key === "ImageLocation") {
                            value = <>
                                        <Thumbnail source={item[key]} size={50}/>
                                        <a href={item[key]}>to location</a>
                                    </>
                        }
                        else value = item[key];

                        obj[key] = value;
                    });

                    obj.actions = <RowActions rowEntity={item} rowEntityId={item.Id ?? item.CountId} onDetails={onDetails} onEdit={onEdit} onRemove={ToggleRemove} />

                    rows.push(obj);
                });
            }

            setEntityListData({ columns: columns, rows: rows });
        });
    }, [entityGroup, ToggleRemove, onEdit, onDetails]);

    return (
        <Grid className={classes.form}>
            <Dialog open={removeItem.dialogOpened} onClose={() => setRemoveItem(removeItem => { removeItem.dialogOpened = false; return removeItem })}>
                <DialogTitle>Remove item {removeItem.item.Name}</DialogTitle>
                <DialogContent>
                    Are you sure you want to remove this item: {removeItem.item.Name} ?<br />
                    <Button onClick={() => onRemove(removeItem.item.Id ?? removeItem.item.CountId)} style={{ backgroundColor: 'red', marginRight: '1rem', marginTop: '1rem' }}><FontAwesomeIcon icon={faCross} style={{ marginRight: '5px' }}/> Remove</Button>
                    <Button onClick={() => ToggleRemove(removeItem.item.Id ?? removeItem.item.CountId)} style={{ backgroundColor: 'forestgreen', marginTop: '1rem' }}>Cancel</Button>
                </DialogContent>
            </Dialog>
            <Typography className={classes.txt} variant="h3">
                {DisplayName} CRUD
            </Typography>

            {entityListData.rows.length < 1 ?
                "No items found in this table." :
                <EntityList
                    columns={[...entityListData.columns]}
                    rows={[...entityListData.rows]}
                />
            }
            <Link to={`/${TableName}/create`}>
                <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} /> Add {DisplayName}</Button>
            </Link>
        </Grid>
    );
};

export { CRUDPage };