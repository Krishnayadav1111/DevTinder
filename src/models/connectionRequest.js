const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // reference to User model
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        required: true,
        enum: ['ignored', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is not supported`
    },
}, {
    timestamps: true

});
// Ensure a user cannot send multiple requests to the same user

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre('save', async function () {
    console.log('ConnectionRequest about to be saved:', this);
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("fromUserId and toUserId cannot be the same");
    }
});

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);