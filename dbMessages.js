import mongoose from "mongoose";

const messageAppSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    recieved: Boolean,
});

//Collection
export default mongoose.model('messageContents', messageAppSchema);