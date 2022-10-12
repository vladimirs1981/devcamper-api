import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema({
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
});

// Define static method to get average of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampid) {
	console.log('Calculating average cost...');

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
	(this.constructor as any).getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre('remove', function () {
	(this.constructor as any).getAverageCost(this.bootcamp);
});

export default mongoose.model('Course', CourseSchema);
