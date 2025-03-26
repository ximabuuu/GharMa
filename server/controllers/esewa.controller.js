import { EsewaPaymentGateway, EsewaCheckStatus } from "esewajs";
import  TransactionModel from "../models/transaction.model.js";
import UserModel from "../models/user.model.js";


const EsewaInitiatePayment = async (req, res) => {
  const userId = req.userId
  const { amount, productId } = req.body;  //data coming from frontend
  try {
    const reqPayment = await EsewaPaymentGateway(
      amount, 0, 0, 0, productId, process.env.MERCHANT_ID, process.env.SECRET, process.env.SUCCESS_URL, process.env.FAILURE_URL, process.env.ESEWAPAYMENT_URL, undefined, undefined)
    if (!reqPayment) {
      return res.status(400).json("error sending data")

    }
    if (reqPayment.status === 200) {
      const transaction = new TransactionModel({
        userId : userId,
        product_id: productId,
        amount: amount,
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
  const { product_id } = req.body; // Extract data from request body
  try {
    // Find the transaction by its signature
    const transaction = await TransactionModel.findOne({ product_id });
    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    const paymentStatusCheck = await EsewaCheckStatus(transaction.amount, transaction.product_id, process.env.MERCHANT_ID, process.env.ESEWAPAYMENT_STATUS_CHECK_URL)



    if (paymentStatusCheck.status === 200) {
      // Update the transaction status
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

