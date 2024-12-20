async function getJson(url, debug=false) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const result = {
                url,
                ok: false,
                status: response.status
            };
            if (debug) {
                console.log("getJson", result);
            }
            return result;
        }
        const result = {
            url,
            ok: true,
            status: response.status,
            json: await response.json()
        };
        if (debug) {
            console.log("getJson", result);
        }
        return result;
    } catch (err) {
        const result = {
            url,
            ok: false,
            status: 0,
            error: err.message
        };
        if (debug) {
            console.log("getJson", result);
        }
        return result;
    }
}
async function getText(url, debug=false) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const result = {
                url,
                ok: false,
                status: response.status
            };
            if (debug) {
                console.log("getText", result);
            }
            return result;
        }
        const result = {
            url,
            ok: true,
            status: response.status,
            text: await response.text()
        };
        if (debug) {
            console.log("getText", result);
        }
        return result;
    } catch (err) {
        const result = {
            url,
            ok: false,
            status: 0,
            error: err.message
        };
        if (debug) {
            console.log("getText", result);
        }
        return result;
    }
}

const getAndSetJson = async ({url, setter}) => {
    const response = await getJson(url);
    if (response.ok
    ) {
        setter(response.json);
    }
}

export {getJson, getAndSetJson, getText};
