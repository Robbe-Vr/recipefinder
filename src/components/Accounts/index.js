import React, { useEffect, useState } from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import { useAccount, useAPI } from "../../ConnectAPI/index";

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

export default function AccountsPage({ setTitle, GetEntityGroup }) {
    useEffect(() => {
        setTitle && setTitle("Accounts");
    });

    const classes = useStyles();

    const [users, setUsers] = useState([
        {
            id: '',
            name: '',
            roles: [
                {
                    id: '',
                    name: '',
                }
            ],
            email: '',
            phoneNumber: '',
        }
    ]);

    const userEntityGroup = GetEntityGroup("Users");

    useEffect(() => {
        console.log("Retreiving users.");
        userEntityGroup.GetAll().then((users) => {
            if (users === "Error") { return; }
        
            console.log("Retreived User: ", users[0]);
            setUsers(users);
        });
    }, [userEntityGroup]);

    return (
        <div className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                Accounts
            </Typography>
            <div className={classes.form}>
                {
                    users.length > 0 ?
                    users.map((user) => {
                    return (
                    <div>
                        <Typography className={classes.txt} variant="h5">
                            {user.name}
                        </Typography>
                        <Typography className={classes.txt} variant="h6">
                            {user.email}
                        </Typography>
                        <ul>
                            {
                                user.roles.map((role) => (
                                        <li>{role.name}</li>
                                ))
                            }
                        </ul>
                    </div>
                )}) : <div>None.</div>
                }
            </div>
        </div>
    );
};