import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { HomePage } from "./components/Home/Index";
import { KitchenHomePage } from "./components/Kitchen/index";
import { AddIngredients } from "./components/Kitchen/AddIngredients";
import { RecipeBookHomePage } from "./components/RecipeBook/index";
import RecipeDetailsPage from "./components/RecipeBook/details";
import RecipeEditPage from "./components/RecipeBook/edit";
import AccountsPage from "./components/Accounts/index";
import EditAccountPage from "./components/Accounts/update";
import AccountDetailsPage from "./components/Accounts/details";
import { drawerWidth } from "./components/Drawer/AppDrawer";
import { CustomRecipeBookPage } from "./components/RecipeBook/custom";
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
                        <RecipeBookHomePage setTitle={setTitle} userId={userId} Api={Api} />
                    </Route>
                    <Route path="/recipebook/details/:recipeId">
                        <RecipeDetailsPage setTitle={setTitle} Api={Api} />
                    </Route>
                    {
                        isRegistered ? (
                            <Redirect strict from="/" to="/home/index" />
                        ) : (
                            <Redirect strict from="/" to="/home/index" />
                        )
                    }
                </Switch>
                {
                    isCook ?
                    <Switch>
                        <Route path="/recipebook/custom">
                            <CustomRecipeBookPage setTitle={setTitle} userId={userId} Api={Api} />
                        </Route>
                        <Route path="/recipebook/custom/edit/:recipeId">
                            <RecipeEditPage setTitle={setTitle} userId={userId} Api={Api} />
                        </Route>
                    </Switch>
                    : null
                }
                {
                    isCreator ?
                    CRUDPagesInfo.Pages.map((CRUD, index) => {
                        return (
                            <Switch key={`${CRUD.Name}-${index}`}>
                                <Route path={`/${CRUD.Name}/index`}>
                                    <CRUDPage setTitle={setTitle} TableName={CRUD.Name} DisplayName={CRUD.DisplayName} Api={Api} />
                                </Route>
                                <Route path={`/${CRUD.Name}/details/:id`}>
                                    <CRUDDetailsPage setTitle={setTitle} TableName={CRUD.Name} DisplayName={CRUD.DisplayName} Api={Api} />
                                </Route>
                                <Route path={`/${CRUD.Name}/edit/:id`}>
                                    <CRUDEditPage setTitle={setTitle} TableName={CRUD.Name} DisplayName={CRUD.DisplayName} NotEditableProps={CRUD.notEditableProperties} Api={Api} />
                                </Route>
                                <Route path={`/${CRUD.Name}/create`}>
                                    <CRUDCreatePage setTitle={setTitle} TableName={CRUD.Name} DisplayName={CRUD.DisplayName} Api={Api} />
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