import { FormatError, AuthError } from '../errors'

function validateString(string, explain = 'string') {
    if (typeof string !== 'string') throw new TypeError(`${explain} is not a string`)
}

function validateStringNotEmptyOrBlank(string, explain = 'string') {
    validateString(string, explain)

    if (!string.length) throw new FormatError(`${explain} is empty`)

    if (!string.trim().length) throw new FormatError(`${explain} is blank`)
}

function validateStringNotEmptyNoSpaces(string, explain = 'string') {
    validateString(string, explain)

    if (!string.length) throw new FormatError(`${explain} is empty`)

    if (string.includes(' ')) throw new FormatError(`${explain} has spaces`)
}

function validateJwt(token) {
    validateString(token, 'token')

    const parts = token.split('.')

    if (parts.length !== 3 || !parts.every(part => part.length > 0)) throw new FormatError('invalid token format')

    const [,b64Payload] = parts

    const jsonPayload = atob(b64Payload)

    const payload = JSON.parse(jsonPayload) 

    const { exp } = payload

    const now = Math.round(Date.now() / 1000)

    if (now > exp) throw new AuthError('token expired')
}

function isJwtValid(token) {
    try {
        validateJwt(token)

        return true
    } catch(error) {
        return false
    }
}

function validatePassword(password, explain = 'password') {
    validateString(password, explain)

    if (password.length < 8)
        throw new FormatError(`${explain} length is lower than 8`)
}



function validateUsername(username) {
    validateStringNotEmptyNoSpaces(username, 'username')

    if (username.length < 4)
        throw new FormatError('username length is lower than 4')
}

export {
    validateString,
    validateStringNotEmptyOrBlank,
    validateStringNotEmptyNoSpaces,
    validateJwt,
    isJwtValid,
    validatePassword,
    validateUsername
}