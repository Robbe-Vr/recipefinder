import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button, Card, Dialog, DialogContent, DialogTitle, Grid } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";

import { EntityList } from "../Global/EntityList";
import { RowActions } from "../Global/RowActions";
import { useNotifications } from "../Global/NotificationContext";

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

    const { error, warning } = useNotifications();

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
            if (typeof users === "string") {
                error(users);

                return;
            }
        
            setUsers(users);
        });
    }, [Api.Users, error]);

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

        Api.Users.Delete(userId, user).then((res) => {
            if (typeof res === "string") {
                error(res);
            } else if (typeof res.data === "string") {
                error(res.data);
            } else if (typeof res.data?.Message === "string") {
                error(res.data.Message);
            } else {
                warning("User has been removed!");
            }
        });
    };

    return (
        <Grid className={classes.paper}>
            <Dialog open={removeUser.dialogOpened} onClose={() => ToggleRemove(removeUser.user.Id)}>
                <DialogTitle>Remove user {removeUser.user?.Name}</DialogTitle>
                <DialogContent>
                    Are you sure you want to remove user: {removeUser.user?.Name}<br />
                    <Button variant="outlined" onClick={() => onRemove(removeUser.user.Id)} style={{ color: 'red', borderColor: 'red', marginRight: '1rem', marginTop: '1rem' }}><FontAwesomeIcon icon={faBan} style={{ marginRight: '5px' }}/>Ban</Button>
                    <Button variant="outlined" onClick={() => ToggleRemove(removeUser.user.Id)} style={{ color: 'forestgreen', borderColor: 'forestgreen', marginTop: '1rem' }}><FontAwesomeIcon icon={faBan} style={{ marginRight: '5px' }}/>Cancel</Button>
                </DialogContent>
            </Dialog>
            <Typography className={classes.txt} variant="h2">
                Accounts
            </Typography>
            <Grid className={classes.form}>
                <EntityList
                    columns={[
                        { id: 'name', label:'Name', minWidth: 50 },
                        { id: 'email', label:'Email', minWidth: 50 },
                        { id: 'roles', label:'Roles', minWidth: 150 },
                        { id: 'actions', label: 'Actions', minWidth: 100 },
                    ]}
                    rows={users.map(user => {
                        return {
                            id: user.Id,
                            name: user.Name,
                            email: user.Email,
                            roles: user.Roles.map(role => { return <Card key={role.Id} style={{ margin: '2px', padding: '3px' }}>{role.Name}</Card>; }),
                            actions: <RowActions rowEntityId={user.Id} rowEntity={user} onDetails={onDetails} onEdit={onEdit} onRemove={ToggleRemove} />,
                            onClick: (id) => { onDetails(id); },
                        }
                    })}
                />
            </Grid>
        </Grid>
    );
};