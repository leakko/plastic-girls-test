import mongoose from 'mongoose';

if ( !process.env.MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

export const connectToMongoDB = async () => {
	if (mongoose.connection.readyState) return Promise.resolve(mongoose.connection);
	try {
		const { connection } = await mongoose.connect(process.env.MONGODB_URI as string);
		if (!connection.readyState) return Promise.reject('Connection to MongoDB failed');
		return Promise.resolve(connection);
	} catch {
		return Promise.reject('Connection to MongoDB failed');
	}
};