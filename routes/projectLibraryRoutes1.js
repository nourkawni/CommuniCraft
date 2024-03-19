
const express=require('express');
const { addFavorite, addRate, addComment, returnFavorite, returnComment, returnRate, deleteFavorite, updateRate } = require('../controllers/projectLibraryController1');
const router=express.Router();
const verifyToken=require('../middleware/authenticationToken');

router.put('/addFavorite/:projectID',verifyToken,addFavorite);
router.post('/addRate/:projectID',verifyToken,addRate);
router.post('/addComment/:projectID',verifyToken,addComment);


router.get('/returnFavorite',verifyToken,returnFavorite)
router.get('/returnComment/:projectID',returnComment)
router.get('/returnRate/:projectID',returnRate)

router.delete('/deleteFavorite/:projectID',verifyToken,deleteFavorite)
router.post('/updateRate/:projectID',verifyToken,updateRate)

module.exports=router;
