import mongoose from 'mongoose';

const userInterestSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    interests: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

export default mongoose.model('UserInterest', userInterestSchema);