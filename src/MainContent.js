import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import { drawerWidth } from "./components/Drawer/AppDrawer";

import { HomePage } from "./components/Home/Index";

import { KitchenHomePage } from "./components/Kitchen/index";
import { AddIngredients } from "./components/Kitchen/AddIngredients";

import { RecipeBookHomePage } from "./components/RecipeBook/index";
import RecipeDetailsPage from "./components/RecipeBook/details";
import RecipeTutorialPage from "./components/RecipeBook/tutorial";
import RecipeEditPage from "./components/RecipeBook/edit";
import RecipeCreatePage from "./components/RecipeBook/create";

import AccountsPage from "./components/Accounts/index";
import EditAccountPage from "./components/Accounts/update";
import AccountDetailsPage from "./components/Accounts/details";

import { CRUDPage } from "./components/CRUD/CRUDPage";
import CRUDPagesInfo from "./API/CRUDPagesInfo";
import CRUDDetailsPage from "./components/CRUD/details";
import CRUDEditPage from "./components/CRUD/edit";
import CRUDCreatePage from "./components/CRUD/create";

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

function MainContent({ setTitle, drawerOpen, isRegistered, name, userId, Api, isAdmin, isCreator, isCook }) {
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
                        <HomePage setTitle={setTitle} name={name} userId={userId} Api={Api} />
                    </Route>
                    <Route path="/kitchen/index">
                        <KitchenHomePage setTitle={setTitle} userId={userId} Api={Api} />
                    </Route>
                    <Route path="/kitchen/add">
                        <AddIngredients setTitle={setTitle} userId={userId} Api={Api} />
                    </Route>
                    <Route path="/recipebook/index">
                        <RecipeBookHomePage setTitle={setTitle} isCook={isCook} userId={userId} Api={Api} />
                    </Route>
                    <Route path="/recipebook/details/:recipeId">
                        <RecipeDetailsPage setTitle={setTitle} Api={Api} />
                    </Route>
                    <Route path="/recipebook/tutorial/:recipeId">
                        <RecipeTutorialPage setTitle={setTitle} Api={Api} />
                    </Route>
                    {
                        isRegistered ? (
                            <Redirect exact strict from="/" to="/home/index" />
                        ) : (
                            <></>
                        )
                    }
                </Switch>
                {
                    isCook ?
                    <Switch>
                        <Route path="/recipebook/custom/index">
                            <RecipeBookHomePage setTitle={setTitle} isCook={isCook} userId={userId} Api={Api} defaultRecipeListState={0} />
                        </Route>
                        <Route path="/recipebook/custom/edit/:recipeId">
                            <RecipeEditPage setTitle={setTitle} userId={userId} Api={Api} />
                        </Route>
                        <Route path="/recipebook/custom/create">
                            <RecipeCreatePage setTitle={setTitle} userId={userId} Api={Api} />
                        </Route>
                    </Switch>
                    : null
                }
                {
                    isCreator ?
                    Object.keys(CRUDPagesInfo.Pages).map((CRUD, index) => {
                        return (
                            <Switch >
                                <Route path={`/${CRUD}/index`}>
                                    <CRUDPage setTitle={setTitle} TableName={CRUD} DisplayName={CRUDPagesInfo.Pages[CRUD].DisplayName} Api={Api} />
                                </Route>
                                <Route path={`/${CRUD}/details/:id`}>
                                    <CRUDDetailsPage setTitle={setTitle} TableName={CRUD} DisplayName={CRUDPagesInfo.Pages[CRUD].DisplayName} Api={Api} />
                                </Route>
                                <Route path={`/${CRUD}/edit/:id`}>
                                    <CRUDEditPage setTitle={setTitle} TableName={CRUD} DisplayName={CRUDPagesInfo.Pages[CRUD].DisplayName} Api={Api} />
                                </Route>
                                <Route path={`/${CRUD}/create`}>
                                    <CRUDCreatePage setTitle={setTitle} TableName={CRUD} DisplayName={CRUDPagesInfo.Pages[CRUD].DisplayName} Api={Api} />
                                </Route>
                            </Switch>
                        );
                    })
                    : null
                }
                {
                    isAdmin ?
                    <Switch>
                         <Route path="/accounts/index">
                             <AccountsPage setTitle={setTitle} Api={Api} />
                        </Route>
                        <Route path="/accounts/edit/:userId">
                            <EditAccountPage setTitle={setTitle} Api={Api} />
                        </Route>
                        <Route path="/accounts/details/:userId">
                            <AccountDetailsPage setTitle={setTitle} Api={Api} />
                        </Route>
                    </Switch>
                    : null
                }
            </div>
        </main>
    );
};

export { MainContent };