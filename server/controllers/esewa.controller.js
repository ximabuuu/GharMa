import { EsewaPaymentGateway, EsewaCheckStatus } from "esewajs";
import TransactionModel from "../models/transaction.model.js";
import UserModel from "../models/user.model.js";


const EsewaInitiatePayment = async (req, res) => {
  const userId = req.userId
  const { amount, productId, list_items, addressId, totalQty } = req.body;  
  try {




    const reqPayment = await EsewaPaymentGateway(
      amount, 0, 0, 0, productId, process.env.MERCHANT_ID, process.env.SECRET, process.env.SUCCESS_URL, process.env.FAILURE_URL, process.env.ESEWAPAYMENT_URL, undefined, undefined)
    if (!reqPayment) {
      return res.status(400).json("error sending data")

    }

    const products = list_items.map(el => ({
      productId: el.productId._id,
      name: el.productId.name,
      image: el.productId.image,
      quantity: el.quantity,
      unit: el.productId.unit
    }));

    if (reqPayment.status === 200) {
      const transaction = new TransactionModel({
        userId: userId,
        product_id: productId,
        amount: amount,
        product_details: products,
        totalQty: totalQty,
        delivery_address: addressId,
        orderStatus: "Pending",
        worker: null
      });
      const saveTransaction = await transaction.save();

      const addUserAddress = await UserModel.findByIdAndUpdate(userId, {
        $push: {
          transaction: saveTransaction._id
        }
      })

      return res.send({
        url: reqPayment.request.res.responseUrl,
      });
    }
  }
  catch (error) {
    return res.status(400).json("error sending data")

  }
}



const paymentStatus = async (req, res) => {
  const { product_id } = req.body; 
  try {
    
    const transaction = await TransactionModel.findOne({ product_id });
    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    const paymentStatusCheck = await EsewaCheckStatus(transaction.amount, transaction.product_id, process.env.MERCHANT_ID, process.env.ESEWAPAYMENT_STATUS_CHECK_URL)



    if (paymentStatusCheck.status === 200) {
      
      transaction.status = paymentStatusCheck.data.status;
      await transaction.save();
      res
        .status(200)
        .json({ message: "Transaction status updated successfully" });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { EsewaInitiatePayment, paymentStatus }


export const fetchAllTransaction = async (req, res) => {
  try {
    const AllTrans = await TransactionModel.find()
      .populate('userId')
      .populate('delivery_address', 'city mobile address_line')
      .populate('worker', 'name mobile')

    return res.json({
      message: "All Transaction Fetched.",
      success: true,
      error: false,
      data: AllTrans
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true
    })
  }
}

export const getUserTransaction = async (req, res) => {
  try {
    const userId = req.userId

    const userOrders = await TransactionModel.find({ userId: userId })
      .populate("userId")
      .populate("delivery_address")
      .populate("worker", 'name mobile')
      .sort({ createdAt: -1 })

    return res.json({
      message: "User orders fetched successfully!",
      error: false,
      success: true,
      data: userOrders
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
};

export const updateEsewaStatus = async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;
  const workerId = req.userId; 

  try {
    // Fetch the user details
    const worker = await UserModel.findById(workerId);

    if (!worker || worker.role !== "WORKER") {
      return res.status(403).json({ message: "Only workers can accept orders" });
    }

    const updatedOrder = await TransactionModel.findByIdAndUpdate(
      orderId,
      { orderStatus, worker: workerId }, 
      { new: true }
    ).populate("worker", "name mobile"); 

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated successfully!",
      success: true,
      error: false,
      data: updatedOrder
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating order status",
      success: false,
      error: true
    });
  }
};

