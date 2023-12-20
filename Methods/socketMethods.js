import { getUserByUsername,deleteSocketUser } from "../controller/notificationUser.js";
import User from "../models/users.js";
import Notification from "../models/notificationMessageModel.js";
import Role from "../models/role.js";
const socket = (io) => {
    let onlineUsers = [];
    const offlineMessages = {};

    const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
      };
      

    async function saveMessage(sender, receiver, text) {
        const existingNotification = await Notification.findOne({ receiverid: receiver });
      
        if (existingNotification) {
          existingNotification.messages.push({
            message: text,
          });
      
          await existingNotification.save();
        } else {
          const newNotification = new Notification({
            receiverid: receiver,
            messages: [
              {
                message: text,
              },
            ],
          });
      
          await newNotification.save();
        }
      }


    io.on("connection", (socket) => {
         socket.on("newUser", (user) => {
          console.log("user connected with", user, socket.id);
         });

         socket.on("RelationshipsText", async ({data} ) => {
          const { senderName, text } = data ;      
          const targetEmail = senderName;
          const usersWithEmail = await User.find({ email: targetEmail }).select('companyId').exec();
          const companyId = usersWithEmail[0]?.companyId;
          const usersWithCompanyId = await User.find({ companyId: companyId })
            .populate({
              path: 'role',
              model: 'Role',
            })
            .lean() 
            .exec();
      
          const usersWithAddEditCompanyPermission = usersWithCompanyId.filter(user => {
            const role = user.role;
      
            if (role && role.SelectAccess.relationshipManagement) {
              const relationshipManagementStrings = role.SelectAccess.relationshipManagement.map(value => value.toString());
              return relationshipManagementStrings.includes('Add/Edit Company');
            }
      
            return false;
          });

        const emailsWithAddEditCompanyPermission = usersWithAddEditCompanyPermission.map(user => user.email);
              if (Array.isArray(emailsWithAddEditCompanyPermission)) {
            for (const receiver of emailsWithAddEditCompanyPermission) {
              await saveMessage(senderName, receiver, text);
            }
          } else {
            await saveMessage(senderName, emailsWithAddEditCompanyPermission, text);
          }
      
          // const existingMessage = await Message.findOne({ userid: senderName, senderid: senderName });
          // if (existingMessage) {
          //   await Message.updateOne(
          //     { userid: senderName, senderid: senderName, "messages.receiverid": receiverName },
          //     { $push: { "messages.$.texts": { message: text } } }
          //   );
          // } else {
          //   const newMessage = new Message({
          //     userid: senderName,
          //     senderid: senderName,
          //     messages: [{ receiverid: receiverName, texts: [{ message: text }] }],
          //   });
          
          //   console.log("newMessage ===> ", newMessage);
          //   await newMessage.save();
          // }
          //console.log("object", senderName, text);
          // const receivers = getUser(receiverName);

         
          const receivers = await getUserByUsername({
            body: {
              username: emailsWithAddEditCompanyPermission
            },
          });
         
          if (receivers.length) {
            receivers.forEach((receiver) => {
              io.to(receiver.socket).emit("getText", {
                senderName,
                text,
              });
            });
          } 
          });

         socket.on("purchesText", async ({data} ) => {
            const { senderName, text } = data ||[] ;      
            const targetEmail = senderName;
            const usersWithEmail = await User.find({ email: targetEmail }).select('companyId').exec();
            const companyId = usersWithEmail[0]?.companyId;
            const usersWithCompanyId = await User.find({ companyId: companyId })
              .populate({
                path: 'role',
                model: 'Role',
              })
              .lean() 
              .exec();
        
            const usersWithAddEditCompanyPermission = usersWithCompanyId.filter(user => {
              const role = user.role;
        
              if (role && role.SelectAccess.purchaseOrder) {
                const relationshipManagementStrings = role.SelectAccess.purchaseOrder.map(value => value.toString());
                return relationshipManagementStrings.includes('Approve');
              }
        
              return false;
            });
  
          const emailsWithAddEditCompanyPermission = usersWithAddEditCompanyPermission.map(user => user.email);
                if (Array.isArray(emailsWithAddEditCompanyPermission)) {
              for (const receiver of emailsWithAddEditCompanyPermission) {
                await saveMessage(senderName, receiver, text);
              }
            } else {
              await saveMessage(senderName, emailsWithAddEditCompanyPermission, text);
            }
           
            const receivers = await getUserByUsername({
              body: {
                username: emailsWithAddEditCompanyPermission
              },
            });
           
            if (receivers.length) {
              receivers.forEach((receiver) => {
                io.to(receiver.socket).emit("getText", {
                  senderName,
                  text,
                });
              });
            } 
          });

          socket.on("RoleText", async ({data} ) => {
            const { senderName, text } = data ;      
            const targetEmail = senderName;
            const usersWithEmail = await User.find({ email: targetEmail }).select('companyId').exec();
            const companyId = usersWithEmail[0]?.companyId;
            const usersWithCompanyId = await User.find({ companyId: companyId })
              .populate({
                path: 'role',
                model: 'Role',
              })
              .lean() 
              .exec();
        
            const usersWithAddEditCompanyPermission = usersWithCompanyId.filter(user => {
              const role = user.role;
        
              if (role && role.SelectAccess.userManagement) {
                const relationshipManagementStrings = role.SelectAccess.userManagement.map(value => value.toString());
                return relationshipManagementStrings.includes('Create/Edit User');
              }
        
              return false;
            });
  
          const emailsWithAddEditCompanyPermission = usersWithAddEditCompanyPermission.map(user => user.email);
                if (Array.isArray(emailsWithAddEditCompanyPermission)) {
              for (const receiver of emailsWithAddEditCompanyPermission) {
                await saveMessage(senderName, receiver, text);
              }
            } else {
              await saveMessage(senderName, emailsWithAddEditCompanyPermission, text);
            }
        
            const receivers = await getUserByUsername({
              body: {
                username: emailsWithAddEditCompanyPermission
              },
            });
           
            if (receivers.length) {
              receivers.forEach((receiver) => {
                io.to(receiver.socket).emit("getText", {
                  senderName,
                  text,
                });
              });
            } 
          });

          socket.on("PackingText", async ({data} ) => {
            const { senderName, text } = data ;      
            const targetEmail = senderName;
            const usersWithEmail = await User.find({ email: targetEmail }).select('companyId').exec();
            const companyId = usersWithEmail[0]?.companyId;
            const usersWithCompanyId = await User.find({ companyId: companyId })
              .populate({
                path: 'role',
                model: 'Role',
              })
              .lean() 
              .exec();
        
            const usersWithAddEditCompanyPermission = usersWithCompanyId.filter(user => {
              const role = user.role;
        
              if (role && role.SelectAccess.packingList) {
                const relationshipManagementStrings = role.SelectAccess.packingList.map(value => value.toString());
                return relationshipManagementStrings.includes('Approve');
              }
        
              return false;
            });
  
          const emailsWithAddEditCompanyPermission = usersWithAddEditCompanyPermission.map(user => user.email);
                if (Array.isArray(emailsWithAddEditCompanyPermission)) {
              for (const receiver of emailsWithAddEditCompanyPermission) {
                await saveMessage(senderName, receiver, text);
              }
            } else {
              await saveMessage(senderName, emailsWithAddEditCompanyPermission, text);
            }
                   
            const receivers = await getUserByUsername({
              body: {
                username: emailsWithAddEditCompanyPermission
              },
            });
           
            if (receivers.length) {
              receivers.forEach((receiver) => {
                io.to(receiver.socket).emit("getText", {
                  senderName,
                  text,
                });
              });
            } 
          });

          socket.on("CompanybranchText", async ({data} ) => {
            const { senderName, text } = data ;      
            const targetEmail = senderName;
            const usersWithEmail = await User.find({ email: targetEmail }).select('companyId').exec();
            const companyId = usersWithEmail[0]?.companyId;
            const usersWithCompanyId = await User.find({ companyId: companyId })
              .populate({
                path: 'role',
                model: 'Role',
              })
              .lean() 
              .exec();
        
            const usersWithAddEditCompanyPermission = usersWithCompanyId.filter(user => {
              const role = user.role;
        
              if (role && role.SelectAccess.userManagement) {
                const relationshipManagementStrings = role.SelectAccess.userManagement.map(value => value.toString());
                return relationshipManagementStrings.includes('Add/Edit Branch');
              }
        
              return false;
            });
  
          const emailsWithAddEditCompanyPermission = usersWithAddEditCompanyPermission.map(user => user.email);
                if (Array.isArray(emailsWithAddEditCompanyPermission)) {
              for (const receiver of emailsWithAddEditCompanyPermission) {
                await saveMessage(senderName, receiver, text);
              }
            } else {
              await saveMessage(senderName, emailsWithAddEditCompanyPermission, text);
            }
                   
            const receivers = await getUserByUsername({
              body: {
                username: emailsWithAddEditCompanyPermission
              },
            });
           
            if (receivers.length) {
              receivers.forEach((receiver) => {
                io.to(receiver.socket).emit("getText", {
                  senderName,
                  text,
                });
              });
            } 
          }); 

          socket.on("remove", async(socket) => {
          console.log("socket in disconnect",socket)
          const receivers = await deleteSocketUser({
            params: {
              socket: socket,
            },
          });


      
          console.log("user with disconnected with", socket);
          });

      });
  };
  export { socket };



  