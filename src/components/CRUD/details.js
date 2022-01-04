import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faPen } from "@fortawesome/free-solid-svg-icons";

import CRUDPagesInfo from "../../API/CRUDPagesInfo";
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
}));

export default function CRUDDetailsPage({ setTitle, Api, TableName, DisplayName }) {
    useEffect(() => {
        setTitle && setTitle(DisplayName + " CRUD Details");
    });

    const { error } = useNotifications();

    const { id } = useParams();

    const [currentItem, setCurrentItem] = useState({});

    useEffect(() => {
        Api[TableName].GetById(id).then((obj) => {
            if (typeof obj === "string")  {
                error("Failed to load " + TableName + "!");

                return;
            }
        
            setCurrentItem(obj);
        });
    }, [Api, TableName, id, error]);

    const classes = useStyles();

    const CRUDInfo = CRUDPagesInfo.Pages[TableName];

    return (
        <Grid container direction="row" className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                {DisplayName} CRUD Details:<br />{currentItem.Name}
            </Typography>
            <Grid container direction="row" style={{ borderBottom: 'solid 1px', marginBottom: '10px', padding: '5px' }}>
                {
                    CRUDInfo.getDetailsPage(currentItem.CountId && currentItem.CountId > 0 ? currentItem : null)
                }
                <Grid style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Link to={`/${TableName}/edit/${id}`} style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" style={{ color: 'gold', borderColor: 'gold', marginBottom: '10px' }}><FontAwesomeIcon icon={faPen} style={{ marginRight: '5px' }} />Edit</Button>
                    </Link>
                </Grid>
            </Grid>
            <Link to={`/${TableName}/index`} style={{ textDecoration: 'none' }}>
                <Button variant="outlined" style={{ color: 'forestgreen', borderColor: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} />Back to {DisplayName}</Button>
            </Link>
        </Grid>
    );
};