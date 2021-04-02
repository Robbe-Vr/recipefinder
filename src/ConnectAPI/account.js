import React, { useState, useEffect, useContext } from "react";
import { useAPI } from "./api";

const ACCOUNT_LS = "recipefinder_account";

const AccountContext = React.createContext({});

export function AttemptLogIn({ children }) {

    const { Users } = useAPI();

    const [account, setAccount] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function LoginWithSavedAccount(account) {
            if (!account.id || !account.passwordHashed) {
                console.log("Currently saved account is invalid!");
                return false;
            }
            const user = await Users.GetById(account.id);
    
            if (!user || !user.passwordHashed) {
                console.log("Could not get user by currently saved user's Id!");
                return false;
            }
            
            console.log(user);

            return user.passwordHashed === account.passwordHashed;
        };

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

            if (savedAccount && account && savedAccount.id === account.id) {
                console.log("Already logged in!");
            }
            else if (savedAccount && await LoginWithSavedAccount(savedAccount)) {
                console.log("Log In successfull for " + savedAccount.name);
                setAccount(savedAccount);
            }
            else {
                console.log("Failed to Log In with currently saved account!");
            }
            setLoaded(true);
        };

        console.log("Attempting Log In...");
        checkLogin();
    }, [account, Users, loaded]);

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
            registered: isRegistered,
            roles: newRoles,
        });
    };

    const updateByLogIn = (loggedInAccount) => {
        updateAccount({
            registered: true,
            ...loggedInAccount,
        });
    };

    const logOut = () => {
        localStorage.removeItem(ACCOUNT_LS);
    };

    if (account?.id) {
        console.log("Account Id exists. " + account.id);
    }

    var contextValue = {
        ourKeys: account?.keys,
        ourPub: account?.pub,
        loaded,
        registered: account ? true : false,
        roles: account?.roles ? account.roles : [],
        id: account?.id,
        name: account?.name,
        updateRegistered,
        updateByLogIn,
        logOut,
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
        return user.id;
    }

    return null;
};

export function CurrentAccount() {
    const CurrentAccount = localStorage.getItem(ACCOUNT_LS);

    if (CurrentAccount !== null) {
        return JSON.parse(CurrentAccount);
    } else return { error: "Not signed in!" };
};

export async function LogIn(id, password, updateByLogIn, api) {
    if (!id || !password || id.length < 1 || password.length < 1) { return; }

    const user = await api.Users.GetById(id);

    if (user !== null && user.passwordHashed === await encryptSHA256(api.Custom, password, user.salt)) {
        updateByLogIn(user);
        return true;
    }

    return false;
};

export async function CreateAccount(username, email, password, updateByLogIn, api) {

    const newUser = createUserObject(api.Custom, username, email, password);

    await api.Users.create(newUser);

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

async function createUserObject(CustomApi, username, email, password) {
    const salt = await generateSalt(CustomApi);

    return {
        name: username,
        email: email,
        password: encryptSHA256(CustomApi, password, salt),
        salt: salt,
        roles: ['defaultUser'],
    };
};

export function useAccount() {
    return useContext(AccountContext);
};