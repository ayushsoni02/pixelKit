import mongoose, {Schema,model,models} from "mongoose";

const orderSchema = new Schema({
    userId: {type:Schema.Types.ObjectId, ref:"User",required:true},
    productId:{type:Schema.Types.ObjectId,ref:"product",required:true},
    varient:{
       type: {
        type:String,
        required:true,
        enum:["SQUARE","WIDE","PORTRAIT"]
    },
    price:{type:Number, required:true},
    license:{
        type:String,
        required:true,
        enum:["personal","commercial"],
    },
},
  razorpayOrderId:{type:String,required:true},
  razorpayPaymentId:{type:String,required:true},
  amount:{type:Number,required:true},
  status:{
        type: String,
        required:true,
        enum: ["pending","compeleted","failed"],
        default:"pending"
  },
  downloadUrl:{type:String},
  previewUrl:{type:String}
},{timestamps:true});


const Order = models?.Order || model("Order",orderSchema);

export default Order;