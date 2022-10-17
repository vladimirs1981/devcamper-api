import { Model, ObjectId, Schema } from 'mongoose';
import mongoose from 'mongoose';

interface IRating {
	title: string;
	text: string;
	rating: number;
	createdAt?: Date;
	bootcamp: Schema.Types.ObjectId;
	user: Schema.Types.ObjectId;
}

interface Rating extends Model<IRating> {
	getAverageRating: (id: ObjectId) => any;
}

// const ReviewSchema = new Schema<ICourse, Course>({

const ReviewSchema = new Schema<IRating, Rating>({
	title: {
		type: String,
		trim: true,
		requred: [true, 'Please add a title for the review'],
		maxlength: 100,
	},
	text: {
		type: String,
		required: [true, 'Please add some text'],
	},
	rating: {
		type: Number,
		min: 1,
		max: 10,
		required: [true, 'Please add a rating between 1 and 10'],
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

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Define static method to get average rating and save
ReviewSchema.statics.getAverageRating = async function (bootcampid) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampid },
		},
		{
			$group: {
				_id: '$bootcamp',
				averageRating: { $avg: '$rating' },
			},
		},
	]);

	try {
		await (this as any).model('Bootcamp').findByIdAndUpdate(bootcampid, {
			averageRating: obj[0].averageRating,
		});
	} catch (error) {
		console.error(error);
	}
};

// Call getAverageCost after save
ReviewSchema.post('save', function () {
	(this.constructor as Rating).getAverageRating(this.bootcamp);
});

// Call getAverageCost before remove
ReviewSchema.pre('remove', function () {
	(this.constructor as Rating).getAverageRating(this.bootcamp);
});

// export const Course = model<ICourse, Course>('Course', CourseSchema);
export default mongoose.model<IRating, Rating>('Review', ReviewSchema);
