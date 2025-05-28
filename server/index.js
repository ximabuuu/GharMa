import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.route.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import reviewRouter from './route/review.route.js'
import { EsewaInitiatePayment,paymentStatus } from './controllers/esewa.controller.js'
import esewaRouter from './route/esewa.route.js'
import AddressRouter from './route/address.route.js'
import OrderRouter from './route/order.route.js'
import PopUpRouter from './route/popup.route.js'

const app = express()
app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(helmet({
    crossOriginResourcePolicy : false
}))

const PORT = process.env.PORT || 8080;

app.get("/",(request,response)=>{
    response.json({
        message : "Server is running"
    })
})

app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter)
app.use('/api/file',uploadRouter)
app.use('/api/subcategory',subCategoryRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/review',reviewRouter)
app.use("/api/esewa", esewaRouter)
app.use('/api/address',AddressRouter)
app.use('/api/order',OrderRouter)
app.use('/api/popup',PopUpRouter)

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running",PORT)
    }) 
})



