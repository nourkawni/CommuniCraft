const express=require('express');
const { returnSales, search, addMaterial, buy, returnSellerMaterials,deleteMaterial } = require('../controllers/sellController');
const router=express.Router();

const verifyToken=require('../middleware/authenticationToken');

router.get('/allSales',returnSales)
router.get('/search/?',search)
router.post('/material',verifyToken,addMaterial)
router.post('/buy',buy)
router.get('/sellermaterials',verifyToken,returnSellerMaterials)
router.delete('/:materialName',verifyToken,deleteMaterial)

module.exports=router;