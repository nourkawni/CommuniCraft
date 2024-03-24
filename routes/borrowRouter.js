const express=require('express')
const router=express.Router();
const verifyToken=require('../middleware/authenticationToken');


const {addItem,deleteItem,getMyMaterilas,search,reserveItem,getMyReservation}=require('../controllers/borrowController')


router.post('/',verifyToken,addItem);
router.delete('/:itemId',verifyToken,deleteItem);
router.get('/lender',verifyToken,getMyMaterilas);

router.get('/',search);
router.get('/myReservation',verifyToken,getMyReservation);
router.post('/reserve',verifyToken,reserveItem);
module.exports=router;