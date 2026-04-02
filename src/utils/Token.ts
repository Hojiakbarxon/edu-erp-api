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

//TEMPORARY
// import * as jwt from 'jsonwebtoken'
// import { Response } from 'express'

// export class Token {
//   getAccessToken(payload: object): string {
//     let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
//       expiresIn: process.env.ACCESS_TOKEN_TIME
//     })
//     return accessToken
//   }

//   getRefreshToken(res: Response, payload: object): string {
//     let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
//       expiresIn: process.env.REFRESH_TOKEN_TIME
//     })

//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: false,
//       maxAge: 30 * 24 * 60 * 60 * 1000
//     })
//     return refreshToken
//   }

//   verifyAccess(token: string): any {
//     let isMatch = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
//     return isMatch
//   }

//   verifyRefresh(token: string): any {
//     let isMatch = jwt.verify(token, process.env.REFRESH_TOKEN_KEY)
//     return isMatch
//   }
// }

// export default new Token()



// import jwt from "jsonwebtoken"
// import { envConfig } from "../config/index.js"

// class Token{
//     getAccessToken(payload) {
//         let accessToken =  jwt.sign(payload, envConfig.TOKEN.ACCESS_TOKEN_KEY, {
//             expiresIn : envConfig.TOKEN.ACCESS_TOKEN_TIME
//         })
//         return accessToken
//     }

//     getRefreshToken(res,payload){
//         let refreshToken =  jwt.sign(payload, envConfig.TOKEN.REFRESH_TOKEN_KEY, {
//             expiresIn : envConfig.TOKEN.REFRESH_TOKEN_TIME
//         })

//         res.cookie('refreshToken', refreshToken, {
//             httpOnly : true,
//             secure : false,
//             maxAge : 30 * 24 * 60 * 60 * 1000
//         })
//         return refreshToken
//     }
//     verifyAccess(token){
//         let isMatch = jwt.verify(token, envConfig.TOKEN.ACCESS_TOKEN_KEY)
//         return isMatch
//     }
//     verifyRefresh(token){
//         let isMatch = jwt.verify(token, envConfig.TOKEN.REFRESH_TOKEN_KEY)
//         return isMatch
//     }
// }

// export default new Token()

