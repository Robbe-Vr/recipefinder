import React, { } from "react";

import { Link, useHistory } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";

function AuthorizationCallback({ setTokens, Api }) {
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

    var error;
    if ((error = getParam("Error")))
    {
        console.log(error);
        history.push('/');
    }
    else
    {
        var accessToken;
        var userId;
        if ((accessToken = getParam('Token')) && (userId = getParam('UserId'))) {
            setTokens(accessToken, userId);

            history.push('/');
        }
        else
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
    }
    
    return (
        <div>
            {
                <div>
                    Login completed!
                    <Link to="/home/index">
                        <Button variant="outlined">Go on</Button>
                    </Link>
                </div>
            }
        </div>
    );
};

export { AuthorizationCallback }