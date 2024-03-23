
const con = require('../config/dataBase');
const bcrypt = require('bcrypt');
const saltRounds=10;

exports.addUser = (req, res) => {
  const { name, email, location, telephone,role, password, experience, projectNum, wShoopNum, field,additional_info } = req.body;
 
// Hashing the password
bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
  if (err) {
      console.error(err);
      return;
  }



  const checkQuery = `SELECT COUNT(*) AS count FROM user WHERE email = ?`;
  con.query(checkQuery, [email], async (err, results) => {
      if (err) {
        console.log(err);
          res.status(500).json({ error: 'Internal server error' });
          
          return;
      }

      if (results[0].count > 0) {
          res.status(400).json({ error: 'Email already exists' });
          return;
      }
    

      const insertQuery = `INSERT INTO user(name, email, location,telephone, role, password, experience_years, projects_num, workshop_num, field,additional_info)  VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
      con.query(insertQuery, [name, email, location, telephone,role, hashedPassword, experience, projectNum, wShoopNum, field,additional_info], async (err, results) => {
          if (err) {
            console.log(err);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }

          res.status(200).json({ status: 'added successfully' });
      });

  });

}
);
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

  exports.search = (req, res) => {
    const field = req.query.field;
    const exp = req.query.exp;
    const wShop = req.query.wShop;
    const location = req.query.location;


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

    const currentId=req.user.id
    const { newPassword,userId} = req.body; 
if(currentId==userId){
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
    else {
        return res.status(403).json({ message: 'you do not have permession for this.' });

    }
  }


    exports. updateLocation=(req, res) =>{
      const currentId=req.user.id
      const { newLocation,userId} = req.body; 

      if(currentId==userId){

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
          else{
            return res.status(403).json({ message: 'you do not have permession for this.' });

          }
      }
     

        exports. updateProjectNum=(req, res) =>{
          const currentId=req.user.id

            const { newProjectNum,userId} = req.body; 

            if(currentId==userId){

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
          else {
            return res.status(403).json({ message: 'you do not have permession for this.' });

          }
          }