const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const errorHandler = require('./middleware/errorhandler');
const mongoSanitize = require('express-mongo-sanitize');
const { globalErrorHandler, AppError } = require('./middleware/errorhandler.js');
const categoriesroutes = require('./routes/categoriesroutes');
const productroutes = require('./routes/productroutes');
const cartroutes = require('./routes/cartroutes');
const orderroutes = require('./routes/orderroutes');
const app = express()

// Load environment config
dotenv.config();

// Connect to MongoDB Database
connectDB();

app.use((req, res, next) => {
    Object.defineProperty(req, 'query', {
        ...Object.getOwnPropertyDescriptor(req, 'query'),
        value: req.query,
        writable: true,
    });
    next();
});

app.use(express.json());
app.use(mongoSanitize());


//Routing
app.use('/api/categories', categoriesroutes);
app.use('/api/products', productroutes);
app.use('/api/cart', cartroutes);
app.use('/api/order', orderroutes);
      



//404

app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Not Found' });
})


const PORT = 3000; 

app.get('/', (req, res) => {
    res.send('Hello World! This is my text on localhost:3000.');
});

app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));



