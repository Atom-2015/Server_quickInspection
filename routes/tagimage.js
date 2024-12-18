const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuth_middleware');
const TagImage = require('../controler/Tag_image_Controler');

// API to store data of tag group
router.post('/storegroup', isAuthenticated, TagImage.HandleCreateGroup);


//Api to store tags 
router.post('/storetag' , isAuthenticated , TagImage.HandleAddIssue);

// Api to get  all tags
router.get('/getalltags', isAuthenticated, TagImage.HandleAllTagdata);

//Api to Add tags with perticular image array
router.post('/addtagwithimage', isAuthenticated, TagImage.HanadleTagStore);

// Api to unassign the tags of Array of immmage 
router.post('/unassign'  , TagImage.HandleRemoveTags);


module.exports = router;
