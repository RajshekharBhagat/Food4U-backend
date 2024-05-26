import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';


const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use('/api/v1/orders/checkout/webhook',express.raw({ type: '*/*' }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.json())
app.use(express.static('public'));
app.use(cookieParser())
app.set('/test','Hello WOrld');

app.get('/health',(req: Request ,res: Response) => {
    res.send({message: "health OK!"});
})


//Import Routes
import userRouter from './routes/user.router';
import restaurantRouter from './routes/restaurant.router';
import restaurantUtilsRoute from './routes/restaurantUtils.router';
import orderRouter from './routes/order.route';

//Route declaration
app.use('/api/v1/user',userRouter);
app.use('/api/v1/restaurant',restaurantRouter);
app.use('/api/v1/restaurantUtils',restaurantUtilsRoute);
app.use('/api/v1/orders',orderRouter);

export {app}