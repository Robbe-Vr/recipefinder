import React, { useState, useEffect, useContext } from "react";
import { useAPI } from "../API/api-context";

const ACCOUNT_LS = "recipefinder_account";

const AccountContext = React.createContext({});

export function AttemptLogIn({ children }) {

    const { Api } = useAPI();

    const [account, setAccount] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        async function checkLogin() {
            var savedAccount = localStorage.getItem(ACCOUNT_LS);
            
            try
            {
                savedAccount = JSON.parse(savedAccount);
                console.log(savedAccount)
            }
            catch (e)
            {
                logOut();
                setLoaded(true);
                return;
            }

            if (savedAccount && account && account.AccessToken && account.RefreshToken &&
                savedAccount.AccessToken === account.AccessToken && savedAccount.RefreshToken === account.RefreshToken &&
                ValidateAccessToken(savedAccount.AccessToken, Api)) {
                if (!account.id || !account.name) {
                    
                }
            }
            else if (savedAccount && savedAccount.AccessToken &&
                ValidateAccessToken(savedAccount.AccessToken, Api)) {
                console.log("Log In successfull for " + savedAccount.name);
                setAccount(savedAccount);
            }
            else {
                console.log('Access token validation failed!');
            }

            setLoaded(true);
        };

        console.log("Attempting Log In...");
        checkLogin();
    }, [account, Api, loaded]);

    const updateAccount = (patch) => {
        const newAccount = {
            ...account,
            ...patch,
        };

        console.log("new account: ", newAccount);

        localStorage.setItem(ACCOUNT_LS, JSON.stringify(newAccount));
        setAccount(newAccount);
    };

    const updateRegistered = (isRegistered = false, newRoles = ["defaultUser"]) => {
        updateAccount({
            Registered: isRegistered,
            Roles: newRoles,
        });
    };

    const updateByLogIn = (loggedInAccount) => {
        updateAccount({
            Registered: true,
            ...loggedInAccount,
        });
    };

    const logOut = () => {
        localStorage.removeItem(ACCOUNT_LS);
        setAccount({});
    };

    const setTokens = (accessToken, refreshToken) => {
        GetUserByAccessToken(accessToken, Api).then((user) => {
            user.AccessToken = accessToken;
            user.RefreshToken = refreshToken;
            user.Registered = true;

            updateAccount(user);
        });
    };

    if (account?.Id) {
        console.log("Account Id exists. " + account.Id);
    }

    console.log("account state: ", account)

    var contextValue = {
        loaded,
        registered: account ? true : false,
        roles: account?.Roles ? account.Roles : [],
        accessToken: account?.AccessToken,
        refreshToken: account?.RefreshToken,
        id: account?.Id,
        name: account?.Name,
        updateRegistered,
        updateByLogIn,
        logOut,
        setTokens,
    };

    return (
        <AccountContext.Provider value={contextValue}>
            {children}
        </AccountContext.Provider>
    );
};

export async function GetUserIdByName(name, UsersApi) {
    if (!name && name.length < 1) { return; }

    const user = await UsersApi.GetByName(name);

    if (user) {
        return user.Id;
    }

    return null;
};

export function CurrentAccount() {
    const CurrentAccount = localStorage.getItem(ACCOUNT_LS);

    if (CurrentAccount !== null) {
        return JSON.parse(CurrentAccount);
    } else return { error: "Not signed in!" };
};

export async function ValidateAccessToken(accessToken, Api) {
    var validationResult = await Api.Custom.ValidateAccessToken(accessToken);

    return validationResult;
};

export async function RefreshAccessToken(refreshToken, Api) {
    var refreshResult = await Api.Custom.RefreshAccessToken(refreshToken);

    return refreshResult;
};

export async function GetUserByAccessToken(accessToken, Api) {
    var user = await Api.Custom.GetUserByAccessToken(accessToken);

    console.log("user by accessToken: ", user);

    return user;
};

export async function LogIn(id, password, updateByLogIn, Api) {
    if (!id || !password || id.length < 1 || password.length < 1) { return; }

    const user = await Api.Users.GetById(id);

    if (user !== null && user.PasswordHashed === await encryptSHA256(Api.Custom, password, user.Salt)) {
        updateByLogIn(user);
        return true;
    }

    return false;
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
        Roles: [(await CustomApi.PerformCustom('get', CustomApi.ApiUrl + "/Roles/byname/Default")).data],
        Deleted: false,
    };
};

export function useAccount() {
    return useContext(AccountContext);
};