import React from "react";

import { Link } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

export default function DrawerItem(props) {
    return (
        <ListItem button component={Link} to={props.link}>
            <ListItemText primary={props.text} onClick={props.onClick} />
        </ListItem>
    );
};