import superagent from "superagent"

let url = process.env.REACT_APP_SPOTIFY_API

let player = {
    token: (token) => {
        return {
            play_album: (id) => {
                return superagent.put(url + "/v1/me/player/play")
                    .set({ "Authorization": `Bearer ${token}` })
                    .send({
                        context_uri: id
                    }).then(res => {
                        return res
                    }).catch(err => {
                        return err
                    })
            },
            resume: () => {
                superagent.put(url + "/v1/me/player/play")
                    .set({ "Authorization": `Bearer ${token}` })
                    .then(res => {
                        return res
                    }).catch(err => {
                        return err
                    })
            },
            pause: () => {
                superagent.put(url + "/v1/me/player/pause")
                    .set({ "Authorization": `Bearer ${token}` })
                    .then(res => {
                        return res
                    }).catch(err => {
                        return err
                    })
            },
            seek: (position) => {
                superagent.put(url + "/v1/me/player/seek")
                    .query({ position_ms: position })
                    .set({ "Authorization": `Bearer ${token}` })
                    .then(res => {
                        return res
                    }).catch(err => {
                        return err
                    })
            },
            skip: () => {
                superagent.post(url + "/v1/me/player/next")
                    .set({ "Authorization": `Bearer ${token}` })
                    .then(res => {
                        return res
                    }).catch(err => {
                        return err
                    })
            },
            previous: () => {
                superagent.post(url + "/v1/me/player/previous")
                    .set({ "Authorization": `Bearer ${token}` })
                    .then(res => {
                        return res
                    }).catch(err => {
                        return err
                    })
            },
            repeat: (state) => {
                superagent.put(url + "/v1/me/player/repeat")
                    .send({ state }) // track, context or off
                    .set({ "Authorization": `Bearer ${token}` })
                    .then(res => {
                        return res
                    }).catch(err => {
                        return err
                    })
            }
        }
    }
}

export default player