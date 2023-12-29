import PurchaseOrder from "../models/purchaseOrder.js"
import Role from "../models/role.js";
import User from "../models/users.js";
import Companydetails from "../models/companydetails.js";

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
    try {
        const distinctUserCount = await User.distinct('email').countDocuments();
        const totalRoles = await Role.countDocuments();
        const unregisterOrganizations = await User.find({ companyId: null }).countDocuments();
        const totalOrganizations = await User.distinct('companyId').countDocuments();
    
        res.json({
          distinctUserCount,
          totalRoles,
          unregisterOrganizations,
          totalOrganizations,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

const getlatestaddeduser=async(req,res)=>{
    try {
        const mostRecentUser = await User.findOne().sort({ CreatedDate: -1 });
        if (mostRecentUser) {
          const { name, email, phone, companyId } = mostRecentUser;
          const role = await Role.findById(mostRecentUser.role);
          const roleName = role ? role.name : null;
          const organisation = await Companydetails.findById(companyId);
          const organisationLocation = organisation ? organisation.address : null;
    
          res.json({
            name,
            roleName,
            organisationLocation,
            phone,
            email,
          });
        } else {
          res.json({ message: 'No users found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    
}



export {getPoStatus,getusercount,getlatestaddeduser}