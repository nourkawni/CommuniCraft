const express=require('express')
const router=express.Router();


const {addItem,deleteItem,searchByLeanderId,search,reserveItem}=require('../controllers/borrowController')


router.post('/',addItem);
router.delete('/:itemId',deleteItem);
router.get('/lender/:lenderId',searchByLeanderId);

router.get('/',search);
router.post('/reserve',reserveItem);
module.exports=router;