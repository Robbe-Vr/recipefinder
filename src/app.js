import React, { useState } from "react";
import "./app.css";
import { Loading } from "./components/Loading";

import { BrowserRouter as Router } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
import clsx from "clsx";

import { AppDrawer, drawerWidth } from "./components/Drawer/AppDrawer";
import { MainContent } from "./MainContent";
import { Onboarding } from "./components/Onboarding/Onboarding";

import { AttemptLogIn, useAccount, ApiProvider, useAPI } from "./API/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        height: "100%",
    },
    appBar: {
        backgroundColor: '#ffbb00',
        color: 'black',
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px])`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    logoutButton: {
        
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: "none",
    },
    title: {
        flexGrow: 1,
    },
    content: {
        flexGrow: 2,
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

export default function App() {
    const classes = useStyles();

    return (
        <ApiProvider>
            <AttemptLogIn>
                <Loading>
                    <Router>
                        <div className={classes.root}>
                            <AppShell />
                        </div>
                    </Router>
                </Loading>
            </AttemptLogIn>
        </ApiProvider>
    );
};

function AppShell() {
    const { id, name, registered, roles, logOut, setTokens } = useAccount();
    const [title, setTitle] = useState("");
    const [open, setOpen] = useState(true);

    const classes = useStyles();

    const { Api } = useAPI();

    if (!registered) {
        return <Onboarding setTitle={setTitle} Api={Api} setTokens={setTokens} />;
    }

    return (
        <>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setOpen(true)}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap className={classes.title}>
                        {title}
                    </Typography>
                    <Typography variant="subtitle2" noWrap className={classes.title}>
                        logged in as: {name}
                    </Typography>
                    <Button
                        className={classes.logoutButton}
                        onClick={() => { logOut(); window.location.href = "/signin/login" }}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '5px' }}/> log Out
                    </Button>
                </Toolbar>
            </AppBar>
            <AppDrawer
                open={open}
                onOpen={setOpen}
                setTitle={setTitle}
                isRegistered={registered}
                isAdmin={roles.filter(r => r.name === 'admin') !== undefined}
                isCreator={roles.filter(r => r.name === 'creator') !== undefined}
                isCook={roles.filter(r => r.name === 'cook') !== undefined}
            />
            <MainContent setTitle={setTitle} drawerOpen={open} isRegistered={registered} name={name} userId={id ?? "unknown"} Api={Api} />
        </>
    );
};