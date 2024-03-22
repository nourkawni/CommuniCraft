
const con = require('../config/dataBase');



// Route to handle user authentication 
// function authenticateUser(req, res, next) {
    
//     //check if the user is logged in and retrieve their userID
//     const userID = req.body.userID; //userID in the request body
  
//     if (!userID) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
  
//     req.userID = userID;
//     next();
//   }

  
  //add projectID to favorites
  exports.addFavorite= (req, res) => {

    //Athorization that user can only add if he is a registered user
    const userID = req.user.id; // Extracted from JWT

    /*const sql1 = 'SELECT * FROM user WHERE user_id=?';
    con.query(sql1, [userID], async(err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error checking user registration' });
      }
      else if(results.length==0){
      return res.status(403).json({ message: 'You are not a registered user. Please register before adding projects to your favorites.' });
      }

    });*/


    const { projectID } = req.params;
   
    // Check if projectID is provided
    if (!projectID) {
      return res.status(400).json({ error: 'projectID is required' });
    }
  
    // Insert projectID and userID into favorites table
    const sql = 'INSERT INTO fav (user_id, project_id) VALUES (?, ?)';
    con.query(sql, [userID, projectID], async(err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add projectID to favorites' });
      }
      return res.status(200).json({ message: 'Project added to favorites successfully' });
    });

  }
//////////////////////////////////////////////////////////////////////////////////

   // add rate to a project
    exports.addRate= (req, res) => {
    //Athorization that user can only add if he is a registered user
    const userID = req.user.id; // Extracted from JWT
    const { projectID } = req.params;
    const {rate } = req.body;
  
    // Check if rate is within valid range (1 to 5)
    if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
      return res.status(400).json({ error: 'Rate must be an integer between 1 and 5' });
    }
  
    // Insert rate into project_ratings table
    const sql = 'INSERT INTO project_rate (user_id, project_id, rate) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rate = VALUES(rate)';
    con.query(sql, [userID, projectID, rate], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add rate to project' });
      }
      return res.status(200).json({ message: 'Rate added to this project successfully' });
    });
  }

//////////////////////////////////////////////////////////////////////////

  // add comments/recommendations to a project
  exports.addComment= (req, res) => {
    //Athorization that user can only add if he is a registered user
    const userID = req.user.id; // Extracted from JWT
    const {projectID } = req.params;
    const {comment } = req.body;
  
    // Check if comment is provided
    if (!comment) {
      return res.status(400).json({ error: 'Comment is required' });
    }
  
    // Insert comment into project_ratings table
    const sql = 'INSERT INTO project_rate (user_id, project_id, comment) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE comment = VALUES(comment)';
    con.query(sql, [userID, projectID, comment], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add comment to project' });
      }
      return res.status(200).json({ message: 'Comment added to this project successfully' });
    });
  }



  //////////////////////////////////////////////////////////////////////

  //return favorites projects
 
    exports.returnFavorite=(req, res) => {
    //Athorization that user can only add if he is a registered user
    const userID = req.user.id; // Extracted from JWT
  
    // Query to retrieve favorite projects along with their details
    const sql = `
    SELECT p.name, p.type FROM fav AS f INNER JOIN project AS p ON f.project_id = p.project_id WHERE f.user_id = ?`;
  
    con.query(sql, [userID], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve favorite projects' });
      }
  
      // Return the list of favorite projects with their details as JSON
      return res.status(200).json(results);
    });
   }


  /////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\
  //return comments

  // Route to retrieve comments for a specific project
    exports.returnComment=(req, res) => {
    const { projectID } = req.params;
  
    // Query to retrieve comments of project
    const sql = `
    SELECT comment FROM project_rate WHERE project_id= ?`;
  
    con.query(sql, [projectID], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve comments about this project' });
      }
  
      // Return the list of comments of project as JSON
      return res.status(200).json(results);
    });
   }


   /////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\

   //return avg_rate of project
 
   exports.returnRate=(req, res) => {
    const { projectID } = req.params;
  
  
    const sql = `SELECT AVG(rate) FROM project_rate WHERE project_id = ?`;
  
    con.query(sql, [projectID], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve rating of this project' });
      }
  
      // Return the avg_rate of this project as JSON
      return res.status(200).json(results);
    });
   }

      /////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\

   //delete favorite project
 
   exports.deleteFavorite=(req, res) => {
    //Athorization that user can only add if he is a registered user
    const userID = req.user.id; // Extracted from JWT
    const {projectID } = req.params;
  
  
    const sql = `delete from fav where user_id=? and project_id=?`;
  
    con.query(sql, [userID,projectID], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete this project from favorite' });
      }
      else if(results.affectedRows === 0){
        return res.status(404).json({ message: 'This project is not in your favorite list' });
        }
      else{       
      // Row were successfully deleted
      return res.status(200).json({ message: 'The project has been removed from favorite list successfully' });
      }
    });
   }

/////////////////////////////////

   //update rate of project
 
   exports.updateRate=(req, res) => {
    //Athorization that user can only add if he is a registered user
    const userID = req.user.id; // Extracted from JWT
    const {projectID } = req.params;
    const { rate } = req.body;
  
  
    const sql = `UPDATE project_rate SET rate=? WHERE user_id=? and project_id=?`;
  
    con.query(sql, [rate, userID, projectID], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update rate of this project' });
      }
      else if(results.affectedRows === 0){
        return res.status(404).json({ message: 'You are not rated this project' });
        }
      else{       
      // rate were successfully updated
      return res.status(200).json({ message: 'Rate updated successfully' });
      }
  
      
    });
   }