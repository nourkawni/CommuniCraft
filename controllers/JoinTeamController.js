const con=require('../config/dataBase')

async function sendMessage(req,res){
   
   const msg=req.body.msg;
   const manager_id=req.body.manager_id;  
   const user_id=req.user.id;

   const query="INSERT INTO notification (msg, manager_id, user_id) VALUES(?,?,?)";
   con.query(query, [msg, manager_id, user_id],(err, results)=>{
    if(err){
        res.status(500).json({ message: "Error can't send Message" , error: err });
            return;
      }else{
         res.status(200).json({message:"Message have been sent!"})
      }

   })
}

async function checkMessages(req,res){
    const user_id=req.user.id;
    const query="SELECT manager_message From notification WHERE user_id=?";
    con.query(query, [user_id],(err, results)=>{
     if(err){
         res.status(500).json({ message: "Error can't get Messages" });
             return;
       }else if(results==null){
          res.status(200).json({message: "No response yet"});
          }else{
            res.status(200).json({message:results});
          }
        
       
 
    })
 }

 async function managerResponse(req, res) {
    const userId = req.user.id; // Extracted from JWT


    let query = 'SELECT team_id FROM team_user WHERE user_id = ?';
    con.query(query, [userId], (err, results) => {
        if (err) {
            res.status(500).json({ message: "Error: Project cannot be updated" });
            return;
        } else if (results.length == 0) {
            res.status(403).json({ message: "Error: You are not a team member and cannot edit a project" });
            return;
        } else {
            const response = req.body.managerResponse;
            const user_Id = req.body.user_Id; 

            let updateQuery = `UPDATE notification SET manager_message = ? WHERE user_id = ?`;
            let managerMessage = response === "Added" ? "Approved" : "Not Approved";
            con.query(updateQuery, [managerMessage, user_Id], (updateErr, updateResults) => {
                if (updateErr) {
                    res.status(500).json({ message: "Error updating the manager's response" });
                    return;
                } else {
                    res.status(200).json({ message: "Manager's response has been updated successfully" });
                }
            });
        }
    });
}


module.exports= {
   sendMessage,
   checkMessages,
   managerResponse
};


