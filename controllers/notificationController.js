const con = require('../config/dataBase');

exports.getMyNotifications = (req, res) => {
    const currentId = req.user.id;
    con.query(
        'SELECT notif_id,msg FROM notification WHERE user_id = ?',
        [currentId],
        (error, results) => {
  
          if (error) {
            return res.status(500).json({ message: 'Internal server error.' });
          }
          if (results.length === 0) {
            return res.status(401).json({ message: 'No notification yet .' });
          }
          return res.json({ Data: results });
        },
      );
  
  };


  exports.deleteNotif = (req, res) => {
    const currentId = req.user.id;
    const itemId = req.params.itemId;

    const countQuery = `SELECT COUNT(*) AS count FROM notification WHERE notif_id=?`;
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

        const lenderIdQuery = `SELECT user_id FROM notification WHERE notif_id=?`;
        con.query(lenderIdQuery, [itemId], async (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            const user = results[0].user_id;
            if (user != currentId) {
                res.status(403).json({ error: 'You do not have permission to delete this item' });
                return;
            }

            const deleteQuery = `DELETE FROM notification WHERE notif_id=?`;
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



const cron = require('node-cron');

// Schedule a task to run every day at midnight
cron.schedule('0 0 * * *', () => {
    console.log('Running daily task...');
    checkPeriodAndSendNotification();
});

function checkPeriodAndSendNotification() {
    const selectQuery = `SELECT settler.settler_id, borrowing.material_id, borrowing.material_name
                         FROM settler
                         JOIN borrowing ON settler.material_id = borrowing.material_id
                         WHERE settler.period = 0`;
    con.query(selectQuery, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            results.forEach((row) => {
                const { settler_id, material_id, material_name } = row;
                const message = `Your period has ended for ${material_name} (ID: ${material_id})`;
                const insertQuery = `INSERT INTO notification (user_id, message) VALUES (?, ?)`;
                con.query(insertQuery, [settler_id, message], (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Notification added successfully for settler_id ${settler_id}`);
                    }
                });
            });
        }
    });
}




