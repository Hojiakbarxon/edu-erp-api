import { generate } from "otp-generator"

export function generateOtp() {
    let otp = generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    })
    return otp
}