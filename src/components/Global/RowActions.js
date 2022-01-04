import React from 'react';

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button } from "@material-ui/core";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles(() => ({
    rowActionsContainer: {

    }
}));

function RowActions({ rowEntityId, rowEntity, onDetails, onEdit, onRemove })
{
    const classes = useStyles();

    return (
        <Grid className={classes.rowActionsContainer}>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                {onDetails ? <Button id={rowEntityId} name="optionsButton" onClick={(e) => onDetails(rowEntityId)} style={{ color: 'skyblue' }}><FontAwesomeIcon name="optionsButton" icon={faEye} /></Button> : ''}
                {onEdit ? <Button id={rowEntityId} name="optionsButton" onClick={(e) => onEdit(rowEntityId)} style={{ color: 'gold' }}><FontAwesomeIcon name="optionsButton" icon={faPen} /></Button> : ''}
                {onRemove ? <Button id={rowEntityId} name="optionsButton" onClick={(e) => onRemove(rowEntityId)} style={{ color: 'red' }}><FontAwesomeIcon name="optionsButton" icon={faTrash} /></Button> : ''}
            </Grid>
        </Grid>
    );
};

export { RowActions };