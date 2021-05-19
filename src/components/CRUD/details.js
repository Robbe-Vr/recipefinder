import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

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

    const [item, setItem] = useState({});

    useEffect(() => {
        Api[TableName].GetById(id).then((obj) => {
            if (obj === "Error") { return; }
        
            setItem(obj);
        });
    }, [Api, TableName, id]);

    const classes = useStyles();

    return (
        <Grid className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                {DisplayName} CRUD Details:<br />{item.Name}
            </Typography>
            <Grid style={{  borderBottom: 'solid 1px', marginBottom: '10px', padding: '5px' }}>
                {
                    Object.keys(item).map((key) => {
                        return (
                            <Typography>
                                {key}: {item[key]}
                            </Typography>
                        );
                    })
                }
            </Grid>
            <Link to={`/${TableName}/index`}>
                <Button variant="outlined" style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faBackward} style={{ marginRight: '5px' }} /> Back to {DisplayName}</Button>
            </Link>
        </Grid>
    );
};