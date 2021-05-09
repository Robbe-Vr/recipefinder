import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faUtensils } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(() => ({
    form: {
        width: '100%',
        height: '100%',
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    txt: { textAlign: "center" },
    continue: {
        marginTop: "20px",
        width: "20%",
    },
}));

function HomePage({ setTitle, name, userId }) {
    useEffect(() => {
        setTitle && setTitle("Home");
    });

    const classes = useStyles();

    return (
        <div className={classes.form} style={{ height: window.innerHeight * 0.6 }}>
            <Typography className={classes.txt} variant="h1">
                Hello {name}!
            </Typography>
            <Link to="/kitchen/index" style={{ width: '100%', height: '50%', margin: '.5rem', textDecoration: 'none' }}>
                <Button style={{ backgroundColor: 'skyblue', marginBottom: '10px', width: "100%", height: "100%", fontSize: 25 }}><FontAwesomeIcon icon={faUtensils} style={{ marginRight: '5px' }}/>Your Kitchen</Button>
            </Link>
            <Link to="/recipebook/index" style={{ width: '100%', height: '50%', margin: '.5rem', textDecoration: 'none' }}>
                <Button style={{ backgroundColor: 'forestgreen', marginBottom: '10px', width: "100%", height: "100%", fontSize: 25 }}><FontAwesomeIcon icon={faBookOpen} style={{ marginRight: '5px' }}/>Recipe Book</Button>
            </Link>
        </div>
    );
};

export { HomePage };