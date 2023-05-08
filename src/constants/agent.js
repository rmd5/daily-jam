import superagent from "superagent"

let url = process.env.REACT_APP_API_URL

let agent = {
    get: (path, headers, params) => {
        return superagent.get(url + path).set(headers).query(params)
            .then(res => {
                return [200, res.body.data, null]
            })
            .catch(err => {
                return [err.status, null, err.message]
            })
    },
    post: (path, headers, body) => {
        return superagent.post(url + path).set(headers).send(body)
            .then(res => {
                return [200, res.body.data, null]
            })
            .catch(err => {
                return [err.status, null, err.message]
            })
    }
}

export default agent