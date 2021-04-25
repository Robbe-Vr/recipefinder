import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Register from "../SignIn/Register";
import LogIn from "../SignIn/LogIn";
import { WelcomePage } from "./WelcomePage";
import { AuthorizationCallback } from "./AuthorizationCallback";

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

function Onboarding({ setTitle, Api, setTokens, setAuthorization }) {
    const classes = useStyles();
    const history = useHistory();

    const [authPageAvailable, setAuthPageAvailable] = useState(false);

    useEffect(() => {
        const TestAuthPage = async () => {
            const authPage = (await Api.Custom.PerformCustom('get', Api.AuthorizationPage))?.data;

            const pageActive = authPage ? authPage.length ? authPage.length > 1 : false : false;

            console.log("auth page active status: " + pageActive);

            setAuthPageAvailable(pageActive);
        }

        TestAuthPage();
    }, [Api.AuthorizationPage, Api.Custom]);

    const handleConnectionSuccess = () => {
        history.push("/register");
    };

    return (
        <div className={classes.root}>
            {authPageAvailable ?
                <Route component={() => { 
                    console.log("redirecting to api authorization page.")
                    window.location.href = Api.AuthorizationPage; 
                    return null;
                }}/>
                    : 
                <Switch>
                    <Route path="/signin/register">
                        <div className={classes.form}>
                            <Register setTitle={setTitle} authPageAvailable={authPageAvailable} onSuccess={handleConnectionSuccess} Api={Api} />
                        </div>
                    </Route>
                    <Route path="/signin/login">
                        <div className={classes.form}>
                            <LogIn setTitle={setTitle} authPageAvailable={authPageAvailable} onSuccess={handleConnectionSuccess} Api={Api} />
                        </div>
                    </Route>
                    <Route path={Api.AuthReturnUrlPath}>
                        <AuthorizationCallback setTokens={setTokens} Api={Api} />
                    </Route>
                    
                    <Route>
                        <WelcomePage />
                    </Route>
                </Switch>
            }
        </div>
    );
};

export { Onboarding };