const express=require('express')
const router=express.Router();

const {addUser,searchById,search,searchByName,updatePassword,updateLocation, updateProjectNum}=require('../controllers/profileController')



router.post('/',addUser);
router.get('/id/:userId',searchById);
router.get('/name/:name',searchByName);

router.get('/search',search);


router.patch('/password',updatePassword);
router.patch('/location',updateLocation);
router.patch('/projectNum',updateProjectNum);

module.exports=router;





