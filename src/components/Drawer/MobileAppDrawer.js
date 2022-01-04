import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Drawer,  Divider, Button } from "@material-ui/core";

import { faArrowAltCircleDown, faArrowAltCircleUp, faBook, faBookOpen, faHome, faListAlt, faMortarPestle, faUsers, faUtensils } from "@fortawesome/free-solid-svg-icons";

import DrawerItem from "./MobileDrawerItem";

import CRUDPagesInfo from "../../API/CRUDPagesInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const drawerWidth = 100;

const useStyles = makeStyles((theme) => ({
    drawer: {
        height: drawerWidth,
        flexShrink: 0,
        position: 'absolute',
        zIndex: 1,
        overflow: 'hidden',
    },
    drawerPaper: {
        borderTop: 'solid 3px #ffbb00',
        boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.12), 0px 0px 0px 2px rgba(0, 0, 0, 0.14), 0px 0px 0px 2px rgba(0, 0, 0, 0.20)',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        backgroundColor: '#ffbb00',
        height: drawerWidth,
        width: '100%',
        overflow: 'hidden',
    },
    chevron: {
        display: "flex",
        justifyContent: "flex-end",
        flex: 1,
    },
}));

function MobileAppDrawer({ isAdmin, isCreator, isCook }) {
    const classes = useStyles();

    const defaultOnly = !isAdmin && !isCreator && !isCook;

    const [linkGroup, setLinkGroup] = useState('Pages');
    const linkGroups = [
        'Pages',
        'Cook',
        'Creator',
        'Admin',
    ];

    const nextLinkGroup = () => {
        let index = linkGroups.indexOf(linkGroup);

        index--;
        if (index < 0) {
            index = linkGroups.length - 1;
        }

        var group = linkGroups[index];

        if ((group === 'Cook' && !isCook) ||
            (group === 'Creator' && !isCreator) ||
            (group === 'Admin' && !isAdmin)) {
            group = linkGroups[0];
        }

        setLinkGroup(group);
    };

    const prevLinkGroup = () => {
        let index = linkGroups.indexOf(linkGroup);

        index++;
        if (index >= linkGroups.length) {
            index = 0;
        }

        var group = linkGroups[index];

        if ((group === 'Cook' && !isCook) ||
            (group === 'Creator' && !isCreator) ||
            (group === 'Admin' && !isAdmin)) {
            group = linkGroups[0];
        }

        setLinkGroup(group);
    };

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="bottom"
            open={true}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div style={{ width: window.innerWidth, height: drawerWidth, display: 'block', overflow: 'hidden', position: 'absolute' }}>
                {defaultOnly ? <></> :
                <div style={{ display: 'inline-block', width: (window.innerWidth * 0.17), padding: '2px', paddingRight: '10px', borderRight: 'solid 1px', verticalAlign: 'top', position: 'inherited' }}>
                    <Typography variant="h7" style={{ margin: 'auto', width: '100%' }}>{linkGroup}</Typography>
                    <Button variant="outlined" style={{ height: ((drawerWidth * 0.8) - 10) * 0.5, width: '100%' }}
                        onClick={() => {
                            nextLinkGroup();
                        }}
                    >
                        <FontAwesomeIcon icon={faArrowAltCircleUp} />
                    </Button>
                    <Button variant="outlined" style={{ height: ((drawerWidth * 0.8)  - 10) * 0.5, width: '100%' }}
                        onClick={() => {
                            prevLinkGroup();
                        }}
                    >
                        <FontAwesomeIcon icon={faArrowAltCircleDown} />
                    </Button>
                </div>
                }{//
    /*       */}<div style={{ display: 'inline-block', width: defaultOnly ? '100%' : (window.innerWidth * 0.8), overflow: 'hidden', verticalAlign: 'top' }}>
                    {linkGroup === 'Pages' ?
                        <div style={{ height: drawerWidth - 2, overflow: 'hidden', marginLeft: '10px' }}>
                            <DrawerItem width={(window.innerWidth * 0.8 - 20) * 0.5} height={(drawerWidth - 2) * 0.5} icon={faHome} link="/home/index" text="Home" />
                            <DrawerItem width={(window.innerWidth * 0.8 - 20) * 0.5} height={(drawerWidth - 2) * 0.5} icon={faUtensils} link="/kitchen/index" text="Your Kitchen" />
                            <DrawerItem width={(window.innerWidth * 0.8 - 20) * 0.5} height={(drawerWidth - 2) * 0.5} icon={faBookOpen} link="/recipebook/index" text="Recipe Book" />
                            <DrawerItem width={(window.innerWidth * 0.8 - 20) * 0.5} height={(drawerWidth - 2) * 0.5} icon={faListAlt} link="/grocerylists/index" text="Grocery Lists" />
                        </div>
                        : <></>
                    }
                    {linkGroup === 'Cook' ?
                        isCook ? (
                            <>
                                <Divider />
                                <div style={{ height: drawerWidth - 2, overflow: 'auto', marginLeft: '10px' }}>
                                    <DrawerItem width={(window.innerWidth * 0.8 - 20)} height={(drawerWidth - 2)} icon={faMortarPestle} link="/recipebook/custom/index" text="Your Recipes" />
                                </div>
                            </>
                        ) : (
                            <></>
                        ) : <></>
                    }
                    {linkGroup === 'Creator' ?
                        isCreator ? (
                            <>
                                <Divider />
                                <div style={{ height: drawerWidth - 2, overflow: 'hidden', marginLeft: '10px' }}>
                                    {Object.keys(CRUDPagesInfo.Pages).map((CRUD, index) => {
                                        return (
                                            <DrawerItem width={(window.innerWidth * 0.8 - 20) * 0.33} height={(drawerWidth - 2) * 0.5} icon={faBook} key={`${CRUD}-${index}`} link={`/${CRUD}/index`} text={CRUDPagesInfo.Pages[CRUD].DisplayName} />
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <></>
                        ) : <></>
                    }
                    {linkGroup === 'Admin' ?
                        isAdmin ? (
                            <>
                                <Divider />
                                <div style={{ height: drawerWidth - 2, overflow: 'auto', marginLeft: '10px' }}>
                                    <DrawerItem width={(window.innerWidth * 0.8 - 20)} height={(drawerWidth - 2)} icon={faUsers} link="/accounts/index" text="Accounts" />
                                </div>
                            </>
                        ) : (
                            <></>
                        ) : <></>
                    }
                </div>
            </div>
        </Drawer>
    );
};

export { MobileAppDrawer };