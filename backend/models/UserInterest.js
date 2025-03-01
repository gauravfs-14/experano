import mongoose from 'mongoose';

const userInterestSchema = new mongoose.Schema({
    uid: {
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