import React from "react";

import { Link, Route } from "react-router-dom";
import { Button } from "@material-ui/core";

function AuthorizationCallback({ setTokens }) {
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

    setTokens(getParam('AccessToken'), getParam('RefreshToken'));
    
    return (
        <div>
            Login completed!
            <Link to="/home/index">
                <Button variant="outlined">Go on</Button>
            </Link>
            {/* <Route component={() => {
                window.location.href = "/";
                return null;
            }}>

            </Route> */}
        </div>
    );
};

export { AuthorizationCallback }