import * as dotenv from "dotenv"
dotenv.config()
export let envCongig = {
    port: Number(process.env.PORT || 3000),
    db_url: String(process.env.DB_URL),
    mail: {
        password: String(process.env.MAIL_PASS),
        user: String(process.env.MAIL_USER),
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT)
    },
    token : {
        access_key : String(process.env.ACCESS_TOKEN_KEY),
        access_time : String(process.env.ACCESS_TOKEN_TIME),
        refresh_key : String(process.env.REFRESH_TOKEN_KEY),
        refresh_time : String(process.env.REFRESH_TOKEN_TIME)
    },
    superadmin : {
        full_name : String(process.env.SUPER_ADMIN_FULL_NAME),
        age : Number(process.env.SUPER_ADMIN_AGE),
        phone_number : String(process.env.SUPER_ADMIN_PHONE_NUMBER),
        password  : String(process.env.SUPER_ADMIN_PASSWORD)
    }
}