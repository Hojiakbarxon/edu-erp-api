import * as jwt from 'jsonwebtoken'
import { Response } from 'express'
import { envCongig } from 'src/config/env.congig'

export class Token {
    getAccessToken(payload: object): string {
        let accessToken = jwt.sign(payload, envCongig.token.access_key, {
            expiresIn: '1h'
        })
        return accessToken
    }

    getRefreshToken(res: Response, payload: object): string {
        let refreshToken = jwt.sign(payload, envCongig.token.refresh_key, {
            expiresIn: '7d'
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return refreshToken
    }
    verifyAccess(token : string){
        let isMatch = jwt.verify(token, envCongig.token.access_key)
        return isMatch
    }

    verifyRefresh(token : string){
        let isMatch = jwt.verify(token, envCongig.token.refresh_key)
        return isMatch
    }

}

export default new Token()
