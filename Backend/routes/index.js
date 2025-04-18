var express = require('express');
var router = express.Router();

const { getUserLogin,
    getUserSignup,
    createNewUser,
    doUserLogin,
    getHomePage,
    getProfilePage,
    getUpdateUserForm,
    updateUserProfile,
    getJobsPage,
    getAllCompanies,
    applyJob,
    getUserApplications,
    logout,
    getAdminLogin,
    preAdmin,
    getMyJobs,
    deleteCompany,
    deleteUser,
    updateCompany,
    updateCompanyForm,
    getUserUpdatePage,
    updateUser
} = require("../controllers/user-controller")

//middleware for authentication
const checkUser = require('../middleware/checkUser')

router.route('/signup').get(getUserSignup).post(createNewUser);
router.route('/login').get(getUserLogin).post(doUserLogin);
router.route("/logout").get(logout)
router.route('/').get(getHomePage);
router.route("/profile").get(checkUser, getProfilePage)
router.route("/update-user/:id").get(checkUser, getUpdateUserForm).post(checkUser, updateUserProfile)
router.route('/user-jobs').get(getJobsPage);
router.route('/companies').get(getAllCompanies);
router.route('/apply-job/:id').post(checkUser, applyJob) //job id
// router.route('/notifications/:id').get(getUserNotifications);
router.route('/user-applications/:id').get(checkUser, getUserApplications);
router.route('/LoginRouter').get(getAdminLogin)
router.route('/preAdmin').get(preAdmin)
router.route('/getMyJobs').get(getMyJobs);
router.route('/deleteCompany/:id').get(deleteCompany);
router.route('/deleteUser/:id').get(deleteUser);
router.route('/updateCompany/:id').get(updateCompany);
router.route('/update-Company').post(updateCompanyForm);

router.route('/UpdateUser/:id').get(getUserUpdatePage)
router.route('/update-user').post(updateUser)
// router.report('/offerLetter/:id').get(offerLetter)
module.exports = router;
