import React, { } from "react";

import { Link, useHistory } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";

function AuthorizationCallback({ Api }) {
    const history = useHistory();

    function getParam(key) {
        const segments = window.location.search.substr(1).split('&');

        var value;

        segments.forEach((segment) => {
            var keyToValue = segment.split('=');

            var param = { key: keyToValue[0], value: keyToValue[1] };

            if (param.key === key) {
                value = param.value;
                return;
            }
        });

        return value;
    }

    if (getParam("Error"))
    {
        return (
            <div>
                <Typography
                    variant="h1"
                >
                    Error occurred during authorization!
                </Typography>
            </div>
        );
    }
    else {
        history.push('/home/index');
    }
    
    return (
        <div>
            Login completed!
            <Link to="/home/index">
                <Button variant="outlined">Go on</Button>
            </Link>
        </div>
    );
};

export { AuthorizationCallback }