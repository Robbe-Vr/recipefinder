import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography } from "@material-ui/core";

import { UserInputComponent } from "../Global/UserInputComponent";

import { useAccount, GetUserIdByName } from "../../API/index";

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
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
    }
}));

export default function LogInPage({ setTitle, isAdmin, onSuccess, Api }) {
    useEffect(() => {
        setTitle && setTitle("Log In");
    });

    const { LogIn } = useAccount();

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

        let success = await LogIn(userId, password);
        
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

                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Button
                        className={classes.btn}
                        color="primary"
                        variant="outlined"
                        onClick={async () => { await AttemptLogIn(userName, password); }}
                    >
                        Log In
                    </Button>
                </Grid>

                <Typography
                    variant="subtitle2"
                >
                    Don't have an account yet? <Link to="/signin/register">register here</Link>
                </Typography>
            </div>
        </div>
    );
};