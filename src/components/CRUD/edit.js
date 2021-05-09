import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserMultiSelectInputComponent } from "../Global/UserMultiSelectInputComponent";
import { Role, User } from "../../models";

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
    errorTxt: { textAlign: "center", color: "#ff0000" },
    form: {

    }
}));

export default function CRUDEditPage({ setTitle, Api, NonEditableProps, TableName, DisplayName }) {
    useEffect(() => {
        setTitle && setTitle(DisplayName + " CRUD Edit");
    });

    const { id } = useParams();

    const [currentUser, setCurrentUser] = useState(new User());

    const [updateUser, setUpdateUser] = useState(new User());

    useEffect(() => {
        Api[TableName].GetById(id).then((user) => {
            if (user === "Error") { return; }
        
            setCurrentUser(user);
            setUpdateUser(user);
        });
    }, [Api[TableName], id]);

    const classes = useStyles();

    const onUserEdited = (update) => {
        setUpdateUser({
            ...updateUser,
            ...update,
        });
    }

    const onEdit = () => {
        Api.Users.Update(updateUser);
    };

    return (
        <div className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                Edit {currentUser.Name}
            </Typography>
            <div>
                <UserInputComponent
                    
                    defaultValue={currentUser.Name}
                    name="Name"
                    onChange={(value) => onUserEdited({ Name: value })}
                />
                <Button onClick={onEdit} style={{ backgroundColor: 'forestgreen' }}>Save</Button>
            </div>
        </div>
    );
};