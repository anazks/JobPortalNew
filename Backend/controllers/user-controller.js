const JobModel = require("../models/job-model")
const bcrypt = require("bcrypt")
const UserModel = require("../models/user-model")
const ApplicationModel = require("../models/application-model")
const companyModel = require("../models/company-model")
const { use } = require("../routes")


//signup
const getUserSignup = (req, res) => {
  let alertMessage = req.session.alertMessage
  res.render('user/signup', { title: "signup", alertMessage });
  delete req.session.alertMessage;
}
const createNewUser = async (req, res) => {
  // console.log(req.body)
  try {
    let oldpassword = req.body.password;
    req.body.password = await bcrypt.hash(oldpassword, 10); //encrypting the password from user and adding it to the req.body object
    console.log(req.body);
    const user = await UserModel.create(req.body);
    req.session.alertMessage = "Signup Comlpleted successfully"
    res.status(201).redirect("/login")
  } catch (error) {
    console.log(error);
    req.session.alertMessage = "Error in creating New User. Retry !!!!!";
    res.redirect('/signup')
  }
}
//login
const getUserLogin = (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  } else {
    let alertMessage = req.session.alertMessage
    res.render('user/login', { title: "login", alertMessage });
    delete req.session.alertMessage;
  }
}
const doUserLogin = async (req, res) => {
  try {
    // console.log(req.body, req.body.password);
    let { password } = req.body;
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      const exist = await bcrypt.compare(password, user.password);
      if (exist) {
        req.session.user = user;
        req.session.alertMessage = "Logged In successfully";
        return res.redirect("/")
      }
    }
    req.session.alertMessage = "Invalid User Credentials";
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    req.session.alertMessage = "Error Occured. Please Retry !!!";
    res.redirect("/login")
  }
}
//home page
const getHomePage = function (req, res, next) {
  let { alertMessage } = req.session;
  if (req.session.user) {
    let { user } = req.session; //fetching user and alert message stored inn session
    res.render('user/home-page', { title: 'Job Portal', user, alertMessage });
    delete req.session.alertMessage;
  } else {
    res.render('user/home-page', { title: 'Job Portal', alertMessage });
    delete req.session.alertMessage;
  }
}
//logout
const logout = (req, res) => {
  req.session.user = null;
  req.session.alertMessage = "Logged Out Successfully!!!";
  res.redirect("http://localhost:5173/");
}

//profile
const getProfilePage = (req, res) => {
  let { user } = req.session
  res.render("user/profile", { user })
}
const getUpdateUserForm = (req, res) => {
  let { user } = req.session;
  res.render("user/update-profile", { id: req.params.id, user })
};
const updateUserProfile = async (req, res) => {
  // console.log(req.body);
  // console.log(req.files);
  try {
    let { id } = req.params;
    req.body.completed = true;
    const user = await UserModel.findOneAndUpdate({ _id: id }, req.body, { new: true });
    if (user) {
      let { image, resume } = req.files;
      await image.mv("./public/images/users/profile/" + id + ".jpg");
      await resume.mv("./public/images/users/resume/" + id + ".pdf");
      req.session.user = user;
      req.session.alertMessage = "Updated Profile successfully"
      return res.redirect("/");
    }
    req.session.alertMessage = "Couldn't Update Retry"
    res.redirect("/")
  } catch (error) {
    console.log(error);
    req.session.alertMessage = "Couldn't Update Retry"
    res.redirect("/")
  }
};

const getJobsPage = async (req, res) => {
  try {
    const allJobs = await JobModel.find({});
    const appliedJobs = await ApplicationModel.find({}, 'job_id'); // Only fetch job_id field

    const appliedJobIds = new Set(appliedJobs.map(app => app.job_id));

    // Filter out jobs that are not applied to
    const jobs = allJobs.filter(job => !appliedJobIds.has(job._id.toString()));

    // Add days_ago field
    jobs.forEach((singleJob) => {
      const posted = new Date(singleJob.datePosted);
      const today = new Date();
      const difference_in_time = today.getTime() - posted.getTime();
      singleJob.days_ago = Math.floor(difference_in_time / (1000 * 3600 * 24));
    });

    res.render("user/job-list", { jobs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const getAllCompanies = (req, res) => {
};

const applyJob = async (req, res) => {
  console.log(req.body)
  let { _id: user_id,
    name: username,
    email: user_mail,
    phone_no: user_mobile
  } = req.session.user;
  const applicationObj = {
    job_id: req.params.id,
    company_id: req.body.company_id,
    user_id,
    username,
    user_mobile,
    user_mail,
    applyDate: new Date().toLocaleDateString()
  };
  console.log(applicationObj)
  try {
    const application = await ApplicationModel.create(applicationObj);
    req.session.alertMessage = "Applied To Job successfully !!!!"
    res.redirect("/")
  } catch (error) {
    console.log(error);
    req.session.alertMessage = "Couldn't apply !!! Please Retry."
    res.status(500).redirect("/user-jobs")
  }


};
// const getUserNotifications = (req, res) => {
// };
const getUserApplications = (req, res) => {
};
const getAdminLogin = (req,res)=>{
  res.render("Login")
}
const preAdmin = async(req,res)=>{
  let companies = await companyModel.find({});
  let users = await UserModel.find({});
  let jobs = await JobModel.find({});
  let applications = await ApplicationModel.find({});
  res.render("Admin/admin",{companies,users,jobs,applications})
}

const getMyJobs = async (req, res) => {
  try {
    let { user } = req.session;
    // Find all applications for the current user
    let applications = await ApplicationModel.find({ user_id: user._id });
    
    // Method 1: Using Promise.all with separate queries
    const jobsWithDetails = await Promise.all(
      applications.map(async (application) => {
        // Find job details for each application
        const jobDetails = await JobModel.findOne({ _id: application.job_id });
        
        // Return combined data
        return {
          application: application.toObject(),
          job: jobDetails ? jobDetails.toObject() : null
        };
      })
    );
    
    // For API endpoint
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(200).json({ success: true, data: jobsWithDetails });
    }
    
    // For web view - render HBS template
    return res.render('user/myJobs', { 
      data: jobsWithDetails,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    
    // For API endpoint
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ success: false, message: 'Error fetching job applications' });
    }
    
    // For web view
    return res.render('error', { 
      message: 'Error fetching your applications',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

//   try {
//     let { user } = req.session;
//     // Find all applications for the current user
//     console.log(user._id,"user id");
//     let applications = await ApplicationModel.find({ user_id: user._id });
    
//     // Method 1: Using Promise.all with separate queries
//     const jobsWithDetails = await Promise.all(
//       applications.map(async (application) => {
//         // Find job details for each application
//         const jobDetails = await JobModel.findOne({ _id: application.job_id });
        
//         // Return combined data
//         return {
//           application: application.toObject(),
//           job: jobDetails ? jobDetails.toObject() : null
//         };
//       })
//     );
//     console.log('Jobs with details:', jobsWithDetails);
//     // res.status(200).json({ success: true, data: jobsWithDetails });
//     res.render("user/myJobs",{jobsWithDetails,success: true})
//   } catch (error) {
//     console.error('Error fetching job applications:', error);
//     res.status(500).json({ success: false, message: 'Error fetching job applications' });
//   }
// };
const deleteCompany = async (req, res) => {
  try {
    let { id } = req.params;
    const company = await companyModel.findOneAndDelete({ _id:id });
    if (company) {
      req.session.alertMessage = "Company Deleted successfully";
      return res.redirect("/preAdmin");
    }
    req.session.alertMessage = "Couldn't Delete Company. Retry" 
    res.redirect("/preAdmin")
  } catch (error) {
    console.log(error);
    req.session.alertMessage = "Couldn't Delete Company. Retry"
    res.redirect("/preAdmin")
  }
}
const deleteUser = async (req, res) => {
    try {
      let { id } = req.params;
      const user = await UserModel.findOneAndDelete({ _id:id }); 
      if (user) {
        req.session.alertMessage = "User Deleted successfully";
        return res.redirect("/preAdmin");
      }
  }catch(error) {
    console.log(error);
    req.session.alertMessage = "Couldn't Delete User. Retry"
    res.redirect("/preAdmin")
  }
}
const updateCompany   = async (req, res) => {
  console.log(req.params.id,"getCompanyUpdateForm");
    let company = await companyModel.findOne({ _id: req.params.id})
    console.log(company);
    res.render("Admin/CompanyUpdate", {  company })
}
const updateCompanyForm = async (req, res) => {
  try {
    let { id } = req.body;
    const company = await companyModel.findOneAndUpdate({ _id: id }, req
    .body, { new: true });
    if (company) {
      req.session.alertMessage = "Company Updated successfully";
      return res.redirect("/preAdmin");
    }
    req.session.alertMessage = "Couldn't Update Company. Retry"
    res.redirect("/preAdmin")
  } catch (error) {
    console.log(error);
    req.session.alertMessage = "Couldn't Update Company. Retry"
    res.redirect("/preAdmin")
  }
}
const getUserUpdatePage = async (req, res) => {
  // let { user } = req.session;
  let id = req.params.id;
  let users   = await UserModel.find({_id:id})
  let user = users[0];
  console.log(user);
  res.render("Admin/userUpdate",{user})
}
const updateUser = async (req,res)=>{
  try {
    let id = req.body.id;
    const user = await UserModel
    .findOneAndUpdate({
      _id: id
    }, req.body, {
      new: true
    });
    if (user) {
      req.session.alertMessage = "User Updated successfully";
      return res.redirect("/preAdmin");
    }
    req.session.alertMessage = "Couldn't Update User. Retry"
  } catch (error) {
    console.log(error);
    req.session.alertMessage = "Couldn't Update User. Retry"
    res.redirect("/preAdmin")
  }
}

module.exports = {
  getHomePage,
  getUserLogin,
  getUserSignup,
  createNewUser,
  doUserLogin,
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
}
