const express=require('express')
const router=express.Router();

const {addUser,searchById,search,searchByName,updatePassword,updateLocation, updateProjectNum}=require('../controllers/profileController')
const verifyToken=require('../middleware/authenticationToken');


router.post('/',addUser);
router.get('/id/:userId',searchById);
router.get('/name/:name',searchByName);

router.get('/search',search);


router.patch('/password',verifyToken,updatePassword);
router.patch('/location',verifyToken,updateLocation);
router.patch('/projectNum',verifyToken,updateProjectNum);

module.exports=router;





