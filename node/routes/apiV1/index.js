const express = require('express');
const router = express.Router();

// Status
const statusController = require('../../controllers/status/statusController');

// Dashboard
const dashboardController = require('../../controllers/dashboard/dashboardController');

// Blogs
const blogController = require('../../controllers/blogs/blogController');
const captionController = require('../../controllers/blogs/captionController');

// Profile
const profileController = require('../../controllers/profile/profileController');

// Utilities
const utilController = require('../../controllers/utils/utilController');

// Pages
const pagesController = require('../../controllers/pages/pagesController')

// Get Status
router.get('/status',statusController.getStatus);

///////////////////////////////////
////////  ACCOUNT SETUP  //////////
///////////////////////////////////

router.post('/addAccount', profileController.addAccount);



///////////////////////////////////
//////////  DASHBOARD  ////////////
///////////////////////////////////

// Returns Today's earnings, Today's Views and Total Earnings
router.get('/metaInfo', dashboardController.getMetaInfo);

// Returns all the pages
router.get('/pages', pagesController.getPages);

// 

/*
// Returns all the blogs and pages with their views and revenues
router.get('/getAllPagesInfo', dashboardController.getAllPagesInfo);

*/
// Returns all the blogs that are available
router.get('/getBlogs', blogController.getBlogs);
/*
// Returns blogs that are selected for that PAGE
router.get('/selectedBlogs/:pageId', blogController.selectedBlogsByPage);

// Adds a Caption to the selected Blog for a selected Page
router.post('/caption/add/:blog/:pageId', captionController.addCaption);

// Modify the Caption tothe selected Blog for a selected Page
router.put('/caption/edit/:blog/:pageId', captionController.editCaption);

// Deletes a Caption to the selected blog for a selected Page
router.delete('/caption/delete/:blog/:pageId', captionController.deleteCaption);

// Get Profile Data - Personal Details and Pages linked to the profile
router.get('/profile',profileController.getProfileInfo);

// Adds a Facebook Page to the profile
router.post('/addFacebookPage',profileController.addFbPage);
*/

router.post('/getBlogsFromAPI', utilController.saveBlogs);

module.exports = router;