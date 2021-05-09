import React, { useEffect, useState } from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserMultiSelectInputComponent } from "../Global/UserMultiSelectInputComponent";

const useStyles = makeStyles((theme) => ({
    paper: {
        width: "100%",
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
    },
    txt: { textAlign: "center" },
    errorTxt: { textAlign: "center", color: "#ff0000" },
    form: {

    }
}));

export default function CRUDCreatePage({ setTitle, Api, TableName, DisplayName }) {
    useEffect(() => {
        setTitle && setTitle(DisplayName + " CRUD Create");
    });

    const [Item, setItem] = useState({});
    const classes = useStyles();

    const onItemEdited = (patch) => {
        setItem({
            ...Item,
            ...patch,
        });
    };

    const onCreate = () => {
        Api[TableName].Create(Item);
    };

    return (
        <div className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                Create {DisplayName}
            </Typography>
            <div>
                <UserInputComponent
                    
                    defaultValue={Item.Name}
                    name="Name"
                    onChange={(value) => onItemEdited({ Name: value })}
                />
                <Button onClick={onCreate} style={{ backgroundColor: 'forestgreen' }}>Create</Button>
            </div>
        </div>
    );
};