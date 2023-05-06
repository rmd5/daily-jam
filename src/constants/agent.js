import superagent from "superagent"

let url = process.env.REACT_APP_API_URL

export default {
    get: (path, params) => {
        return superagent.get(url + path).send(params)
            .then(res => {
                return [200, res, null]
            })
            .catch(err => {
                return [err.status, null, err.error]
            })
    },
    post: (path, body) => {
        return superagent.post(url + path).send(body)
            .then(res => {
                return [200, res, null]
            })
            .catch(err => {
                return [err.status, null, err.error]
            })
    }
}