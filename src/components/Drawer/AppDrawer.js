import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useAccount } from "../../ConnectAPI/index";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import DrawerItem from "./DrawerItem";
import Typography from "@material-ui/core/Typography";

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
        ...theme.mixins.toolbar,
    },
    chevron: {
        display: "flex",
        justifyContent: "flex-end",
        flex: 1,
    },
}));

function AppDrawer({ open, onOpen, isAdmin }) {
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
                {
                    isAdmin ? (
                        <div>
                            <DrawerItem link="/home/index" text="Home" />
                            <DrawerItem link="/accounts/index" text="Accounts" />
                        </div>
                    ) : (
                        <div>
                            <DrawerItem link="/home/index" text="Home" />
                        </div>
                    )
                }
            </List>
        </Drawer>
    );
};

export { AppDrawer, drawerWidth };