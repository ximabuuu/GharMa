export const baseURL = import.meta.env.VITE_API_URL

const SummaryApi = {
    register: {
        url: '/api/user/register',
        method: 'POST'
    },
    login: {
        url: '/api/user/login',
        method: 'POST'
    },
    forgot_password: {
        url: '/api/user/forgot-password',
        method: 'PUT'
    },
    otp: {
        url: '/api/user/verify-forgot-password-otp',
        method: 'PUT'
    },
    resetPassword: {
        url: '/api/user/reset-password',
        method: 'PUT'
    },
    refreshToken: {
        url: '/api/user/refresh-token',
        method: 'POST'
    },
    userDetails: {
        url: '/api/user/user-details',
        method: 'GET'
    },
    logout: {
        url: '/api/user/logout',
        method: 'GET'
    },
    uploadAvatar: {
        url: '/api/user/upload-avatar',
        method: 'PUT'
    },
    updateUserDetails: {
        url: '/api/user/update-user',
        method: 'PUT'
    },
    addCategory: {
        url: '/api/category/add-category',
        method: 'POST'
    },
    uploadImage: {
        url: '/api/file/upload',
        method: 'POST'
    },
    getCategory: {
        url: '/api/category/getCategory',
        method: 'GET'
    },
    updateCategory: {
        url: '/api/category/update',
        method: 'PUT'
    },
    deleteCategory: {
        url: '/api/category/delete',
        method: 'DELETE'
    },
    addsubcategory: {
        url: '/api/subcategory/add',
        method: 'POST'
    },
    getsubcategory: {
        url: '/api/subcategory/get',
        method: 'GET'
    },
    updatesubcategory: {
        url: '/api/subcategory/update',
        method: 'PUT'
    },
    deletesubcategory: {
        url: '/api/subcategory/delete',
        method: 'DELETE'
    },
    addProduct: {
        url: '/api/product/add',
        method: 'POST'
    },
    getProduct: {
        url: '/api/product/get',
        method: 'GET'
    },
    getProductByCategory: {
        url: '/api/product/get-by-category',
        method: 'POST'
    },
    getProductByCategorySubcategory: {
        url: '/api/product/get-by-category-subcategory',
        method: 'POST'
    },
    getProductDetails: {
        url: '/api/product/get-product-details',
        method: 'POST'
    },
    updateProduct: {
        url: '/api/product/update',
        method: 'PUT'
    },
    deleteProduct: {
        url: '/api/product/delete',
        method: 'DELETE'
    },
    searchProduct: {
        url: '/api/product/search-products',
        method: 'POST'
    },
    addtocart: {
        url: '/api/cart/add',
        method: 'POST'
    },
    getCartItem: {
        url: '/api/cart/get',
        method: 'GET'
    },
    updateCartQty: {
        url: '/api/cart/update-qty',
        method: 'PUT'
    },
    deleteCartItem: {
        url: '/api/cart/delete',
        method: 'DELETE'
    },
    clearCart: {
        url: '/api/cart/clear',
        method: 'DELETE'
    },
    addReview: {
        url: '/api/review/add',
        method: 'POST'
    },
    getReview: {
        url: '/api/review/get',
        method: 'GET'
    },
    esewaPay: {
        url: '/api/esewa/initiate-payment',
        method: 'POST'
    },
    esewaStatus: {
        url: '/api/esewa/payment-status',
        method: 'POST'
    },
    addAddress: {
        url: '/api/address/add',
        method: 'POST'
    },
    getAddress: {
        url: '/api/address/get',
        method: 'GET'
    },
    updateAddress: {
        url: '/api/address/update',
        method: 'PUT'
    },
    deleteAddress: {
        url: '/api/address/delete',
        method: 'DELETE'
    },
    CashOnDelivery: {
        url: '/api/order/cashOnDelivery',
        method: 'POST'
    },
    AllCash: {
        url: '/api/order/get',
        method: 'GET'
    },
    AllEsewa: {
        url: '/api/esewa/get',
        method: 'GET'
    },
    updateOrderStatus: (orderId) => ({
        url: `/api/order/${orderId}`,
        method: 'PUT'
    }),
    updateEsewaStatus: (orderId) => ({
        url: `/api/esewa/${orderId}`,
        method: 'PUT'
    }),
    UserOrder: {
        url: '/api/order/getorder',
        method: 'GET'
    },
    contact: {
        url: '/api/user/sendemail',
        method: 'POST'
    },
    getUserTransaction: {
        url: '/api/esewa/get-userTransaction',
        method: 'GET'
    },
    addPopUp: {
        url: '/api/popup/add',
        method: 'POST'
    },
    getPopUp: {
        url: '/api/popup/get',
        method: 'GET'
    }
}

export default SummaryApi