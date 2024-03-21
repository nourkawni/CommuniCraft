const express=require('express')
const router=express.Router();
const verifyToken=require('../middleware/authenticationToken');


const {getMyNotifications,deleteNotif}=require('../controllers/notificationController.js')


router.get('/',verifyToken,getMyNotifications);
router.delete('/:itemId',verifyToken,deleteNotif);


module.exports=router;