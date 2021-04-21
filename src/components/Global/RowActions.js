import React from 'react';
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Grid } from "@material-ui/core";

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
                {onDetails ? <Button id={rowEntityId} onClick={(e) => onDetails(rowEntityId)} style={{ color: 'skyblue' }}><FontAwesomeIcon icon={faEye} /></Button> : ''}
                {onEdit ? <Button id={rowEntityId} onClick={(e) => onEdit(rowEntityId)} style={{ color: 'gold' }}><FontAwesomeIcon icon={faPen} /></Button> : ''}
                {onRemove ? <Button id={rowEntityId} onClick={(e) => onRemove(rowEntityId)} style={{ color: 'red' }}><FontAwesomeIcon icon={faTrash} /></Button> : ''}
            </Grid>
        </Grid>
    );
};

export { RowActions };