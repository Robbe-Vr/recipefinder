import React, { useState, useEffect, useContext } from "react";
import { useAPI } from "../API/api-context";

const ACCOUNT_LS = "recipefinder_account";

const AccountContext = React.createContext({});

export function Authenticate({ children }) {

    const { Api } = useAPI();

    const [account, setAccount] = useState({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        async function checkLogin() {

            function getTokens() {
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

                    setLoaded(true);
                }
                else
                {
                    var accessToken;
                    var userId;
                    if ((accessToken = getParam('Token')) && (userId = getParam('UserId'))) {
                        setTokens(accessToken, userId);
                    }
                }
            };
        
            function setTokens(accessToken, userId) {
                if (account?.AccessToken === accessToken && account?.Id) {
                    return;
                }
        
                Api.Custom.GetUserByAccessToken({ [Api.AccessTokenHeaderName]: accessToken }).then((user) => {
                    var acc = {
                        ...account,
                        Id: user.Id,
                        Name: user.Name,
                        Email: user.Email,
                        Roles: user.Roles,
                        AccessToken: accessToken,
                    };
            
                    localStorage.setItem(ACCOUNT_LS, JSON.stringify(acc));
                    setAccount(acc);
                    
                    setLoaded(true);
                })
                .catch((error) => {
                    console.log(error);
        
                    setLoaded(true);
                });
            };

            var localAccStr = localStorage.getItem(ACCOUNT_LS);
            var localAcc = {};

            try
            {
                localAcc = JSON.parse(localAccStr);
            }
            catch (e)
            {
                console.log(e);
            }

            if (window.location.pathname === '/returnAuthorization' && !(localAcc?.AccessToken && localAcc?.Id)) {
                getTokens();

                return;
            }

            if (!localAcc) {
                console.log("No local account found.");

                setLoaded(true);

            } else if (!localAcc.AccessToken || localAcc.AccessToken.length !== 45) {
                console.log('User not authenticated.');

                setLoaded(true);

            } else {
                const tokenValidation = await Api.Custom.ValidateAccessToken({ [Api.AccessTokenHeaderName]: localAcc.AccessToken });

                if (tokenValidation.Result === "Success.") {
                    console.log("Token validated.");

                    if (account?.AccessToken !== localAcc.AccessToken) {
                        var accWithUser = account;

                        if (!(accWithUser?.Id)) {
                            var user = await Api.Custom.GetUserByAccessToken({ [Api.AccessTokenHeaderName]: localAcc.AccessToken });

                            accWithUser = {
                                ...accWithUser,
                                Id: user.Id,
                                Name: user.Name,
                                Email: user.Email,
                                Roles: user.Roles,
                            };
                        }

                        var correctedAcc = {
                            ...accWithUser,
                            AccessToken: localAcc.AccessToken,
                        }
    
                        localStorage.setItem(ACCOUNT_LS, JSON.stringify(correctedAcc));

                        setAccount(correctedAcc);

                        setLoaded(true);
                    }

                } else {
                    if (window.location.pathname === '/returnAuthorization') {
                        localStorage.removeItem(ACCOUNT_LS);

                        getTokens();

                        return;
                    }

                    console.log("Token invalid. Refreshing...");

                    const newToken = await Api.Custom.RefreshAccessToken({ [Api.AccessTokenHeaderName]: localAcc.AccessToken });

                    if (newToken !== "Error") {
                        console.log("New token received.");

                        var refreshedAcc = {
                            ...account,
                            AccessToken: newToken.access_token,
                        }

                        localStorage.setItem(ACCOUNT_LS, JSON.stringify(refreshedAcc));
                        setAccount(refreshedAcc);

                        setLoaded(true);
                    }
                    else {
                        localStorage.removeItem(ACCOUNT_LS);
                        setAccount({});

                        setLoaded(true);
                    }
                }
            };
        };

        checkLogin();
    }, [account, Api, loaded]);
    	
    const logIn = (name, password) => {
        
    };

    const logOut = () => {
        Api.Custom.LogOut({ [Api.AccessTokenHeaderName]: account?.AccessToken });

        localStorage.removeItem(ACCOUNT_LS);
        setAccount({});
    };

    var contextValue = {
        loaded: loaded,
        registered: account?.Id && account?.AccessToken ? true : false,
        roles: account?.Roles ? account.Roles : [],
        accessToken: account?.AccessToken,
        id: account?.Id,
        name: account?.Name,
        logIn,
        logOut,
    };

    return (
        <AccountContext.Provider value={contextValue}>
            {children}
        </AccountContext.Provider>
    );
};

export function useAccount() {
    return useContext(AccountContext);
};

/*************************/
/* Local Login Functions */
/*************************/
export async function GetUserIdByName(name, UsersApi) {
    if (!name && name.length < 1) { return; }

    const user = await UsersApi.GetByName(name);

    if (user) {
        return user.Id;
    }

    return null;
};

export async function CreateAccount(username, email, password, updateByLogIn, api) {

    const newUser = await createUserObject(api.Custom, username, email, password);

    var res = await api.Users.Create(newUser);

    if (res === 'Error') { return false; }

    updateByLogIn(newUser);

    return true;
};

async function encryptSHA256(CustomApi, value = '', salt = '') {
    try
    {
        return await CustomApi.Encrypt(value, salt);
    }
    catch (e)
    {
        console.log(e);
    }
};

async function generateSalt(CustomApi) {
    try
    {
        return await CustomApi.GetSalt();
    }
    catch (e)
    {
        console.log(e);
    }
};

async function createUserObject(CustomApi, username = '', email = '', password) {
    const salt = await generateSalt(CustomApi);

    return {
        CountId: 0,
        Id: '',
        Name: username,
        Email: email,
        EmailConfirmed: false,
        EmailConfirmationToken: '',
        PasswordHashed: await encryptSHA256(CustomApi, password, salt),
        Salt: salt,
        PhoneNumber: "00 000 0000",
        PhoneNumberConfirmed: false,
        DOB: new Date(),
        CreationDate: new Date(),
        NAME_NORMALIZED: username.toUpperCase(),
        EMAIL_NORMALIZED: email.toUpperCase(),
        SecurityStamp: '',
        ConcurrencyStamp: '',
        LockoutEnabled: false,
        lockoutEnd: null,
        AccessFailedCount: 0,
        Kitchen: null,
        Roles: ((await CustomApi.PerformCustom('get', CustomApi.ApiUrl + "/Roles/byname/Default"))?.data) ?? [],
        Deleted: false,
    };
};