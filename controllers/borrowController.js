
const con = require('../config/dataBase');


exports.addItem = (req, res) => {
    const { lenderId, lenderName, materialName, count, description, telephone, location} = req.body;
            
 
    
        const insertQuery = `INSERT INTO borrowing(lender_id, lender_name, material_name, count, description, telephone, location)  VALUES (?,?,?,?,?,?,?)`;
        con.query(insertQuery, [lenderId, lenderName, materialName, count, description, telephone, location], async (err, results) => {
            if (err) {
              console.log(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
  
            res.status(200).json({ status: 'added successfully' });
        });
  
  };



  exports.deleteItem = (req, res) => {
    const currentId = req.user.id;
    const itemId = req.params.itemId;

    const countQuery = `SELECT COUNT(*) AS count FROM borrowing WHERE material_id=?`;
    con.query(countQuery, [itemId], async (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results[0].count === 0) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }

        const lenderIdQuery = `SELECT lender_id FROM borrowing WHERE material_id=?`;
        con.query(lenderIdQuery, [itemId], async (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            const lenderId = results[0].lender_id;
            if (lenderId != currentId) {
                res.status(403).json({ error: 'You do not have permission to delete this item' });
                return;
            }

            const deleteQuery = `DELETE FROM borrowing WHERE material_id=?`;
            con.query(deleteQuery, [itemId], async (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

                res.status(200).json({ status: 'deleted successfully' });
            });
        });
    });
};



exports.getMyMaterilas = (req, res) => {

    const lenderId  = req.params.lenderId;
    const currentId = req.user.id;



    con.query(
        'SELECT * FROM borrowing WHERE lender_id = ?',
        [currentId],
        (error, results) => {
  
          if (error) {
            return res.status(500).json({ message: 'Internal server error.' });
          }
          if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid data.  No '+ lenderId+' in records'});
          }
          return res.json({ Data: results });
        },
      );



}




    exports.search = (req, res) => {
        const materialName = req.query.materialName;
        const location = req.query.location;
        const description = req.query.description;
    
        let query = 'SELECT * FROM borrowing WHERE material_name = ?';
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
    
    
    exports.reserveItem = (req, res) => {

        const { materialId, period } = req.body;
        const currentId = req.user.id;

    
        // Get the current amount from the borrow table
        const selectQuery = `SELECT count FROM borrowing WHERE material_id = ?`;
        con.query(selectQuery, [materialId], async (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
    
            if (results.length === 0) {
                res.status(404).json({ error: 'Material not found' });
                return;
            }
    
            const currentAmount = results[0].amount;
    
            // Check if there are available items to borrow
            if (currentAmount === 0) {
                res.status(400).json({ error: 'No items available for borrowing' });
                return;
            }
    
            // Start a transaction
            con.beginTransaction((err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }
    
                // Insert into settler table
                const insertQuery = `INSERT INTO settler(settler_id, material_id, period)  VALUES (?,?,?)`;
                con.query(insertQuery, [currentId, materialId, period], async (err, results) => {
                    if (err) {
                        return con.rollback(() => {
                            console.log(err);
                            res.status(500).json({ error: 'Internal server error' });
                        });
                    }
    
                    // Update the borrow table
                    const updateQuery = `UPDATE borrowing SET count = ?  WHERE material_id = ?`;
                    const newAmount = Number.isInteger(currentAmount) ? currentAmount - 1 : currentAmount;

                    con.query(updateQuery, [newAmount,materialId], async (err, results) => {
                        if (err) {
                            return con.rollback(() => {
                                console.log(err);
                                res.status(500).json({ error: 'Internal server error' });
                            });
                        }
    
                        // Commit the transaction
                        con.commit((err) => {
                            if (err) {
                                return con.rollback(() => {
                                    console.log(err);
                                    res.status(500).json({ error: 'Internal server error' });
                                });
                            }
    
                            res.status(200).json({ status: 'added successfully' });
                        });
                    });
                });
            });
        });
    };
    


    exports.getMyReservation = (req, res) => {
        const currentId = req.user.id;
    
        con.query(
            'SELECT b.* FROM settler s JOIN borrowing b ON s.material_id = b.material_id WHERE s.settler_id = ?',
            [currentId],
            (error, results) => {
                if (error) {
                    console.log(error);

                    return res.status(500).json({ message: 'Internal server error.' });
                }
                if (results.length === 0) {
                    return res.status(401).json({ message: 'Invalid data. No reservation found for this user.' });
                }
                return res.json({ Data: results });
            },
        );
    }
    















