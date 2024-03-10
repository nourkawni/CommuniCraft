
const con = require('../config/dataBase');

exports.addUser = (req, res) => {
  const { name, email, location, role, password, experience, projectNum, wShoopNum, field } = req.body;

  const checkQuery = `SELECT COUNT(*) AS count FROM user WHERE email = ?`;
  con.query(checkQuery, [email], async (err, results) => {
      if (err) {
        console.log(err);
          res.status(500).json({ error: 'Internal server errorfdcgnnyjyfc' });
          
          return;
      }

      if (results[0].count > 0) {
          res.status(400).json({ error: 'Email already exists' });
          return;
      }
    

      const insertQuery = `INSERT INTO user(name, email, location, role, password, experience_years, projects_num, workshop_num, filed)  VALUES (?,?,?,?,?,?,?,?,?)`;
      con.query(insertQuery, [name, email, location, role, password, experience, projectNum, wShoopNum, field], async (err, results) => {
          if (err) {
            console.log(err);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }

          res.status(200).json({ status: 'added successfully' });
      });
  });
};

 exports. searchById=(req, res) => {
    const { userId } = req.params;
    con.query(
      'SELECT * FROM user WHERE user_id = ?',
      [userId],
      (error, results) => {

        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid data.' });
        }
        return res.json({ Data: results });
      },
    );
  }


  exports. searchByName=(req, res) => {
    const { userName } = req.params.name;
    con.query(
      'SELECT * FROM user WHERE name = ?',
      [userName],
      (error, results) => {

        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid data.  No '+ userName+' in records'});
        }
        return res.json({ Data: results });
      },
    );
  }

  exports. searchBylocation=(req, res) => {
    const  location = req.params.location;
    console.log(location);    
    con.query(
      'SELECT * FROM user WHERE location = ?',
      [location],
      (error, results) => {

        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid data.  No '+ location+' in records'});
        }
        return res.json({ Data: results });
      },
    );
  }

  exports. searchByExperienceYear=(req, res) => {

    const experienceYear = req.params.expYears;
    
    con.query(
      'SELECT * FROM user WHERE experience_years >= ?',
      [experienceYear],
      (error, results) => {

        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid data.  No '+ experienceYear+' in records'});
        }
        return res.json({ Data: results });
      },
    );
  }

  exports. searchByWshopNum=(req, res) => {

    const WshopNum = req.params.WshopNum;
    
    con.query(
      'SELECT * FROM user WHERE workshop_num >= ?',
      [WshopNum],
      (error, results) => {

        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid data.  No '+ WshopNum+' in records'});
        }
        return res.json({ Data: results });
      },
    );
  }

  exports. searchByField=(req, res) => {

    const WshopNum = req.params.field;
    
    con.query(
      'SELECT * FROM user WHERE workshop_num = ?',
      [field],
      (error, results) => {

        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid data.  No '+ field+' in records'});
        }
        return res.json({ Data: results });
      },
    );
  }




  exports.search = (req, res) => {
    const field = req.query.field;
    const exp = req.query.location;
    const wShop = req.query.description;
    const location = req.query.description;


    let query = 'SELECT * FROM user WHERE field = ?';
    let params = [field];

    if (location) {
        query += ' AND location = ?';
        params.push(location);
    }

    if (exp) {
        query += ' AND experience_years >= ?';
        params.push(exp);
    }
    if (wShop) {
      query += ' AND workshop_num = ?';
      params.push(wShop);
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




  exports. updatePassword=(req, res) =>{
    const { newPassword,userId} = req.body; 
    console.log(newPassword);
   con.query(
        'UPDATE user SET password=?  Where user_id=?',
        [newPassword, userId],
        (updateError) => {
          if (updateError) {
            console.log(updateError);
            return res.status(500).json({ error: 'Failed to update password' });
          }

          return res.status(200).json({ message: 'password updated successfully.' });
        },
      );
    }


    exports. updateLocation=(req, res) =>{
        const { newLocation,userId} = req.body; 
       con.query(
            'UPDATE user SET location=?  Where user_id=?',
            [newLocation, userId],
            (updateError) => {
              if (updateError) {
                console.log(updateError);
                return res.status(500).json({ error: 'Failed to update locaion' });
              }
    
              return res.status(200).json({ message: 'locaion updated successfully.' });
            },
          );
        }

        exports. updateProjectNum=(req, res) =>{
            const { newProjectNum,userId} = req.body; 
           con.query(
                'UPDATE user SET projects_num=?  Where user_id=?',
                [newProjectNum, userId],
                (updateError) => {
                  if (updateError) {
                    console.log(updateError);
                    return res.status(500).json({ error: 'Failed to update project number' });
                  }
        
                  return res.status(200).json({ message: 'project number updated successfully.' });
                },
              );
            }