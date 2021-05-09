import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import { EntityList } from "../Global/EntityList";
import { User, UserAction } from "../../models";
import { Card } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCross } from "@fortawesome/free-solid-svg-icons";

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

    const [userDetails, setUserDetails] = useState(new User());

    useEffect(() => {
        Api[TableName].GetById(id).then((user) => {
            if (user === "Error") { return; }
        
            setUserDetails(user);
        });
    }, [Api[TableName], id]);

    const classes = useStyles();

    return (
        <div className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                {userDetails.Name} Details
            </Typography>
            <div>
                <Typography>
                    Name: {userDetails.Name}
                </Typography>
            </div>
        </div>
    );
};