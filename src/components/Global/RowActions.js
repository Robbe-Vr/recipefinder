import React from 'react';
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Grid } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    
}));

function RowActions({ kitchenIngredient: rowEntity, onDetails, onEdit, onRemove })
{
    const classes = useStyles();

    return (
        <Grid
            direction="row"
            justify="center"
            alignItems="center"
        >
            {onDetails ? <Button id={rowEntity.Ingredient.Id} onClick={(e) => onDetails(rowEntity.Ingredient.Id)} style={{ color: 'skyblue' }}><FontAwesomeIcon icon={faEye} /></Button> : ''}
            {onEdit ? <Button id={rowEntity.Ingredient.Id} onClick={(e) => onEdit(rowEntity.Ingredient.Id)} style={{ color: 'gold' }}><FontAwesomeIcon icon={faPen} /></Button> : ''}
            {onRemove ? <Button id={rowEntity.Ingredient.Id} onClick={(e) => onRemove(rowEntity.Ingredient.Id)} style={{ color: 'red' }}><FontAwesomeIcon icon={faTrash} /></Button> : ''}
        </Grid>
    );
};

export { RowActions };