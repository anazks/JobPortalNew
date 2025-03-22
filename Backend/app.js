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