import crypto from "crypto"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
export const  generateRandomTokens = async()=>{
    const unHashedToken =  crypto.randomBytes(20).toString("hex");

    const hashedToken =  crypto.createHash("sha256").update(unHashedToken).digest("hex")
    
    const tokenExpiry = Date.now() + 20 * 60 * 1000 // 20 minutes

    return { unHashedToken , hashedToken , tokenExpiry};
}


export const generateAccessToken = async(id)=>{
    try {
        const accessToken = jwt.sign({
            id
        },process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }) 
        return accessToken
    } catch (error) {
        console.log("Error generating access token");
        return null;
    }
}

export const generateRefreshToken = async(id)=>{
    try {
        const refreshToken = jwt.sign({
            id
        },process.env.REFRESH_TOKEN_SECRET,{
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        })
        return refreshToken
    } catch (error) {
        console.log("Error generating refresh token");
        return null;
    }
}
