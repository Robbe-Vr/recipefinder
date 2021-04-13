import React, { useEffect, useState } from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { UserInputComponent } from "../Global/UserInputComponent";

import { makeStyles } from "@material-ui/core/styles";
import { useAccount, CreateAccount } from "../../API/index";
import { Grid } from "@material-ui/core";

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

    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
    }
}));

export default function RegisterPage({ setTitle, onSuccess, Api }) {
    useEffect(() => {
        setTitle && setTitle("Register");
    });

    const minimumAge = 16;

    var d = new Date();
    const defaultMinimumAgeDate = `${d.getFullYear() - minimumAge}-${(d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : ""}-${d.getDate() < 10 ? "0" + d.getDate() : ""}`;

    const { updateByLogIn } = useAccount();

    const [errorMsgs, setErrorMsgs] = useState([]);

    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [DOB, setDOB] = useState(defaultMinimumAgeDate);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function Register(username, email, DOB, password, confirmpassword) {
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

        var parts = DOB.split(' ');
        let year = parseInt(parts[3]);
        let month = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'].indexOf(parts[1]);
        let date = parseInt(parts[2]);
        var dateOfBirth = new Date(year, month, date, 0, 0, 0, 0);
        var d = new Date();
        const minimumAgeYear = d.getFullYear() - minimumAge;
        if (dateOfBirth.getFullYear() > minimumAgeYear ||
        (dateOfBirth.getFullYear() === minimumAgeYear && dateOfBirth.getMonth() > d.getMonth()) ||
        (dateOfBirth.getFullYear() === minimumAgeYear && dateOfBirth.getMonth() === d.getMonth() && dateOfBirth.getDate() > d.getDate()))
        {
            newErrors.push(`You need to be older than ${minimumAge} years to create an account!`);
        }

        if (newErrors.length > 0) {
            setErrorMsgs(newErrors);
        } else {
            const success = await CreateAccount(username, email, password, updateByLogIn, Api);
            if (success)
            {
                onSuccess();
            }
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
                <UserInputComponent name="DOB" type="date" defaultValue={defaultMinimumAgeDate} onChange={(value) => { setDOB(value); }} />
                <UserInputComponent name="Password" type="password" onChange={(value) => { setPassword(value); }} />
                <UserInputComponent name="ConfirmPassword" type="password" onChange={(value) => { setConfirmPassword(value); }} />

                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Button
                        className={classes.btn}
                        color="primary"
                        variant="outlined"
                        onClick={async () => { await Register(userName, email, DOB, password, confirmPassword); }}
                    >
                        Register
                    </Button>
                </Grid>
                
                <Typography
                    variant="subtitle2"
                >
                    Or if you already have an account, <a href="/signin/login">login here</a>
                </Typography>
            </div>
        </div>
    );
};