const con = require('../config/dataBase');

//return all sales
exports.returnSales=(req, res) => {
    const sql = `SELECT seller_name,material_name,count,description,cost,telephone,location FROM sell where count>0`; 
    con.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve data from sell table' });
      }
      return res.status(200).json(results);
    });
   }

   //search (return) for a specific ..
   
exports.search = (req, res) => {
  const materialName = req.query.materialName; 
  const location = req.query.location;
  const description = req.query.description;

  let query = 'SELECT seller_name,material_name,count,description,cost,telephone,location FROM sell WHERE material_name = ? AND count>0 '; 
  let params = [materialName];

  if (location) {
    query += ' AND location = ?';
    params.push(location);
  
  }
  if (description) {
    query += ' AND description = ?';
    params.push(description);
  }
  
  con.query(query, params, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid data' });
    }    
    return res.json({ Data: results });

  });
 
};
 

  //add material to sales
  exports.addMaterial = (req, res) => {
    //Athorization that user can only add if he is a registered user
    const sellerID = req.user.id; // Extracted from JWT
    const {materialName, count, description, cost } = req.body;

    // Check if all required fields are provided
    if (!sellerID || !materialName || !count || !description || !cost ) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Retrieve name, telephone, and location from user table
    const getUserInfoQuery = 'SELECT name, telephone, location FROM user WHERE user_id = ?';
    con.query(getUserInfoQuery, [sellerID], (err, userInfoResults) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve user information' });
        }

        if (userInfoResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { name, telephone, location } = userInfoResults[0];



 // Insert data into the sell table
 const insertSellQuery = 'INSERT INTO sell (seller_id, seller_name, material_name, count, description, cost, telephone, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
 const values = [sellerID, name, materialName, count, description, cost, telephone, location];
 con.query(insertSellQuery, values, (err, results) => {
     if (err) {
         console.error(err);
         return res.status(500).json({ error: 'Failed to add material to sell table' });
     }
     return res.status(200).json({ message: 'Material added to sell table successfully' });
 });
});
}


// buy material 
exports.buy = (req, res) => {
  const { materialName, number_of_it, telephone_of_seller } = req.body;

  // Check if all required fields are provided
  if (!materialName || !number_of_it || !telephone_of_seller) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  // Fetch current count from the sell table
  const getCountSql = 'SELECT count FROM sell WHERE material_name = ? AND telephone = ?';
  con.query(getCountSql, [materialName, telephone_of_seller], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to fetch current count from the sell table' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'Material not found or telephone number of seller is incorrect' });
      }

      const currentCount = results[0].count;

      if (currentCount < number_of_it) {
          return res.status(400).json({ error: 'Insufficient stock for purchase' });
      }

      // Calculate new count
      const newCount = currentCount - number_of_it;

      // Update count in the sell table
      const updateCountSql = 'UPDATE sell SET count = ? WHERE material_name = ? AND telephone = ?';
      con.query(updateCountSql, [newCount, materialName, telephone_of_seller], (err, updateResult) => {
          if (err) {
              return res.status(500).json({ error: 'Failed to update count in the sell table' });
          }

          if (newCount === 0) {
              // If count reaches 0, delete the row
              const deleteRowSql = 'DELETE FROM sell WHERE material_name = ? AND telephone = ?';
              con.query(deleteRowSql, [materialName, telephone_of_seller], (err, deleteResult) => {
                  if (err) {
                      return res.status(500).json({ error: 'Failed to delete row from the sell table' });
                  }
                  return res.status(200).json({ message: 'Purchase successful. Material deleted from the sell table' });
              });
          } else {
              return res.status(200).json({ message: 'Purchase successful. Count updated in the sell table' });
          }
      });
  });
}


  //return seller's materials

  exports.returnSellerMaterials=(req, res) => {
    //Athorization that user can only add if he is a registered user
    const sellerID = req.user.id; // Extracted from JWT
 
    // Query to retrieve materials 
    const sql = `SELECT seller_name,material_name,count,description,cost FROM sell where count>0 and seller_id=?`;
  
    con.query(sql, [sellerID], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve your materials' });
      }
      else if (results.length === 0) {
        return res.status(404).json({ message: 'You have not added items for sale' });
      }
      else
      // Return the list of comments of project as JSON
      return res.status(200).json(results);
    });
   }

   //delete material
 
   exports.deleteMaterial=(req, res) => {
    //Athorization that user can only add if he is a registered user
    const sellerID = req.user.id; // Extracted from JWT
    const {materialName } = req.params;
  
  
    const sql = `delete from sell where seller_id=? and material_name=?`;
  
    con.query(sql, [sellerID,materialName], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete this material from sales' });
      }

      else if(results.affectedRows === 0){
        return res.status(404).json({ message: 'There is no such material' });
        }
      else{       
        // Row was successfully deleted
        return res.status(200).json({ message: 'material removed successfully' });
      }

    });
   }



  