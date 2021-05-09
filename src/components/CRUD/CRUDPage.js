import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Thumbnail } from "../Global/Thumbnail";
import { RowActions } from "../Global/RowActions";
import { Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserSelectInputComponent } from "../Global/UserSelectInputComponent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCross, faPlus } from '@fortawesome/free-solid-svg-icons';
import { EntityList } from "../Global/EntityList";
import { Ingredient, IngredientCategory, Recipe, RecipeCategory, UnitType } from "../../models";

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
    
    const history = useHistory();

    const [removeItem, setRemoveItem] = useState({ item: {}, dialogOpened: false });

    const [items, setItems] = useState([]);
    if (items.length === 1 && items[0].Id === '') {
        items.pop();
    }

    const classes = useStyles();

    useEffect(() => {
        Api[TableName].GetAll().then((tableContents) => {
            if (tableContents === "Error") { return; }
        
            setItems(tableContents);
        });
    }, [Api[TableName]]);

    const onDetails = (id) => {
        history.push(`/${TableName}/details/${id}`);
    };

    const onEdit = (id) => {
        history.push(`/${TableName}/edit/${id}`);
    };

    const ToggleRemove = (id) => {

    };

    const onRemove = (id) => {
        
    };

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
                obj[key] = item[key];
            });

            obj.actions = <RowActions rowEntity={item} rowEntityId={item.Id} onDetails={onDetails} onEdit={onEdit} onRemove={onRemove} />

            rows.push(obj);
        });
    }

    return (
        <Grid className={classes.form}>
            <Dialog disableBackdropClick disableEscapeKeyDown open={removeItem.dialogOpened} onClose={() => setRemoveItem(removeItem => { removeItem.dialogOpened = false; return removeItem })}>
                <DialogTitle>Remove item {removeItem.item.Name}</DialogTitle>
                <DialogContent>
                    Are you sure you want to remove this item: {removeItem.item.Name}<br />
                    <Button onClick={() => onRemove(removeItem.item.Id)} style={{ backgroundColor: 'red', marginRight: '1rem', marginTop: '1rem' }}><FontAwesomeIcon icon={faCross} style={{ marginRight: '5px' }}/> Remove</Button>
                    <Button onClick={() => ToggleRemove(removeItem.item.Id)} style={{ backgroundColor: 'forestgreen', marginTop: '1rem' }}>Cancel</Button>
                </DialogContent>
            </Dialog>
            <Typography className={classes.txt} variant="h3">
                {DisplayName} CRUD
            </Typography>

            {items.length < 1 ?
                "No items found in this table." :
                <EntityList
                    columns={columns}
                    rows={rows}
                />
            }
            <Link to={`/${TableName}/create`}>
                <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} /> Add {DisplayName}</Button>
            </Link>
        </Grid>
    );
};

export { CRUDPage };