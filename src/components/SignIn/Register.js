import React, { useEffect, useState } from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { UserInputComponent } from "./UserInputComponent";

import { makeStyles } from "@material-ui/core/styles";
import { useAccount, CreateAccount } from "../../ConnectAPI/index";

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
    errorTxt: { textAlign: "center", color: "red" },
    form: {

    }
}));

export default function RegisterPage({ setTitle, onSuccess, GetEntityGroup }) {
    useEffect(() => {
        setTitle && setTitle("Register");
    });

    const { updateByLogIn } = useAccount();

    const [errorMsgs, setErrorMsgs] = useState([""]);

    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [DOB, setDOB] = useState(Date);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function Register(username, email, password, confirmpassword) {
        var newErrors = [''];
        newErrors.pop();

        if (password !== confirmpassword) {
            newErrors.push('Passwords are not equal!');
        }
        if (userName.length < 2) {
            newErrors.push('Invalid username!');
        }
        if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
            newErrors.push('Invalid email!');
        }

        if (newErrors.length > 0) {
            setErrorMsgs(newErrors);
        } else {
            await CreateAccount(username, email, password, updateByLogIn, GetEntityGroup);
            onSuccess();
        }
    };

    const classes = useStyles();

    return (
        <div className={classes.paper}>
            <Typography className={classes.txt} variant="h2">
                Register
            </Typography>
            <div className={classes.form}>
                {
                    errorMsgs.length > 0 ? (
                        <div className={classes.errorTxt}>
                            <ul>
                                {
                                    errorMsgs.map((error, key) =>
                                        (<li>{error}</li>)
                                    )
                                }
                            </ul>
                        </div>
                    ) : <div></div>
                }
                

                <UserInputComponent name="Email" onChange={(value) => { setEmail(value); }} />
                <UserInputComponent name="UserName" onChange={(value) => { setUserName(value); }} />
                <UserInputComponent name="DOB" type="datetime" onChange={(value) => { setDOB(value); }} />
                <UserInputComponent name="Password" type="password" onChange={(value) => { setPassword(value); }} />
                <UserInputComponent name="ConfirmPassword" type="password" onChange={(value) => { setConfirmPassword(value); }} />

                <Button
                    color="primary"
                    variant="outlined"
                    onClick={async () => { await Register(email, userName, DOB, password, confirmPassword); }}
                >
                    Register
                </Button>
            </div>
        </div>
    );
};