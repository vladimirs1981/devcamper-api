import { model, Model, ObjectId, Schema } from 'mongoose';

interface ICourse {
	title: string;
	description: string;
	weeks: string;
	tuition: number;
	minimumSkill: string;
	scholarshipAvailable?: boolean;
	createdAt?: Date;
	bootcamp: Schema.Types.ObjectId;
	user: Schema.Types.ObjectId;
}

interface Course extends Model<ICourse> {
	getAverageCost: (id: ObjectId) => any;
}

const CourseSchema = new Schema<ICourse, Course>({
	title: {
		type: String,
		trim: true,
		requred: [true, 'Please add a course title'],
	},
	description: {
		type: String,
		required: [true, 'Please add a course description'],
	},
	weeks: {
		type: String,
		required: [true, 'Please add number of weeks'],
	},
	tuition: {
		type: Number,
		required: [true, 'Please add a tuition cost'],
	},
	minimumSkill: {
		type: String,
		required: [true, 'Please add a minimum skill'],
		enum: ['beginner', 'intermediate', 'advanced'],
	},
	scholarshipAvailable: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	bootcamp: {
		type: Schema.Types.ObjectId,
		ref: 'Bootcamp',
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

// Define static method to get average of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampid) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampid },
		},
		{
			$group: {
				_id: '$bootcamp',
				averageCost: { $avg: '$tuition' },
			},
		},
	]);

	try {
		await (this as any).model('Bootcamp').findByIdAndUpdate(bootcampid, {
			averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
		});
	} catch (error) {
		console.error(error);
	}
};

// Call getAverageCost after save
CourseSchema.post('save', function () {
	(this.constructor as Course).getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre('remove', function () {
	(this.constructor as Course).getAverageCost(this.bootcamp);
});

export const Course = model<ICourse, Course>('Course', CourseSchema);
