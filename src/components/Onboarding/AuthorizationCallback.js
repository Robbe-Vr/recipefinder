import React, { useState } from "react";

import { Link, useHistory } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";

function AuthorizationCallback({ setTokens, Api }) {
    const { history } = useHistory();

    const [authorizationComplete, setAuthorizationComplete] = useState(false);

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
        var refreshToken;
        if ((accessToken = getParam('AccessToken')) && (refreshToken = getParam('RefreshToken'))) {
            setTokens(accessToken, refreshToken);

            setAuthorizationComplete(true);
        }
        else
        {
            var code;
            var userId;

            if ((userId = getParam('UserId')) && (code = getParam('Code'))) {
                Api.Custom.GetTokens(userId, code).then((data) =>
                    {
                        if (data.access_token && data.refresh_token) {
                            setTokens(data.access_token, data.refresh_token);
                        }
                    });
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
    }
    
    return (
        <div>
            {
                authorizationComplete ?
                <div>
                    Login completed!
                    <Link to="/home/index">
                        <Button variant="outlined">Go on</Button>
                    </Link>
                </div>
                :
                <Typography>
                    Step 2...
                </Typography>
            }
        </div>
    );
};

export { AuthorizationCallback }