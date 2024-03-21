const express=require('express');
const { chatAPI } = require('../controllers/external_API_Controller');
const router=express.Router();

router.get('/',chatAPI)

module.exports=router;