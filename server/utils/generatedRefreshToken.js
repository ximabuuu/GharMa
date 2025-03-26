import UserModel from "../models/user.model.js"
import jwt from 'jsonwebtoken'

const generatedRefreshToken = async (userId)=>{
     const token = jwt.sign({ id : userId},process.env.SECRET_REFRESH_KEY_TOKEN,{ expiresIn : '7d'})

     const updateRefreshTokenUser = await UserModel.updateOne(
        {_id : userId},
        {refresh_token : token}
    )
        return token
}

export default generatedRefreshToken