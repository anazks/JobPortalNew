const bcrypt = require("bcrypt");

const ApplicationModel = require("../models/application-model");
const CompanyModel = require("../models/company-model");
const JobModel = require("../models/job-model");
const applicationModel = require("../models/application-model");
const companyModel = require("../models/company-model");
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anazksunil2@gmail.com',  // Replace with your email
        pass: 'gefd cyst feti eztk'
    }
  });


//signup
const getCompanySignup = function (req, res) {
    res.render("company/signup", { title: "Company signup" })
};
const createNewCompany = async function (req, res) {
    console.log(req.body);
    try {
        let oldpassword = req.body.password;
        req.body.password = await bcrypt.hash(oldpassword, 10); //encrypting the password from company and adding it to the req.body object
        console.log(req.body);
        const company = await CompanyModel.create(req.body);
        req.session.alertMessage = "Successfully created an account"
        res.status(201).redirect("/company/login")
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error in creating New account. Retry !!!!!";
        res.redirect('/company/signup')
    }
};
//login
const getCompanyLogin = function (req, res) {
    if (req.session.company) {
        res.redirect('/company')
    } else {
        let alertMessage = req.session.alertMessage
        res.render('company/login', { title: "login", alertMessage });
        delete req.session.alertMessage;
    }
};
const doCompanyLogin = async function (req, res) {
    try {
        // console.log(req.body, req.body.password);
        let { password } = req.body;
        const company = await CompanyModel.findOne({ email: req.body.email });
        if (company) {
            const exist = await bcrypt.compare(password, company.password);
            if (exist) {
                req.session.company = company;
                req.session.alertMessage = "Logged In successfully";
                return res.redirect("/company")
            }
        }
        req.session.alertMessage = "Invalid login Credentials";
        res.redirect("/company/login");
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error Occured. Please Retry !!!";
        res.redirect("/company/login")
    }
};
const geCompanytHomePage = function (req, res) {
    if (req.session.company) {
        let { company, alertMessage } = req.session; //fetching company and alert message stored inn session
        res.render('company/home-page', { title: 'Job Portal', company, alertMessage });
        delete req.session.alertMessage;
    } else res.redirect("/company/login");

};
const logout = function (req, res) {
    req.session.company = null;
    req.session.alertMessage = "Logged Out Successfully!!!"
    res.redirect("http://localhost:5173/");

}
const getNewJobForm = function (req, res) {
    res.render("company/add-new-job", { company: req.session.company })
};
const createNewJob = async function (req, res) {
    console.log(req.body);
    try {
        let today = new Date().toLocaleDateString();
        req.body.datePosted = today;
        const job = await JobModel.create(req.body);
        req.session.alertMessage = "created  Job Successfully "
        res.status(201).redirect("/company")
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Error in creating New account. Retry !!!!!";
        res.redirect('/company/add-new-job')
    }
};
//profile
const getProfilePage = function (req, res) {
    res.render("company/profile", { company: req.session.company })
}
const getCompanyUpdateForm = function (req, res) {
    console.log(req.params.id,"getCompanyUpdateForm");
    const { company } = req.session;
    console.log(company);
    res.render("company/update-company", { id: req.params.id, company })
};
const updateCompanyProfile = async function (req, res) {
    // console.log(req.body);
    // console.log(req.files);
    try {
        let { id } = req.params;
        req.body.completed = true;
        const company = await CompanyModel.findOneAndUpdate({ _id: id }, req.body, { new: true });
        if (company) {
            let { image } = req.files;
            await image.mv("./public/images/company/" + id + ".jpg");
            req.session.company = company;
            req.session.alertMessage = "Updated Profile successfully"
            return res.redirect("/company");
        }
        req.session.alertMessage = "Couldn't Update Retry"
        res.redirect("/company")
    } catch (error) {
        console.log(error);
        req.session.alertMessage = "Couldn't Update Retry"
        res.redirect("/company")
    }
};
const getCompanyJobsPage = async function (req, res) {
    const jobs = await JobModel.find({ company_id: req.params.id });
    res.render("company/company-job-list", { jobs })
};
const getCompanyApplications = async function (req, res) {
    const { _id } = req.session.company;
    const applications = await ApplicationModel.find({ company_id: _id, status: { $ne: "rejected" } });
    applications.forEach((singleApplication) => {
        if (singleApplication.status == "applied")
            singleApplication.applied = true;
        else if (singleApplication.status == "shortlisted")
            singleApplication.shortlisted = true;
    })
    res.render("company/application-list", { applications })
};
const shortListApplication = async function (req, res) {
    const { id } = req.params;
    const application = await ApplicationModel.findOneAndUpdate({ _id: id }, { status: "shortlisted" });
    req.session.alertMessage = "Application shortlisted successfully!!!"
    res.redirect("/company/company-applications");
};
const acceptApplication = async function (req, res) {
    const { id } = req.params;
    const application = await ApplicationModel.findOneAndUpdate({ _id: id }, { status: "accepted" });
    req.session.alertMessage = "Application Accepted successfully!!!"
    res.redirect("/company/company-applications");
};
const rejectApplication = async function (req, res) {
    const { id } = req.params;
    const application = await ApplicationModel.findOneAndUpdate({ _id: id }, { status: "rejected" });
    req.session.alertMessage = "Application is Rejected!!!"
    res.redirect("/company/company-applications");
};
const updateJob = async(req,res)=>{
    const id = req.body.job_id;
    const job = await JobModel.findOneAndUpdate
    ({_id:id},req.body,{new:true}); 
    // req.session.alertMessage = "Job Updated Successfully";
    res.redirect("/company"); 
}
const GetupdateJob = async(req,res)=>{
    const {id} = req.params;
    const job = await JobModel.findOne({_id:id});
    console.log(job);
    res.render("company/update-job",{job});
}
const deletejob = async(req,res)=>{
    const {id} = req.params;
    const job = await JobModel.findOneAndDelete({_id:id});
    res.redirect("/company");
}
const Invite = async(req,res)=>{
    try {
        let id = req.params.id
        console.log(id,"id..")
        let applications = await applicationModel.find({_id:id})
        console.log(applications,"---")
        let com_id =  applications[0].company_id
        console.log(com_id,"com_id--------")
        let userEmail = applications[0].user_mail
        let company = await companyModel.find({_id:com_id})
        console.log(company,"company")
        let CompanyObject = company[0]
        const mailOptions = {
            from: 'Job Portal',
            to: userEmail,
            subject: "You have a New Interview Invitation ",
            text: `Hello... You have a New Interview Invitation from ${CompanyObject.name} please contact us for the further procedure HR will contact you shortly`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ error: "Failed to send email" });
            } else {
                console.log("Email sent:", info.response);
                res.redirect("/company")
            }
        });
    } catch (error) {
        console.log(error)
    }
}
const offerLetter= async(req,res)=>{
    try {
      let id = req.params.id
        console.log(id)
        let applications = await applicationModel.find({_id:id})
        console.log(applications,"---")
        let com_id =  applications[0].company_id
        let {username} = applications[0]
        console.log(com_id,"com_id--------")
        let userEmail = applications[0].user_mail
        let company = await companyModel.find({_id:com_id})
        console.log(company,"company")
        let CompanyObject = company[0]
        const mailOptions = {
            from: 'Job Portal',
            to: userEmail,
            subject: "Offer Letter",
            text: `Dear ${username},
        
        We are pleased to inform you that you have been selected for the position at ${CompanyObject.name}. After reviewing your application and performance, we believe your skills and experience are a great fit for our organization.
        
        Please find below the brief details of your offer:
        
        Company Name: ${CompanyObject.name}
        Email: ${CompanyObject.email}
      
        
        A formal offer letter with more detailed terms and conditions will be sent to your email shortly. We are excited to welcome you to our team and look forward to working with you.
        
        If you have any questions or need further information, please feel free to contact us.
        
        Warm regards,  
        ${CompanyObject.name}  
        HR Team`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ error: "Failed to send email" });
            } else {
                console.log("Email sent:", info.response);
                res.redirect("/users/home")
            }
        });
        res.redirect('/company')
        
    } catch (error) {
      console.log(error)
    }
  }
const reports = async(req,res)=>{
    try {
        let company = req.session.company
        console.log(company,"session..")
        let application = await applicationModel.find({company_id:company._id})
        console.log(application)
        res.render('company/reports',{application})
    } catch (error) {
        
    }
}
module.exports = {
    getCompanyLogin,
    doCompanyLogin,
    getCompanySignup,
    createNewCompany,
    logout,
    geCompanytHomePage,
    getNewJobForm,
    createNewJob,
    getProfilePage,
    getCompanyUpdateForm,
    updateCompanyProfile,
    getCompanyJobsPage,
    getCompanyApplications,
    shortListApplication,
    acceptApplication,
    rejectApplication,
    updateJob,
    GetupdateJob,
    deletejob,
    Invite,
    offerLetter,
    reports
} 