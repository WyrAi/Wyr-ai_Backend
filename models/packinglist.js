import mongoose from "mongoose";


const packingSchema = new mongoose.Schema({
         
    buyer: {
       type : mongoose.Schema.Types.ObjectId,
       ref : "Companydetails"
      },
     
    factory: {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Companydetails"
    },

    totalcartoon:{
        type:Number,
        required:true
    },
    invoicenumber:{
        type:Number,
        required:true

    },
    slots:[
        {
        type:String,
        required:true
        }
       ],

    products: [
        {
          styleId: { type: String, required: true },
          styleName: { type: String, required: true },
          quantity: Number,
          color: { type: String, required: true },
          weight:{ type: Number, required: true },
          length: { type: Number, required: true },
          height: { type: Number, required: true },
          width: { type: Number, required: true },
          aql: { type: Number, required: true }, 
         assignfactory:[{
            name: { type: String, required: true }
         }]
        },
      ],
      drafts:{
        type:Boolean,
        default:false
      },
      pendingqc:{
        type:Boolean,
        default:false
      },
      scheduled:{
        type:Boolean,
        default:false
      },
      inprogress:{
        type:Boolean,
        default:false
      },
      pendingapproval:{
        type:Boolean,
        default:false
      },
      completed:{
        type:Boolean,
        default:false
      }


});

const Packing = mongoose.model('Packing', packingSchema);

export default Packing;
