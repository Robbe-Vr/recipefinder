import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { HomePage } from "./components/Home/Index";
import { KitchenHomePage } from "./components/Kitchen/index";
import AccountsPage from "./components/Accounts/index";
import { drawerWidth } from "./components/Drawer/AppDrawer";

const useStyles = makeStyles((theme) => ({
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

function MainContent({ setTitle, drawerOpen, isRegistered, userId, GetEntityGroup }) {
    const classes = useStyles();
    
    return (
        <main
            className={clsx(classes.content, {
                [classes.contentShift]: drawerOpen
            })}
        >
            <div className={classes.drawerHeader} />
            <div
                style={{
                    width: "70%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    overflowY: "auto",
                }}
            >
                <Switch>
                    <Route path="/home/index">
                        <HomePage setTitle={setTitle} userId={userId} GetEntityGroup={GetEntityGroup} />
                    </Route>
                    <Route path="/accounts/index">
                        <AccountsPage setTitle={setTitle} GetEntityGroup={GetEntityGroup} />
                    </Route>
                    <Route path="/kitchen/index">
                        <KitchenHomePage setTitle={setTitle} userId={userId} GetEntityGroup={GetEntityGroup} />
                    </Route>
                    {
                        isRegistered ? (
                            <Redirect strict from="/" to="/home/index" />
                        ) : (
                            <Redirect strict from="/" to="/home/index" />
                        )
                    }
                </Switch>
            </div>
        </main>
    );
};

export { MainContent };