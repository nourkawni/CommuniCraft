const express=require('express');
const { returnSales, search, addMaterial, buy, returnSellerMaterials,deleteMaterial } = require('../controllers/sellController');
const router=express.Router();

const verifyToken=require('../middleware/authenticationToken');

router.get('/returnSales',returnSales)
router.get('/search/?',search)
router.post('/addmaterial',verifyToken,addMaterial)
router.post('/buy',buy)
router.get('/returnsellermaterials',verifyToken,returnSellerMaterials)
router.delete('/:materialName',verifyToken,deleteMaterial)

module.exports=router;