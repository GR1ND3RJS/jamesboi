import mongoose from 'mongoose';

const mongo = async ({ uri }: {uri: string}) => {
    try {
        await mongoose.connect(uri, {
            keepAlive: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }
}

export default mongo;