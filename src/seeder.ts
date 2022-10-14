import fs from 'fs';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
// Load models
import Bootcamp from './models/Bootcamp';
import { Course } from './models/Course';
import { User } from './models/User';
import path from 'path';

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(`${process.env.MONGO_URI}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
} as ConnectOptions);

// Read JSON file
const bootcamps = JSON.parse(
	fs.readFileSync(path.join(__dirname, '../_data/bootcamps.json'), 'utf-8')
);

const courses = JSON.parse(
	fs.readFileSync(path.join(__dirname, '../_data/courses.json'), 'utf-8')
);

const users = JSON.parse(
	fs.readFileSync(path.join(__dirname, '../_data/users.json'), 'utf-8')
);

// Import into DB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		await User.create(users);
		console.log('Data imported...');
		process.exit();
	} catch (error) {
		console.error(error);
	}
};

// Delete data
const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		await User.deleteMany();
		console.log('Data deleted...');
		process.exit();
	} catch (error) {
		console.error(error);
	}
};

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}
