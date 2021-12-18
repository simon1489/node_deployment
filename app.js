const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Put this env variables in production pointing to correct psp-client run build in server
// FRONTEND_BUILD_PATH=../psp-client/build
// FRONTEND_BUILD_INDEX=index.html

// Load env variables
const dotenv = require('dotenv').config();

app.use('/static', express.static(__dirname + '/public'));
app.set('views', './views');
app.set('view engine', 'pug');

if (process.env.FRONTEND_BUILD_PATH && process.env.FRONTEND_BUILD_INDEX)
{
    app.use(express.static(path.join(__dirname, process.env.FRONTEND_BUILD_PATH)));
}

const expressValidator = require('express-validator');
//Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const printingTypesRoutes = require('./routes/printingTypes');
const designerRoutes = require('./routes/designer');
const productViewsRoutes = require('./routes/productViews');
const ordersRoutes = require('./routes/orders');
const braintreeRoutes = require('./routes/braintree');
const shipping = require('./routes/shipping');
const productRating = require('./routes/productRating');

//DB Connection
mongoose.set('useFindAndModify', false);
mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true, 
        useUnifiedTopology : true,
        useCreateIndex : true
    }
)
.then(() => console.log('DB Connected'));

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//Routes Middleware
app.use("/api", authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', productsRoutes);
app.use('/api', printingTypesRoutes);
app.use('/api', designerRoutes);
app.use('/api', productViewsRoutes);
app.use('/api', ordersRoutes);
app.use("/api/images/products/", express.static("images/products"));
app.use("/api/images/views/", express.static("images/views"));
app.use('/api', braintreeRoutes);
app.use('/api', shipping);
app.use('/api', productRating);


app.get('/fpd/:isEditing/:selectedProductID/:selectedColor', (req, res) => {
    res.render('fpd.pug',
    {
        selectedProductID: req.params.selectedProductID,
        selectedColor: req.params.selectedColor,
        isEditing: req.params.isEditing,
        apiURL: process.env.API_URL,
    });
});

if (process.env.FRONTEND_BUILD_PATH && process.env.FRONTEND_BUILD_INDEX)
{
    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname, process.env.FRONTEND_BUILD_PATH + '/' + process.env.FRONTEND_BUILD_INDEX));
    });
}

//DB error connection detection
mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});