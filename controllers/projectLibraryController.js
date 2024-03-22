const con=require('../config/dataBase')
// user can display all projects and filter them even if he is not logged in.
// user can view all projects or filtered projects based on type, status, level, group size
async function getProjects(req, res) {
    const projectType = req.query.type;
    const projectStatus = req.query.status;
    const projectLevel = req.query.level;
    const projectGroup = req.query.group_size;
    const projectBudget=req.query.price;


    let query = "SELECT * FROM project WHERE 1=1";
    let params = [];


    // If parameters are specified, modify the query to filter by them
    if (projectType) {
        query += " AND type = ?";
        params.push(projectType);
    }
    if (projectStatus) {
        query += " AND status = ?";
        params.push(projectStatus);
    }
    if (projectLevel) {
        query += " AND level = ?";
        params.push(projectLevel);
    }
    if (projectGroup) {
        query += " AND group_size = ?";
        params.push(projectGroup);
    }


    if (projectBudget) {
        query += " AND price <= ?";
        params.push(projectBudget);
    }


    con.query(query, params, (err, results) => {
        if (err) {
            res.status(500).json({ message: "Error fetching projects" });
            return;
        }
        if (results.length === 0) {
            res.json({ message: "No Projects to display" });
            return;
        } else {
            res.status(200).json({ projects: results });
        }
    });


}






async function registerTeam(req,res){
 
    const {team_name, manager_id}=req.body;
    const query= `
    INSERT INTO team (team_name,manager_id)
    VALUES (?,?);`;


    const values=[team_name, manager_id];
    con.query(query,values,(err,results)=>{


        if(err){
            res.status(500).json({ message: "Error unable to register" });
                return;
          }
          else{
             res.status(200).json({message:"welcome "+team_name+" you are registered!!!"});
             return;
          }


    })
         //admin addes each user to a team


}




async function addProject(req,res){
   const {team_id, name, group_size, level, type, materials, status, description, year, dependency, rate, price } = req.body;
   
   //Athorization that user can only add if he is a team member
   const userId = req.user.id;
   let query =`SELECT * FROM team_user WHERE team_id=? AND user_id=?`
   con.query(query, [team_id, userId],(err,results)=>{
    if(err){
        res.status(500).json({ message: "Error project can not be added" });
            return;
      }
    else if (results.length==0){
        res.status(403).json({ message: "Error you are not a team memeber you can not add a project" });
        return;
    }else{


        // when we want to add new project we need to add the team first then the team can register the project  
  if(team_id<0){
    res.status(500).json({message:"Register your team before adding your project"});
    return;
}
query = `
INSERT INTO project (name, group_size, level, type, materials, status, description, year, dependency, rate, price, team_id)
VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);`;


const values = [name, group_size, level, type, materials, status, description, year, dependency,  rate, price, team_id];


  con.query(query, values, (err, results) => {
    if(err){
      res.status(500).json({ message: "Error project can not be added" });
          return;
    }
    else{
       res.status(200).json({message:"Project was added"});
       return;
    }


  })












    }
   })


 


}




async function editProject(req,res){
   
    const {id } = req.params;
    const {team_id, name, group_size, level, type, materials, status, description, year, dependency, price} = req.body;
    const userId = req.user.id; // Extracted from JWT
   
    //Authorization that the user can edit only it is own project
    let query =`SELECT team_id FROM team_user WHERE user_id=?`
   con.query(query, [userId],(err,results)=>{
    if(err){
        res.status(500).json({ message: "Error project can not be added" });
            return;
      }
    else if (results.length==0){
        res.status(403).json({ message: "Error you are not a team memeber you can not edit a project" });
        return;
    }else{


        const teamIds = results.map(result => result.team_id);
       
        // Query to check if the project to be edited belongs to one of the user's teams
        let projectQuery = `SELECT project_id FROM project WHERE project_id = ? AND team_id IN (?)`;


        con.query(projectQuery, [id, teamIds], (projectErr, projectResults) => {
            if (projectErr) {
                res.status(500).json({ message: "Error: Cannot check project ownership" });
                return;
            }
            if (projectResults.length == 0) {
                // The project either doesn't exist or isn't associated with any of the user's teams
                res.status(403).json({ message: "Error: You are not authorized to edit this project" });
                return;}
     
   
    let queryParts = [];
    let values = [];


    if (name) {
        queryParts.push("name = ?");
        values.push(name);
    }
    if (group_size) {
        queryParts.push("group_size = ?");
        values.push(group_size);
     }
    if (level) {
        queryParts.push("level = ?");
        values.push(level);
     }
    if (type) {
        queryParts.push("type = ?");
        values.push(type);
     }
    if (materials) {
         queryParts.push("materials = ?");
         values.push(materials);
         }
    if (status) {
        queryParts.push("status = ?");
        values.push(status);
     }
    if (description) {
        queryParts.push("description = ?");
        values.push(description);
    }
    if (year) {
        queryParts.push("year = ?");
        values.push(year);
     }
    if (dependency) {
        queryParts.push("dependency = ?");
        values.push(dependency);
     }
     if (price) {
        queryParts.push("price = ?");
        values.push(price);
     }


    if (queryParts.length === 0) {
        res.status(400).json({ message: "No project attributes provided for update." });
        return;
    }


    let query = `UPDATE project SET ${queryParts.join(", ")} WHERE project_id = ?;`;
    values.push(id);


    con.query(query, values, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error updating project." });
            return;
        }
        if (result.affectedRows == 0) {
            res.status(404).json({ message: "Project not found or data is the same as existing." });
            return;
        }
        res.status(200).json({ message: "Project information updated successfully." });
    });


});
}
});
}

module.exports= {
    getProjects,
    addProject,
    registerTeam,
    editProject
};
