import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import { EntityList } from "../Global/EntityList";
import { User, UserAction } from "../../models";
import { Card } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCross } from "@fortawesome/free-solid-svg-icons";

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
}));

export default function AccountDetailsPage({ setTitle, Api }) {
    useEffect(() => {
        setTitle && setTitle("Account Details");
    });

    const { userId } = useParams();

    const [userDetails, setUserDetails] = useState(new User());

    useEffect(() => {
        Api.Users.GetById(userId).then((user) => {
            if (user === "Error") { return; }
        
            setUserDetails(user);
        });
    }, [Api.Users, userId]);

    const [userActions, setUserActions] = useState([new UserAction()]);

    useEffect(() => {
        Api.Users.GetActionsByUserId(userId).then((userActions) => {
            if (userActions === "Error") { return; }
        
            setUserActions(userActions);
        });
    }, [Api.Users, userId]);

    const classes = useStyles();

    const db = userDetails.DateOfBirth;
    const cd = userDetails.CreationDate;

    return (
        <div className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                {userDetails.Name} Details
            </Typography>
            {
                userDetails.CountId > 0 ?
                <div>
                    <Typography>
                        Name: {userDetails.Name}
                    </Typography>
                    <Typography>
                        Email: {userDetails.Email}
                    </Typography>
                    <Typography>
                        Phone: {userDetails.PhoneNumber}
                    </Typography>
                    <Typography>
                        Date Of Birth: {`${db.getDate() < 10 ? "0" + db.getDate() : db.getDate()}-${(db.getMonth() + 1) < 10 ? "0" + (db.getMonth() + 1) : (db.getMonth() + 1)}-${(db.getFullYear() < 1000 ? db.getFullYear() < 100 ? db.getFullYear() < 10 ? "000" : "00" : "0" : "") + db.getFullYear()}`}
                    </Typography>
                    <Typography>
                        Creation Date: {`${cd.getDate() < 10 ? "0" + cd.getDate() : cd.getDate()}-${(cd.getMonth() + 1) < 10 ? "0" + (cd.getMonth() + 1) : (cd.getMonth() + 1)}-${(cd.getFullYear() < 1000 ? cd.getFullYear() < 100 ? cd.getFullYear() < 10 ? "000" : "00" : "0" : "") + cd.getFullYear()}` +
                        ` ${cd.getHours() < 10 ? "0" + cd.getHours() : cd.getHours()}:${cd.getMinutes() < 10 ? "0" + cd.getMinutes() : cd.getMinutes()}`}
                    </Typography>
                    <Typography>
                        Roles:
                    </Typography>
                        {userDetails.Roles.map(role => <Card key={role.Id} style={{ margin: '2px', padding: '3px' }}>{role.Name}</Card>)}
                    <Typography>
                        Actions:
                    </Typography>
                    {
                        userActions && userActions.length > 0 ?
                        <EntityList
                            columns={[
                                { id: 'description', label:'Description', minWidth: 100 },
                                { id: 'endpoint', label:'Endpoint', minWidth: 50 },
                                { id: 'onTable', label:'Table', minWidth: 50 },
                                { id: 'refObject', label:'Object', minWidth: 100,
                                    format: (obj) => {
                                        return Object.keys(obj).map((key) => { return "(" + key + "): [ " + obj[key]?.toString() + " ]" }).join(", ");
                                    },
                                },
                                { id: 'success', label:'Was successful?', minWidth: 50 },
                            ]}
                            rows={userActions.map((userAction) => {
                                return {
                                    id: userAction.CountId,
                                    description: userAction.Description,
                                    endpoint: userAction.Endpoint,
                                    refObject: userAction.RefObject,
                                    onTable: userAction.ActionPerformedOnTable,
                                    success: userAction.Success ? <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'forestgreen' }} /> : <FontAwesomeIcon icon={faCross} style={{ color: 'red' }} />,
                                };
                            })}
                        /> :
                        <Typography>
                            No actions have been logged for this user.
                        </Typography>
                    }
                </div>
                : <></>
            }
        </div>
    );
};