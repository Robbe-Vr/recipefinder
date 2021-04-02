import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Register from "../SignIn/Register";
import LogIn from "../SignIn/LogIn";
import { WelcomePage } from "./WelcomePage";
import { HomePage } from "../Home/Index";

import { form as formstyles } from "./common-styles";

const useStyles = makeStyles(() => ({
    root: {
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
    },
    form: formstyles,
    txt: { textAlign: "center" },
    continue: {
        marginTop: "20px",
        width: "20%",
    },

}));

function Onboarding({ setTitle, Api }) {
    const classes = useStyles();
    const history = useHistory();

    const handleConnectionSuccess = () => {
        history.push("/register");
    };

    return (
        <div className={classes.root}>
            <Switch>
                <Route path="/home/index">
                    <HomePage />
                </Route>
                <Route path="/signin/register">
                    <div className={classes.form}>
                        <Register setTitle={setTitle} onSuccess={handleConnectionSuccess} Api={Api} />
                    </div>
                </Route>
                <Route path="/signin/login">
                    <div className={classes.form}>
                        <LogIn setTitle={setTitle} onSuccess={handleConnectionSuccess} Api={Api} />
                    </div>
                </Route>
                <Route>
                    <WelcomePage />
                </Route>
            </Switch>
        </div>
    );
};

export { Onboarding };