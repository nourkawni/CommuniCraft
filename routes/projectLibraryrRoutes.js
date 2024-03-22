const express=require('express')
const router=express.Router();
const {
    getProjects,
    addProject,
    registerTeam,
    editProject
               
}=require('../controllers/projectLibraryController');


const verifyToken=require('../middleware/authenticationToken');


router.get('/',getProjects);
router.post('/',  verifyToken, addProject);
router.put('/:id',  verifyToken, editProject);
router.post('/register',  verifyToken, registerTeam);


module.exports=router;
