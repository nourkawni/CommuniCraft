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
            return res.status(401).json({ message: 'Invalid data.' });
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

