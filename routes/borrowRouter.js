const express=require('express')
const router=express.Router();
const verifyToken=require('../middleware/authenticationToken');


const {addItem,deleteItem,searchByLeanderId,search,reserveItem}=require('../controllers/borrowController')


router.post('/',addItem);
router.delete('/:itemId',verifyToken,deleteItem);
router.get('/lender/:lenderId',searchByLeanderId);

router.get('/',search);
router.post('/reserve',reserveItem);
module.exports=router;