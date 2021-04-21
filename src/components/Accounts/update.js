import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import { UserInputComponent } from "../Global/UserInputComponent";
import { UserMultiSelectInputComponent } from "../Global/UserMultiSelectInputComponent";
import { Role, User } from "../../models";

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

export default function EditAccountPage({ setTitle, Api }) {
    useEffect(() => {
        setTitle && setTitle("Edit Account");
    });

    const { userId } = useParams();

    const [currentUser, setCurrentUser] = useState(new User());

    const [updateUser, setUpdateUser] = useState(new User());
    const [roles, setRoles] = useState([new Role()])

    useEffect(() => {
        Api.Users.GetById(userId).then((user) => {
            if (user === "Error") { return; }
        
            setCurrentUser(user);
            setUpdateUser(user);
        });
    }, [Api.Users, userId]);

    useEffect(() => {
        Api.Roles.GetAll().then((roles) => {
            if (roles === "Error") { return; }
        
            setRoles(roles);
        });
    }, [Api.Roles]);

    const classes = useStyles();

    const onUserEdited = (update) => {
        setUpdateUser({
            ...updateUser,
            ...update,
        });
    }

    const onEdit = () => {
        Api.Users.Update(updateUser);
    };

    const minimumAge = 13;
    var d = new Date();
    const defaultMinimumAgeDate = `${d.getFullYear() - minimumAge}-${(d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)}-${d.getDate() < 10 ? "0" + d.getDate() : d.getDate()}`;

    var db = currentUser.DateOfBirth;
    let defaultDate = db && db === typeof Date ?
        `${(db.getFullYear() < 1000 ? db.getFullYear() < 100 ? db.getFullYear() < 10 ? "000" : "00" : "0" : "") + db.getFullYear()}-${(db.getMonth() + 1) < 10 ? "0" + (db.getMonth() + 1) : (db.getMonth() + 1)}-${db.getDate() < 10 ? "0" + db.getDate() : db.getDate()}`
         : defaultMinimumAgeDate;

    return (
        <div className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                Edit {currentUser.Name}
            </Typography>
            <div>
                <UserInputComponent
                    
                    defaultValue={currentUser.Name}
                    name="Name"
                    onChange={(value) => onUserEdited({ Name: value })}
                />
                <UserInputComponent
                    defaultValue={currentUser.Email}
                    name="Email"
                    onChange={(value) => onUserEdited({ Email: value })}
                />
                <UserInputComponent
                    defaultValue={defaultDate}
                    name="Date Of Birth"
                    type="date"
                    inputProps={{ min: defaultMinimumAgeDate }}
                    onChange={(value) => onUserEdited({ DateOfBirth: new Date(Date.parse(value)) })}
                />
                <UserInputComponent
                    defaultValue={currentUser.PhoneNumber}
                    name="Phone"
                    onChange={(value) => onUserEdited({ PhoneNumber: value })}
                />
                <UserMultiSelectInputComponent
                    defaultValues={currentUser.Roles.map(role => role.Id)}
                    name="Roles"
                    options={roles.map(role => { return { name: role.Name, value: role.Id }; })}
                    onChange={(values) => onUserEdited({ Roles: values })}
                />
                <Button onClick={onEdit} style={{ backgroundColor: 'forestgreen' }}>Save</Button>
            </div>
        </div>
    );
};