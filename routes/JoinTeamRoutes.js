const express=require('express')
const router=express.Router();
const {

    sendMessage,
    checkMessages,
    managerResponse
               
}=require('../controllers/JoinTeamController');

const verifyToken=require('../middleware/authenticationToken');

router.get('/',verifyToken, checkMessages);
router.post('/', verifyToken, sendMessage);
router.put('/', verifyToken, managerResponse);


module.exports=router;