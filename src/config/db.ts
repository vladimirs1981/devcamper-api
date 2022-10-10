import mongoose, { ConnectOptions } from 'mongoose';

const connectDB = async () => {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

export default connectDB;