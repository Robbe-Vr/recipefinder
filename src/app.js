import React, { useEffect, useState } from "react";
import "./app.css";
import { Loading } from "./components/Loading";

import { BrowserRouter as Router, Link } from "react-router-dom";

import { CookiesProvider, useCookies } from "react-cookie";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";

import { AppDrawer, drawerWidth } from "./components/Drawer/AppDrawer";
import { MainContent } from "./MainContent";
import { Onboarding } from "./components/Onboarding/Onboarding";

import { Authenticate, useAccount, ApiProvider, useAPI } from "./API/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import { NotificationProvider } from "./components/Global/NotificationContext";
import { MobileAppDrawer } from "./components/Drawer/MobileAppDrawer";

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
            <Authenticate>
                <CookiesProvider>
                    <NotificationProvider>
                        <Loading>
                            <Router>
                                <div className={classes.root}>
                                    <AppShell />
                                </div>
                            </Router>
                        </Loading>
                    </NotificationProvider>
                </CookiesProvider>
            </Authenticate>
        </ApiProvider>
    );
};

const cookieName = "recipefinder_grocerylist_cookie";

function AppShell() {
    const { id, name, registered, loaded, roles, logOut } = useAccount();
    const [title, setTitle] = useState("");
    const [open, setOpen] = useState(true);

    const classes = useStyles();

    const { Api } = useAPI();

    const [cookies] = useCookies();

    const [grocerylistItems, setGrocerylistItems] = useState(0);

    useEffect(() => {
        const cookie = cookies[cookieName];

        if (cookie && cookie.length > 5) {
            setGrocerylistItems(
                cookie.split(' | ')?.length ?? 0
            );
        }
        else {
            setGrocerylistItems(0);
        }
    }, [cookies]);

    const breakpoint = 800;
    const [renderMobile, setRenderMobile] = useState(window.innerWidth < breakpoint);
    useEffect(() => {
        function onSize() {
            var mobileScreenSize = window.innerWidth < breakpoint;

            console.log(`Resize: Screen width of ${window.innerWidth}px and height of ${window.innerHeight}px, thus rendering ${mobileScreenSize ? "mobile" : "default"} layout.`);

            setRenderMobile(mobileScreenSize);
        };

        window.addEventListener('resize', () => onSize());
        window.addEventListener('loaded', () => onSize());

        return () => {
            window.removeEventListener('resize', () => onSize());
            window.removeEventListener('loaded', () => onSize());
        };
    }, []);

    if (!loaded) {
        return <></>;
    }

    if (!registered) {
        return <Onboarding setTitle={setTitle} Api={Api} renderMobile={renderMobile} />;
    }

    return (
        <>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: renderMobile && open,
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
                    <Grid>
                        <Typography variant="subtitle2" noWrap className={classes.title}>
                            Welcome {name}
                        </Typography>
                        <Link to={`/grocerylists/${grocerylistItems > 0 ? "current" : "index"}`} style={{ textDecoration: 'none' }}>
                            <Button>
                                <FontAwesomeIcon icon={faListAlt} style={{ marginRight: '5px' }}/>{grocerylistItems > 0 ? `${grocerylistItems} item(s)` : "Grocerylist"}
                            </Button>
                        </Link>
                        <Button
                            className={classes.logoutButton}
                            onClick={() => { logOut(); window.location.href = "/signin/login" }}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '5px' }}/> log Out
                        </Button>
                    </Grid>
                </Toolbar>
            </AppBar>
            {renderMobile ?
                <MobileAppDrawer
                    open={open}
                    onOpen={setOpen}
                    setTitle={setTitle}
                    isRegistered={registered}
                    isAdmin={roles.filter(r => r.Name === 'Admin')[0] !== undefined}
                    isCreator={roles.filter(r => r.Name === 'Creator')[0] !== undefined}
                    isCook={roles.filter(r => r.Name === 'Cook')[0] !== undefined}
                />
                :
                <AppDrawer
                    open={open}
                    onOpen={setOpen}
                    setTitle={setTitle}
                    isRegistered={registered}
                    isAdmin={roles.filter(r => r.Name === 'Admin')[0] !== undefined}
                    isCreator={roles.filter(r => r.Name === 'Creator')[0] !== undefined}
                    isCook={roles.filter(r => r.Name === 'Cook')[0] !== undefined}
                />
            }
            <MainContent setTitle={setTitle} drawerOpen={open} isRegistered={registered} name={name} userId={id ?? "unknown"} Api={Api}
                isAdmin={roles.filter(r => r.Name === 'Admin')[0] !== undefined}
                isCreator={roles.filter(r => r.Name === 'Creator')[0] !== undefined}
                isCook={roles.filter(r => r.Name === 'Cook')[0] !== undefined}
                renderMobile={renderMobile}
            />
        </>
    );
};