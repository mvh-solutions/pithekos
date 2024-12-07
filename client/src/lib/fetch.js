
async function getJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return {
                url,
                ok: false,
                status: response.status
            };
        }
        return {
            url,
            ok: true,
            status: response.status,
            json: await response.json()
        };
    } catch (err) {
        return {
            url,
            ok: false,
            status: 0,
            error: err.message
        }
    }
}

export default getJson;
