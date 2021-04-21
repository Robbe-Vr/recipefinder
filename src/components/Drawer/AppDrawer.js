import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import DrawerItem from "./DrawerItem";
import Typography from "@material-ui/core/Typography";
import { faBook, faBookOpen, faHome, faListAlt, faMortarPestle, faUsers, faUtensils } from "@fortawesome/free-solid-svg-icons";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerheader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        backgroundColor: '#ffbb00',
        ...theme.mixins.toolbar,
    },
    chevron: {
        display: "flex",
        justifyContent: "flex-end",
        flex: 1,
    },
}));

function AppDrawer({ open, onOpen, isAdmin, isCreator, isCook }) {
    const theme = useTheme();
    const classes = useStyles();

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerheader}>
                <Typography variant="h5" noWrap style={{ marginLeft: "8px" }}>
                    Recipe Finder
                </Typography>
                <div className={classes.chevron}>
                    <IconButton onClick={() => onOpen(false)}>
                        {
                            theme.direction === "itr" ? (
                                <ChevronLeftIcon />
                            ) : (
                                <ChevronRightIcon />
                            )
                        }
                    </IconButton>
                </div>
            </div>
            <Divider />
            <List>
                <div>
                    <i style={{ marginLeft: '10px' }}>Pages</i>
                    <DrawerItem icon={faHome} link="/home/index" text="Home" />
                    <DrawerItem icon={faUtensils} link="/kitchen/index" text="Your Kitchen" />
                    <DrawerItem icon={faBookOpen} link="/kitchen/index" text="Recipe Book" />
                    <DrawerItem icon={faListAlt} link="/kitchen/index" text="Grocery List" />
                </div>
            </List>
            <Divider />
            <List>
                {
                    isCook ? (
                        <div>
                            <i style={{ marginLeft: '10px' }}>Cook</i>
                            <DrawerItem icon={faMortarPestle} link="/kitchen/index" text="Your Recipes" />
                        </div>
                    ) : (
                        <div></div>
                    )
                }
            </List>
            <Divider />
            <List>
                {
                    isCreator ? (
                        <div>
                            <i style={{ marginLeft: '10px' }}>Creator</i>
                            <DrawerItem icon={faBook} link="/accounts/index" text="Ingredients" />
                            <DrawerItem icon={faBook} link="/accounts/index" text="Ingredient Categories" />
                            <DrawerItem icon={faBook} link="/accounts/index" text="Unit Types" />
                            <DrawerItem icon={faBook} link="/accounts/index" text="Recipes" />
                            <DrawerItem icon={faBook} link="/accounts/index" text="Recipe Categories" />
                        </div>
                    ) : (
                        <div></div>
                    )
                }
            </List>
            <Divider />
            <List>
                {
                    isAdmin ? (
                        <div>
                            <i style={{ marginLeft: '10px' }}>Admin</i>
                            <DrawerItem icon={faUsers} link="/accounts/index" text="Accounts" />
                        </div>
                    ) : (
                        <div></div>
                    )
                }
            </List>
        </Drawer>
    );
};

export { AppDrawer, drawerWidth };