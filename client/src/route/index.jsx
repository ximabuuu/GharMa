import {createBrowserRouter} from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home.jsx'
import SearchPage from '../pages/SearchPage.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import ForgotPassword from '../pages/ForgotPassword.jsx'
import Otp from '../pages/Otp.jsx'
import ResetPassword from '../pages/ResetPassword.jsx'
import UserMobile from '../pages/UserMobile.jsx'
import Dashboard from '../layouts/Dashboard.jsx'
import Profile from '../pages/Profile.jsx'
import Orders from '../pages/Orders.jsx'
import Address from '../pages/Address.jsx'
import Category from '../pages/Category.jsx'
import SubCategory from '../pages/SubCategory.jsx'
import AddProduct from '../pages/AddProduct.jsx'
import Products from '../pages/Products.jsx'
import AdminPerm from '../layouts/AdminPerm.jsx'
import ProductListPage from '../pages/ProductListPage.jsx'
import ProductDisplay from '../pages/ProductDisplay.jsx'
import OrdersAdmin from '../pages/OrdersAdmin.jsx'
import CartMobile from '../pages/CartMobile.jsx'
import CheckOutPage from '../pages/CheckOutPage.jsx'
import Payment from '../component/Payment/Payment.jsx'
import Success from '../component/Payment/Success.jsx'
import Failure from '../component/Payment/Failure.jsx'
import AboutUs from '../component/AboutUs.jsx'
import ContactUs from '../component/ContactUs.jsx'
import PrivacyPolicy from '../component/PrivacyPolicy.jsx'
import PopUp from '../pages/PopUp.jsx'
import OrdersUser from '../pages/OrdersUser.jsx'
import WorkerPerm from '../layouts/WorkerPerm.jsx'

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "search",
                element : <SearchPage/>
            },
            {
                path : "login",
                element : <Login/>
            },
            {
                path : "register",
                element : <Register/>
            },
            {
                path : "forgot-password",
                element : <ForgotPassword/>
            },
            {
                path : "otp",
                element : <Otp/>
            },
            {
                path : "reset-password",
                element : <ResetPassword/>
            },
            {
                path : "user",
                element : <UserMobile/>
            },
            {
                path : "dashboard",
                element : <Dashboard/>,
                children : [
                    {
                        path : "profile",
                        element : <Profile/>
                    },
                    {
                        path : "myorders",
                        element : <Orders/>
                    },
                    {
                        path : "address",
                        element : <Address/>
                    },
                    {
                        path : "category",
                        element : <AdminPerm><Category/></AdminPerm>
                    },
                    {
                        path : "subcategory",
                        element : <AdminPerm><SubCategory/></AdminPerm>
                    },
                    {
                        path : "add-product",
                        element : <AdminPerm><AddProduct/></AdminPerm>
                    },
                    {
                        path : "products",
                        element : <AdminPerm><Products/></AdminPerm>
                    },
                    {
                        path : "allorders",
                        element : <AdminPerm><OrdersAdmin/></AdminPerm>
                    },
                    {
                        path : "popup",
                        element : <AdminPerm><PopUp/></AdminPerm>
                    },
                    {
                        path : "orders",
                        element : <WorkerPerm><OrdersUser/></WorkerPerm>
                    }
                ]
            },
            {
                path : ":category",
                children : [
                    {
                        path : ":subCategory",
                        element : <ProductListPage/>
                    }
                ]

            },
            {
                path : "product/:product",
                element : <ProductDisplay/>
            },
            {
                path : "cart",
                element : <CartMobile/>
            },
            {
                path : "checkout",
                element : <CheckOutPage/>
            },
            {
                path : "payment",
                element : <Payment/>
            },
            {
                path : "success",
                element : <Success/>
            },
            {
                path : "failure",
                element : <Failure/>
            },
            {
                path : "aboutus",
                element : <AboutUs/>
            },
            {
                path : "contact",
                element : <ContactUs/>
            },
            {
                path : "privacypolicy",
                element : <PrivacyPolicy/>
            }
        ]
    }
])

export default router