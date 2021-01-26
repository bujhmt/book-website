/**
 * @typedef User
 * @property {integer} id
 * @property {string} login.required - unique username
 * @property {string} fullname.required - user fullname
 * @property {number} role - user role(1 - admin, 0 - user) [default]: 0
 * @property {string} registeredAt - registration date in ISO format(YYYY-MM-DDTHH:MM) [default]: the time is now
 * @property {string} avaUrl - url to avatar imagine [default]: null
 * @property {boolean} isEnabled - is user enabled?(1 - yes, 0 - no) [default]: 1
 */
class User {
    id: number
    login: string
    fullname: string
    role: number
    registeredAt: string
    avaUrl: string
    isEnabled: boolean
    password: string
}

export default User
