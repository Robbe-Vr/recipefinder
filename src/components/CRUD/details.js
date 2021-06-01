import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

import CRUDPagesInfo from "../../API/CRUDPagesInfo";

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

    const { id } = useParams();

    const [currentItem, setCurrentItem] = useState({});

    useEffect(() => {
        Api[TableName].GetById(id).then((obj) => {
            if (obj === "Error") { return; }
        
            setCurrentItem(obj);
        });
    }, [Api, TableName, id]);

    const classes = useStyles();

    const CRUDInfo = CRUDPagesInfo.Pages[TableName];

    return (
        <Grid container direction="row" className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                {DisplayName} CRUD Details:<br />{currentItem.Name}
            </Typography>
            <Grid container direction="row" style={{  borderBottom: 'solid 1px', marginBottom: '10px', padding: '5px', justifyContent: 'center' }}>
                {
                    CRUDInfo.getDetailsPage(currentItem.CountId && currentItem.CountId > 0 ? currentItem : null)
                }
                <Link to={`/${TableName}/edit/${id}`}>
                    <Button style={{ backgroundColor: 'yellow' }}>Edit</Button>
                </Link>
            </Grid>
            <Grid container direction="row" style={{ justifyContent: 'center' }}>
                <Link to={`/${TableName}/index`}>
                    <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} /> Back to {DisplayName}</Button>
                </Link>
            </Grid>
        </Grid>
    );
};