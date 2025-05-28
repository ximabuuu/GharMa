import React, { useEffect, useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi'
import { fetchAllCashOnDeliv } from '../../../server/controllers/order.controller'

const OrdersUser = () => {

    const [data, setData] = useState([])
    const [cash, setCash] = useState([])
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        fetch("/api/orders")
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch((err) => console.error(err));
    }, []);


    const fetchData = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.AllEsewa
            })
            if (response && response.data && response.data.success) {
                setData(response.data.data)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const fetchCash = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.AllCash
            })
            if (response && response.data && response.data.success) {
                setCash(response.data.data)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateOrderStatus(orderId),
                data: { orderStatus: newStatus },
            });

            if (response?.data) {
                setCash((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, orderStatus: newStatus } : order
                    )
                );
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const updateEsewaStatus = async (orderId, newStatus) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateEsewaStatus(orderId),
                data: { orderStatus: newStatus },
            });

            if (response?.data) {
                setData((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, orderStatus: newStatus } : order
                    )
                );
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };


    useEffect(() => {
        fetchData()
        fetchCash()

    }, [])

    return (
        <section className="flex flex-col gap-8 p-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-300 text-white px-4 py-2 rounded-lg shadow-lg">
                <h1 className="font-semibold text-2xl">All Orders</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <h1 className="font-semibold text-xl text-gray-800 mb-4">Esewa Orders</h1>
                    <ul className="space-y-6 overflow-y-auto max-h-[70vh]">
                        {
                            data.map((item) => (
                                <div key={item._id} className="bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-200">
                                    <li className="text-sm text-gray-600"><span className="font-semibold">Order ID:</span> {item.product_id}</li>
                                    <li className="text-sm text-gray-600"><span className="font-semibold">Customer Name:</span> {item.userId.name}</li>
                                    <p className="text-sm font-semibold text-gray-700 mt-2">Products:</p>
                                    <ul className="list-disc pl-6">
                                        {
                                            item.product_details.map((prod) => (
                                                <li key={prod.name} className="text-sm text-gray-600">{prod.name} - Qty {prod.quantity} - {prod.unit}</li>
                                            ))
                                        }
                                    </ul>
                                    <div className="flex justify-between text-sm text-gray-600 mt-4">
                                        <div><span className="font-semibold">Total Qty:</span> {item.totalQty}</div>
                                        <div><span className="font-semibold">Amount:</span> Rs. {item.amount}</div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <span className="font-semibold">Address:</span> {item.delivery_address.city} - {item.delivery_address.address_line}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <span className="font-semibold">Mobile:</span> {item.delivery_address.mobile}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <span className="font-semibold">Status:</span> {item.status}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <span className='font-semibold'>Ordered On: </span> {new Date(item.createdAt).toLocaleString()}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <span className="font-semibold">Order Status:</span> {item.orderStatus}
                                    </div>
                                    <div className="mt-2 flex gap-4">
                                        {item.orderStatus === "Pending" && (
                                            <button
                                                onClick={() => {
                                                    console.log("Button clicked! Updating status...");
                                                    updateEsewaStatus(item._id, "Accepted");
                                                }}
                                                className="text-sm text-white bg-blue-500 px-4 py-2 rounded-lg"
                                            >
                                                Accept
                                            </button>
                                        )}
                                        {item.orderStatus === "Accepted" && (
                                            <button
                                                onClick={() => updateEsewaStatus(item._id, "Picked")}
                                                className="text-sm text-white bg-yellow-500 px-4 py-2 rounded-lg"
                                            >
                                                Picked
                                            </button>
                                        )}
                                        {item.orderStatus === "Picked" && (
                                            <button
                                                onClick={() => updateEsewaStatus(item._id, "Delivered")}
                                                className="text-sm text-white bg-green-500 px-4 py-2 rounded-lg"
                                            >
                                                Delivered
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        }
                    </ul>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-4">
                    <h1 className="font-semibold text-xl text-gray-800 mb-4">COD Orders</h1>
                    <ul className="space-y-6 overflow-y-auto max-h-[70vh]">
                        {
                            cash.map((order) => (
                                <div key={order._id} className="bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-200">
                                    <li className="text-sm text-gray-600"><span className="font-semibold">Order ID:</span> {order.orderId}</li>
                                    <li className="text-sm text-gray-600"><span className="font-semibold">Customer Name:</span> {order.userId.name}</li>
                                    <p className="text-sm font-semibold text-gray-700 mt-2">Products:</p>
                                    <ul className="list-disc pl-6">
                                        {
                                            order.product_details.map((prod) => (
                                                <li key={prod.name} className="text-sm text-gray-600">{prod.name} - Qty {prod.quantity} - {prod.unit}</li>
                                            ))
                                        }
                                    </ul>
                                    <div className="flex justify-between text-sm text-gray-600 mt-4">
                                        <div><span className="font-semibold">Total Qty:</span> {order.totalQty}</div>
                                        <div><span className="font-semibold">Amount:</span> Rs. {order.totalAmt}</div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <span className="font-semibold">Address:</span> {order.delivery_address.city}, {order.delivery_address.address_line}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <span className="font-semibold">Mobile:</span> {order.delivery_address.mobile}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <span className="font-semibold">Status:</span> {order.payment_status}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <span className='font-semibold'>Ordered On: </span> {new Date(order.createdAt).toLocaleString()}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <span className="font-semibold">Order Status:</span> {order.orderStatus}
                                    </div>
                                    <div className="mt-2 flex gap-4">
                                        {order.orderStatus === "Pending" && (
                                            <button
                                                onClick={() => {
                                                    console.log("Button clicked! Updating status...");
                                                    updateOrderStatus(order._id, "Accepted");
                                                }}
                                                className="text-sm text-white bg-blue-500 px-4 py-2 rounded-lg"
                                            >
                                                Accept
                                            </button>
                                        )}
                                        {order.orderStatus === "Accepted" && (
                                            <button
                                                onClick={() => updateOrderStatus(order._id, "Picked")}
                                                className="text-sm text-white bg-yellow-500 px-4 py-2 rounded-lg"
                                            >
                                                Picked
                                            </button>
                                        )}
                                        {order.orderStatus === "Picked" && (
                                            <button
                                                onClick={() => updateOrderStatus(order._id, "Delivered")}
                                                className="text-sm text-white bg-green-500 px-4 py-2 rounded-lg"
                                            >
                                                Delivered
                                            </button>
                                        )}
                                    </div>

                                </div>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default OrdersUser
