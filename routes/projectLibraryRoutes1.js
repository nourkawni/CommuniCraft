
const express=require('express');
const { addFavorite, addRate, addComment, returnFavorite, returnComment, returnRate, deleteFavorite, updateRate } = require('../controllers/projectLibraryController1');
const router=express.Router();
const verifyToken=require('../middleware/authenticationToken');

router.put('/Favorite/:projectID',verifyToken,addFavorite);
router.post('/Rate/:projectID',verifyToken,addRate);
router.post('/Comment/:projectID',verifyToken,addComment);


router.get('/Favorite',verifyToken,returnFavorite)
router.get('/Comment/:projectID',returnComment)
router.get('/Rate/:projectID',returnRate)

router.delete('/Favorite/:projectID',verifyToken,deleteFavorite)
router.post('/RateChange/:projectID',verifyToken,updateRate)

module.exports=router;
