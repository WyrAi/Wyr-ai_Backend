import PurchaseOrder from "../models/purchaseOrder.js"

const getPoStatus=async(req,res)=>{
    try {
        const poList = await PurchaseOrder.find({});

        const statusCounts = {};
        let Draft = 0;

        poList.forEach((po) => {
            const status = po.status;
            statusCounts[status] = (statusCounts[status] || 0) + 1;
            Draft++;
        });

        const data = {
            statusCounts,
            Draft,
        };

        res.send(data);
    } catch (error) {
        console.error("Error fetching purchase orders:", error);
        res.status(500).send("Internal Server Error");
    }
}

//aggregation query
// const getPoStatus = async (req, res) => {
//     try {
//         const aggregationResult = await PurchaseOrder.aggregate([
//             {
//                 $group: {
//                     _id: "$status",
//                     count: { $sum: 1 },
//                     poList: { $push: "$$ROOT" },
//                 },
//             },
//             {
//                 $project: {
//                     status: "$_id",
//                     count: 1,
//                     poList: 1,
//                     _id: 0,
//                 },
//             },
//             {
//                 $group: {
//                     _id: null,
//                     statusCounts: { $push: { status: "$status", count: "$count" } },
//                     totalCount: { $sum: "$count" },
//                     poList: { $push: "$poList" },
//                 },
//             },
//             {
//                 $project: {
//                     statusCounts: 1,
//                     totalCount: 1,
//                 },
//             },
//         ]);
//         const response = aggregationResult[0];

//         res.send(response);
//     } catch (error) {
//         console.error("Error fetching purchase orders:", error);
//         res.status(500).send("Internal Server Error");
//     }
// };

const getusercount=async(req,res)=>{

}




export {getPoStatus,getusercount}