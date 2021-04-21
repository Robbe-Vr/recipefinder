import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import { EntityList } from "../Global/EntityList";
import { RowActions } from "../Global/RowActions";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";

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
}));

export default function AccountsPage({ setTitle, Api }) {
    useEffect(() => {
        setTitle && setTitle("Accounts");
    });

    const history = useHistory();

    const classes = useStyles();

    const [removeUser, setRemoveUser] = useState({ user: {}, dialogOpened: false });

    const [users, setUsers] = useState([
        {
            Id: '',
            Name: '',
            Roles: [
                {
                    Id: '',
                    Name: '',
                }
            ],
            Email: '',
            PhoneNumber: '',
        }
    ]);
    if (users.length === 1 && users[0].Id === '') {
        users.pop();
    }

    useEffect(() => {
        Api.Users.GetAll().then((users) => {
            if (users === "Error") { return; }
        
            setUsers(users);
        });
    }, [Api.Users]);

    const onDetails = (userId) => {
        history.push('/accounts/details/' + userId);
    };

    const onEdit = (userId) => {
        history.push('/accounts/edit/' + userId);
    };

    const ToggleRemove = (userId) => {
        setRemoveUser({ user: users.find(x => x.Id === userId), dialogOpened: !removeUser.dialogOpened });
    };

    const onRemove = (userId) => {
        const user = users.find(x => x.Id === userId);

        Api.Users.Delete(userId, user);
    };

    return (
        <div className={classes.paper}>
            <Dialog disableBackdropClick disableEscapeKeyDown open={removeUser.dialogOpened} onClose={() => setRemoveUser(removeUser => { removeUser.dialogOpened = false; return removeUser })}>
                <DialogTitle>Remove user {removeUser.user?.Name}</DialogTitle>
                <DialogContent>
                    Are you sure you want to remove user: {removeUser.user?.Name}<br />
                    <Button onClick={() => onRemove(removeUser.user.Id)} style={{ backgroundColor: 'red', marginRight: '1rem', marginTop: '1rem' }}><FontAwesomeIcon icon={faBan} style={{ marginRight: '5px' }}/> Ban</Button>
                    <Button onClick={() => ToggleRemove(removeUser.user.Id)} style={{ backgroundColor: 'forestgreen', marginTop: '1rem' }}>Cancel</Button>
                </DialogContent>
            </Dialog>
            <Typography className={classes.txt} variant="h2">
                Accounts
            </Typography>
            <div className={classes.form}>
                <EntityList
                    columns={[
                        { id: 'name', label:'Name', minWidth: 50 },
                        { id: 'email', label:'Email', minWidth: 50 },
                        { id: 'roles', label:'Roles', minWidth: 100 },
                        { id: 'actions', label: 'Actions', minWidth: 100 },
                    ]}
                    rows={users.map(user => {
                        return {
                            id: user.Id,
                            name: user.Name,
                            email: user.Email,
                            roles: user.Roles.map((role, index) => { if (index > 0) return ", " + role.Name; else return role.Name; }),
                            actions: <RowActions rowEntityId={user.Id} rowEntity={user} onDetails={onDetails} onEdit={onEdit} onRemove={ToggleRemove} />
                        }
                    })}
                />
            </div>
        </div>
    );
};