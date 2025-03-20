const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require("handlebars");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const connectDB = require("./db/connection");
// Add this to fix the createError not defined error
const createError = require('http-errors');
require("dotenv").config();

const indexRouter = require('./routes/index');
const companyRouter = require("./routes/company");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//iff helper
hbs.registerHelper('iff', function (a, operator, b, opts) {
  var bool = false;
  switch (operator) {
    case '==':
      bool = a == b;
      break;
    case '>':
      bool = a > b;
      break;
    case '<':
      bool = a < b;
      break;
    default:
      throw "Unknown operator " + operator;
  }
  if (bool) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 } //max age 1 hour
}));

// async function setupAdmin() {
//   try {
//     // Import AdminJS modules
//     const AdminJS = await import('adminjs');
//     const AdminJSExpress = await import('@adminjs/express');
//     const AdminJSMongoose = await import('@adminjs/mongoose');
//     const mongoose = require('mongoose');

//     // Register the adapter correctly
//     AdminJS.default.registerAdapter({
//       Database: AdminJSMongoose.Database,
//       Resource: AdminJSMongoose.Resource,
//     });

//     // Get your models for the admin panel
//     const Company = mongoose.model('Company');
    
//     // Define the custom dashboard using custom React component
//     const customDashboard = {
//       handler: async (request, response, context) => {
//         // Redirect to the Company list as soon as the dashboard is accessed
//         return {
//           redirectUrl: '/admin/resources/Company',
//         };
//       },
//     };

//     // Create AdminJS instance with customization
//     const admin = new AdminJS.default({
//       databases: [mongoose],
//       rootPath: "/admin",
//       resources: [
//         {
//           resource: Company,
//           options: {
//             navigation: {
//               name: 'Companies',
//               icon: 'Company',
//             },
//           },
//         },
//         // Add other models here
//       ],
//       dashboard: customDashboard, // This will completely override the default dashboard
//       branding: {
//         companyName: 'Beta Portal Admin',
//         logo: '',
//         favicon: '',
//         softwareBrothers: false
//       },
//       assets: {
//         styles: ['/admin-custom.css'],
//       }
//     });

//     // Create the router for AdminJS
//     const router = AdminJSExpress.default.buildRouter(admin);

//     // Custom redirection logic for the /admin route
//     app.use('/admin', (req, res, next) => {
//       if (req.path === '/') {
//         return res.redirect('/admin/resources/Company');  // Redirect to the Company resource page
//       }
//       next();
//     });

//     app.use(admin.options.rootPath, router);

//     // Serve custom CSS to hide default AdminJS elements
//     app.get('/admin-custom.css', (req, res) => {
//       res.type('text/css');
//       res.send(`
//         /* Hide default elements */
//         .adminjs-DocumentationLink,
//         .adminjs-SoftwareBrothers-link,
//         .adminjs-Version,
//         footer,
//         .adminjs-WelcomeMessage,
//         .adminjs-Dashboard-Cards,
//         .adminjs-Dashboard-Card,
//         .adminjs-Illustration {
//           display: none !important;
//         }
        
//         /* Custom styling */
//         .adminjs-Sidebar {
//           background-color: #1a1a2e;
//         }
        
//         .adminjs-Logo {
//           background-color: #16213e;
//         }
//       `);
//     });

//     console.log("AdminJS setup complete");

//   } catch (error) {
//     console.error("AdminJS setup error:", error);
//     console.error(error.stack);
//   }
// }


// async function setupAdmin() {
//   try {
//     // Import AdminJS modules
//     const AdminJS = await import('adminjs');
//     const AdminJSExpress = await import('@adminjs/express');
//     const AdminJSMongoose = await import('@adminjs/mongoose');
//     const mongoose = require('mongoose');

//     // Register the adapter correctly
//     AdminJS.default.registerAdapter({
//       Database: AdminJSMongoose.Database,
//       Resource: AdminJSMongoose.Resource,
//     });

//     // Get your models for the admin panel
//     const Company = mongoose.model('Company');
    
//     // Define the custom dashboard that redirects immediately
//     const customDashboard = {
//       component: AdminJS.bundle('./path-to-custom-dashboard-component'), // Specify custom React component if needed
//     };

//     // Create AdminJS instance with customization
//     const admin = new AdminJS.default({
//       databases: [mongoose],
//       rootPath: "/admin",
//       resources: [
//         {
//           resource: Company,
//           options: {
//             navigation: {
//               name: 'Companies',
//               icon: 'Company',
//             },
//           },
//         },
//         // Add other models here
//       ],
//       dashboard: customDashboard,
//       branding: {
//         companyName: 'Beta Portal Admin',
//         logo: '',
//         favicon: '',
//         softwareBrothers: false
//       },
//       assets: {
//         styles: ['/admin-custom.css'],
//       }
//     });

//     // Create the router
//     const router = AdminJSExpress.default.buildRouter(admin);

//     // Custom redirection before routing to admin panel
//     app.use('/admin', (req, res, next) => {
//       if (req.path === '/') {
//         return res.redirect('/admin/resources/Company');
//       }
//       next();
//     });

//     app.use(admin.options.rootPath, router);

//     // Add custom CSS to remove any default elements
//     app.get('/admin-custom.css', (req, res) => {
//       res.type('text/css');
//       res.send(`
//         .adminjs-DocumentationLink,
//         .adminjs-SoftwareBrothers-link,
//         .adminjs-Version,
//         footer,
//         .adminjs-WelcomeMessage,
//         .adminjs-Dashboard-Cards,
//         .adminjs-Dashboard-Card,
//         .adminjs-Illustration {
//           display: none !important;
//         }
        
//         .adminjs-Sidebar {
//           background-color: #1a1a2e;
//         }
        
//         .adminjs-Logo {
//           background-color: #16213e;
//         }
//       `);
//     });

//     console.log("AdminJS setup complete");

//   } catch (error) {
//     console.error("AdminJS setup error:", error);
//     console.error(error.stack);
//   }
// }

// async function setupAdmin() {
//   try {
//     // Import AdminJS modules
//     const AdminJS = await import('adminjs');
//     const AdminJSExpress = await import('@adminjs/express');
//     const AdminJSMongoose = await import('@adminjs/mongoose');
//     const mongoose = require('mongoose');

//     // Register the adapter correctly
//     AdminJS.default.registerAdapter({
//       Database: AdminJSMongoose.Database,
//       Resource: AdminJSMongoose.Resource,
//     });
    
//     // Get your models for the admin panel
//     // These names should match your actual mongoose models
//     const Company = mongoose.model('Company');
//     // Add other models you need
    
//     // Define a custom dashboard that will completely override the default
//     const customDashboard = {
//       handler: async (request, response, context) => {
//         // Here we completely bypass the default dashboard by redirecting
//         // This is the most reliable way to avoid the default dashboard cards
//         return {
//           redirectUrl: '/admin/resources/Company' // Redirect immediately to the Companies list
//         };
//       },
//     };
    
//     // Create AdminJS instance with customization
//     const admin = new AdminJS.default({
//       databases: [mongoose],
//       rootPath: "/admin",
//       resources: [
//         {
//           resource: Company,
//           options: {
//             navigation: {
//               name: 'Companies',
//               icon: 'Company',
//             },
//           },
//         },
//         // Add other models here
//       ],
//       dashboard: customDashboard,
//       branding: {
//         companyName: 'Beta Portal Admin',
//         logo: '',
//         favicon: '',
//         softwareBrothers: false
//       },
//       assets: {
//         styles: ['/admin-custom.css'],
//       }
//     });

//     // Create the router
//     const router = AdminJSExpress.default.buildRouter(admin);
//     app.use(admin.options.rootPath, router);
    
//     // Add custom CSS to remove any default elements
//     app.get('/admin-custom.css', (req, res) => {
//       res.type('text/css');
//       res.send(`
//         /* Hide absolutely all default AdminJS elements that we don't want */
//         .adminjs-DocumentationLink,
//         .adminjs-SoftwareBrothers-link,
//         .adminjs-Version,
//         footer,
//         .adminjs-WelcomeMessage,
//         .adminjs-Dashboard-Cards,
//         .adminjs-Dashboard-Card,
//         .adminjs-Illustration {
//           display: none !important;
//         }
        
//         /* Custom styling for the admin interface */
//         .adminjs-Sidebar {
//           background-color: #1a1a2e;
//         }
        
//         .adminjs-Logo {
//           background-color: #16213e;
//         }
//       `);
//     });
    
//     console.log("AdminJS setup complete");
//   } catch(error) {
//     console.error("AdminJS setup error:", error);
//     console.error(error.stack);
//   }
// }
// async function setupAdmin() {
//   try {
//     // Import AdminJS modules
//     const AdminJS = await import('adminjs');
//     const AdminJSExpress = await import('@adminjs/express');
//     const AdminJSMongoose = await import('@adminjs/mongoose');
//     const mongoose = require('mongoose');

//     // Register the adapter correctly
//     AdminJS.default.registerAdapter({
//       Database: AdminJSMongoose.Database,
//       Resource: AdminJSMongoose.Resource,
//     });
    
//     // Get your models for the admin panel
//     // Adjust these paths based on your project structure
//     const Company = mongoose.model('Company'); 
//     // Add other models you want to administer
    
//     // Create AdminJS instance with customization
//     const admin = new AdminJS.default({
//       databases: [mongoose],
//       rootPath: "/admin",
//       // Add resources that should appear in the admin panel
//       resources: [
//         {
//           resource: Company,
//           options: {
//             // Customize how this resource appears and behaves
//             navigation: {
//               name: 'Companies',
//               icon: 'Company',
//             },
//           },
//         },
//         // Add other resources here
//       ],
//       // Custom dashboard - this replaces the default dashboard
//       dashboard: {
//         // This function redirects from the dashboard to another page
//         handler: async (req, res, context) => {
//           // Redirect to the companies list instead of showing a dashboard
//           return { 
//             redirectUrl: '/admin/resources/companies' 
//           };
//         },
//       },
//       // Customize branding
//       branding: {
//         companyName: 'Beta Portal',
//         logo: '', // You can add a logo path here
//         favicon: '',
//         softwareBrothers: false, // This removes the AdminJS link
//       },
//       // Add custom assets (CSS) to modify appearance
//       assets: {
//         styles: ['/admin-custom.css'],
//       }
//     });

//     // Create the router - you can add authentication here if needed
//     const router = AdminJSExpress.default.buildRouter(admin);
//     app.use(admin.options.rootPath, router);
    
//     // Serve custom CSS to remove unwanted elements
//     app.get('/admin-custom.css', (req, res) => {
//       res.type('text/css');
//       res.send(`
//         /* Hide AdminJS default branding, links, and footer */
//         .adminjs-DocumentationLink,
//         .adminjs-SoftwareBrothers-link,
//         .adminjs-Version,
//         footer {
//           display: none !important;
//         }
        
//         /* You can add more custom styling here */
//         .adminjs-Sidebar {
//           background-color: #1a1a2e;
//         }
        
//         .adminjs-Logo {
//           background-color: #16213e;
//         }
//       `);
//     });
    
//     console.log("AdminJS setup complete");
//   } catch(error) {
//     console.error("AdminJS setup error:", error);
//     console.error(error.stack);
//   }
// }
// async function setupAdmin() {
//   try {
//     // Import AdminJS modules
//     const AdminJS = await import('adminjs');
//     const AdminJSExpress = await import('@adminjs/express');
//     const AdminJSMongoose = await import('@adminjs/mongoose');
//     const mongoose = require('mongoose');

//     // Register the adapter correctly
//     AdminJS.default.registerAdapter({
//       Database: AdminJSMongoose.Database,
//       Resource: AdminJSMongoose.Resource,
//     });
    
//     // Get your models for the admin panel
//     // Adjust these paths based on your project structure
//     const Company = mongoose.model('Company');
//     // Add other models you want to administer
    
//     // Create a simple custom dashboard HTML content
//     const customDashboardHandler = async (req, res) => {
//       const { translateMessage } = new AdminJS.default().i18n;
//       const companyName = " Admin";
      
//       // Create simple HTML content without the default card widgets
//       const customHtml = `
//         <section style="padding: 20px;">
//           <h1>${companyName} Dashboard</h1>
//           <p>Welcome to the admin panel. Use the sidebar to navigate to different resources.</p>
          
//           <div style="margin-top: 20px;">
//             <a href="/admin/resources/companies" style="
//               display: inline-block;
//               background-color: #4285f4;
//               color: white;
//               padding: 10px 15px;
//               text-decoration: none;
//               border-radius: 4px;
//               margin-right: 10px;
//             ">Manage Companies</a>
            
//             <!-- Add more links to your resources as needed -->
//           </div>
//         </section>
//       `;
      
//       return { html: customHtml };
//     };
    
//     // Create AdminJS instance with customization
//     const admin = new AdminJS.default({
//       databases: [mongoose],
//       rootPath: "/admin",
//       resources: [
//         {
//           resource: Company,
//           options: {
//             navigation: {
//               name: 'Companies',
//               icon: 'Company',
//             },
//           },
//         },
//         // Add other resources here
//       ],
//       // Set up a completely custom dashboard with HTML content
//       dashboard: {
//         component: false, // Disable the default component
//       },
//       branding: {
//         companyName: 'Beta Portal Admin',
//         logo: '', // You can add a logo path here
//         favicon: '',
//         softwareBrothers: false, // This removes the AdminJS link
//       },
//       assets: {
//         styles: ['/admin-custom.css'],
//       }
//     });

//     // Create the router
//     const router = AdminJSExpress.default.buildRouter(admin);
//     app.use(admin.options.rootPath, router);
    
//     // Serve custom CSS to remove unwanted elements and style the dashboard
//     app.get('/admin-custom.css', (req, res) => {
//       res.type('text/css');
//       res.send(`
//         /* Hide AdminJS default branding, links, and footer */
//         .adminjs-DocumentationLink,
//         .adminjs-SoftwareBrothers-link,
//         .adminjs-Version,
//         footer {
//           display: none !important;
//         }
        
//         /* Remove any remaining dashboard cards */
//         .adminjs-Dashboard-Cards {
//           display: none !important;
//         }
        
//         /* Custom styling */
//         .adminjs-Sidebar {
//           background-color: #1a1a2e;
//         }
        
//         .adminjs-Logo {
//           background-color: #16213e;
//         }
        
//         /* Add more custom styles as needed */
//       `);
//     });
    
//     console.log("AdminJS setup complete");
//   } catch(error) {
//     console.error("AdminJS setup error:", error);
//     console.error(error.stack);
//   }
// }

async function setupAdmin() {
  try {
    // Import AdminJS modules
    const AdminJS = await import('adminjs');
    const AdminJSExpress = await import('@adminjs/express');
    const AdminJSMongoose = await import('@adminjs/mongoose');
    const mongoose = require('mongoose');

    // Register the adapter
    AdminJS.default.registerAdapter({
      Database: AdminJSMongoose.Database,
      Resource: AdminJSMongoose.Resource,
    });

    // Get your models
    const Company = mongoose.model('Company');
    
    // Define the custom dashboard redirect
    const customDashboard = {
      handler: async (request, response, context) => {
        return {
          redirectUrl: '/admin/resources/Company',
        };
      },
    };

    // Create AdminJS instance with customization
    const admin = new AdminJS.default({
      databases: [mongoose],
      rootPath: "/admin",
      resources: [
        {
          resource: Company,
          options: {
            navigation: {
              name: 'Companies',
              icon: 'Company',
            },
          },
        },
        // Add other resources here
      ],
      dashboard: customDashboard, // Custom dashboard configuration
      branding: {
        companyName: 'Beta Portal Admin',
        logo: '',
        favicon: '',
        softwareBrothers: false
      },
      assets: {
        styles: ['/admin-custom.css'],
      },
      // Custom sidebar with additional navigation
      navigation: {
        pages: [
          {
            name: 'Custom Page 1',
            icon: 'View',
            href: '/admin/custom-page-1', // Custom route
          },
          {
            name: 'Custom Page 2',
            icon: 'Settings',
            href: '/admin/custom-page-2', // Another custom route
          },
        ],
      },
    });

    // Create the router for AdminJS
    const router = AdminJSExpress.default.buildRouter(admin);

    // Custom routes for additional pages
    app.get('/admin/custom-page-1', (req, res) => {
      res.send('<h1>Custom Page 1</h1><p>Here’s your custom page content!</p>');
    });

    app.get('/admin/custom-page-2', (req, res) => {
      res.send('<h1>Custom Page 2</h1><p>Another custom page content!</p>');
    });

    // Custom redirection logic for the /admin route
    app.use('/admin', (req, res, next) => {
      if (req.path === '/') {
        return res.redirect('/admin/resources/Company');
      }
      next();
    });

    app.use(admin.options.rootPath, router);

    // Serve custom CSS
    app.get('/admin-custom.css', (req, res) => {
      res.type('text/css');
      res.send(`
        /* Hide default elements */
        .adminjs-DocumentationLink,
        .adminjs-SoftwareBrothers-link,
        .adminjs-Version,
        footer,
        .adminjs-WelcomeMessage,
        .adminjs-Dashboard-Cards,
        .adminjs-Dashboard-Card,
        .adminjs-Illustration {
          display: none !important;
        }
        
        /* Custom styling */
        .adminjs-Sidebar {
          background-color: #1a1a2e;
        }
        
        .adminjs-Logo {
          background-color: #16213e;
        }
      `);
    });

    console.log("AdminJS setup complete");

  } catch (error) {
    console.error("AdminJS setup error:", error);
    console.error(error.stack);
  }
}

async function start() {
  try {
    // Connect to the database
    let url = "mongodb+srv://anazks:123@cluster0.jxpil.mongodb.net/betaPortal?retryWrites=true&w=majority";
    await connectDB(url);
    console.log("DB connected");
    
    // Setup AdminJS after DB connection
    await setupAdmin();
    
    // Setup routes
    app.use('/', indexRouter);
    app.use("/company", companyRouter);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    
  } catch (error) {
    console.error("Startup error:", error);
  }
}

// Start the application
start();

module.exports = app;