import React, { useEffect, useState } from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { UserInputComponent } from "./UserInputComponent";

import { makeStyles } from "@material-ui/core/styles";
import { useAccount, LogIn, GetUserIdByName } from "../../ConnectAPI/index";

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

export default function LogInPage({ setTitle, isAdmin, onSuccess, Api }) {
    useEffect(() => {
        setTitle && setTitle("Log In");
    });

    const { updateByLogIn } = useAccount();

    const [errorMsgs, setErrorMsgs] = useState([]);

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    async function AttemptLogIn(username, password) {
        var newErrorMsgs = [''];
        newErrorMsgs.pop();

        var userId = await GetUserIdByName(username, Api.Users);

        if (!userId) {
            newErrorMsgs.push("Either username or password are misspelled!");
            return false;
        }

        let success = await LogIn(userId, password, updateByLogIn, Api);
        
        if (success) {
            onSuccess();
            window.location.href = "/";
        } else {
            newErrorMsgs.push("Either username or password are misspelled!");
            setErrorMsgs(newErrorMsgs);
        }
    };

    const classes = useStyles();

    return (
        <div className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                Log In
            </Typography>
            <div className={classes.form}>
            {
                    errorMsgs.length > 0 ? (
                        <div className={classes.errorTxt}>
                            <ul>
                                {
                                    errorMsgs.map((error, key) =>
                                        (<li>{error}</li>)
                                    )
                                }
                            </ul>
                        </div>
                    ) : <div></div>
                }

                <UserInputComponent name="UserName" onChange={(value) => { setUserName(value); }} />
                <UserInputComponent name="Password" type="password" onChange={(value) => { setPassword(value); }} />

                <Button
                    color="primary"
                    variant="outlined"
                    onClick={async () => { await AttemptLogIn(userName, password); }}
                >
                    Log In
                </Button>
            </div>
        </div>
    );
};