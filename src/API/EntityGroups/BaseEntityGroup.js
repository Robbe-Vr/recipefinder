const axios = require('axios').default;

const protocol = window.location.protocol + "//",
     serverIp = window.location.hostname === "localhost" ? "localhost" : 
                window.location.hostname === "192.168.2.101" ? "192.169.2.101" :
                window.location.hostname.indexOf("sywapps.com") > -1 ? "recipefinderapi.sywapps.com" : (() => { throw new Error("Unknown hostname hosting the application! Not connecting to Api."); })(),
    port = 5001, apiPage = "/api",
    api_url = protocol + serverIp + ":" + port + apiPage;

export {
    protocol,
    serverIp,
    port,
    apiPage,
    api_url,
};

const defaultHeaders = (data) => ({ "Accept": "*/*", "Content-Type": "application/json" });

export const AccessTokenHeaderName = "RecipeFinder_AccessToken";

var accessToken;
const AuthorizationHeaders = () => {
    if (!accessToken) {
        accessToken = getAccessToken();
    }

    return ({ [AccessTokenHeaderName]: accessToken });
};

function HandlerError(error) {
    if (error.response) {
        console.log(`${error.response.status} - `, error.response.data.Message ?? error.response.data);
    } else if (error.request) {
        console.log(`Request failed: `, error.request);
    } else {
        console.log(`Axios request execution fail: ${error.message}`, error);
    }

    return "Error";
};

function getAccessToken() {
    const ACCOUNT_LS = "recipefinder_account";

    var account = localStorage.getItem(ACCOUNT_LS);

    try
    {
        account = JSON.parse(account);
    }
    catch (e)
    {
        console.log(e);
        account = {};
    }

    return account?.AccessToken;
};

export class EntityGroup {
    constructor(groupName = '', api_path = '') {
        this.Name = groupName;
        this.ApiUrl = api_url + (api_path.length > 0 ? "/" + api_path : '');

        if (!accessToken) {
            getAccessToken();
        }
    };

    ApiUrl = '';
    Name = '';

    async GetAll() {
        try
        {
            var response = await axios.get(this.ApiUrl, { headers: AuthorizationHeaders() });

            return response.data;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    };

    async GetById(id = '') {
        try
        {
            var response = await axios.get(this.ApiUrl + "/" + id, { headers: AuthorizationHeaders() });

            return response.data;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    };

    async GetByName(name = '') {
        try
        {
            var response = await axios.get(this.ApiUrl + "/byname/" + name, { headers: AuthorizationHeaders() });

            return response.data;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    };

    async Create(newObj = {}) {
        try
        {
            const data = JSON.stringify(newObj, null, 4);

            var response = await axios.post(this.ApiUrl,
                data,
                { headers: { ...(defaultHeaders(data)), ...AuthorizationHeaders() } });

            return response;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    };

    async Update(id = '', updatedObj = {}) {
        try
        {
            const data = JSON.stringify(updatedObj, null, 4);

            var response = await axios.put(this.ApiUrl + "/" + id,
                data,
                { headers: { ...(defaultHeaders(data)), ...AuthorizationHeaders() } });

            return response;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    };

    async Delete(id = '', obj = {}) {
        try
        {
            const data = JSON.stringify(obj, null, 4);

            var response = await axios.delete(this.ApiUrl + '/' + id,
                { headers: { ...(defaultHeaders(data)), ...AuthorizationHeaders() } });

            return response;
        }
        catch (e)
        {
            return HandlerError(e);
        }
    };

    async PerformCustom(type = 'get', url, obj = {}, headers = {}) {
        try
        {
            var response = {};

            headers = { ...AuthorizationHeaders(), ...headers };

            if (type === 'get')
            {
                response = await axios.get(url, { headers: headers });
            }
            else if (type === 'post')
            {
                const data = JSON.stringify(obj, null, 4);

                headers = { ...defaultHeaders(data), ...headers };

                response = await axios.post(url, data,
                    { headers: headers });
            }
            else if (type === 'put')
            {
                const data = JSON.stringify(obj, null, 4);

                headers = { ...defaultHeaders(data), ...headers };

                response = await axios.put(url, data,
                    { headers: headers });
            }
            else if (type === 'delete')
            {
                const data = JSON.stringify(obj, null, 4);

                headers = { ...defaultHeaders(data), ...headers };

                response = await axios.delete(url, data,
                    { headers: headers });
            }
            else response = 'Invalid request type!';

            return response;
        }
        catch (e)
        {
            console.log(`Failed request to '${url}' as ${type.toUpperCase()}`, e);

            HandlerError(e);

            return { info: e, error: true, data: "Error" };
        }
    };
};