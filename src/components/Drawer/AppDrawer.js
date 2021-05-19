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
import CRUDPagesInfo from "../../API/CRUDPagesInfo";

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
                    <DrawerItem icon={faBookOpen} link="/recipebook/index" text="Recipe Book" />
                    <DrawerItem icon={faListAlt} link="/kitchen/index" text="Grocery List" />
                </div>
            </List>
            {
                isCook ? (
                    <div>
                        <Divider />
                        <List>
                            <i style={{ marginLeft: '10px' }}>Cook</i>
                            <DrawerItem icon={faMortarPestle} link="/recipebook/custom/index" text="Your Recipes" />
                        </List>
                    </div>
                ) : (
                    <div></div>
                )
            }
            {
                isCreator ? (
                    <div>
                        <Divider />
                        <List>
                        <i style={{ marginLeft: '10px' }}>Creator</i>
                            {
                                Object.keys(CRUDPagesInfo.Pages).map((CRUD, index) => {
                                    return (
                                        <DrawerItem icon={faBook} key={`${CRUD}-${index}`} link={`/${CRUD}/index`} text={CRUDPagesInfo.Pages[CRUD].DisplayName} />
                                    );
                                })
                            }
                        </List>
                    </div>
                ) : (
                    <div></div>
                )
            }
            {
                isAdmin ? (
                <div>
                    <Divider />
                    <List>
                        <i style={{ marginLeft: '10px' }}>Admin</i>
                        <DrawerItem icon={faUsers} link="/accounts/index" text="Accounts" />
                    </List>
                </div>
                ) : (
                    <div></div>
                )
            }
        </Drawer>
    );
};

export { AppDrawer, drawerWidth };