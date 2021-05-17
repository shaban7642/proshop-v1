import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import orderRouter from './routes/orderRoute.js';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import uploadRouter from './routes/uploadRoute.js';

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/upload', uploadRouter);

app.get('/api/config/paypal', (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('API is running....');
    });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
    console.log(
        `App listening in ${process.env.NODE_ENV} mode on port ${PORT}!`.yellow
            .bold
    );
});
