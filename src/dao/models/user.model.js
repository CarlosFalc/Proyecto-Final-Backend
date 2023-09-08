import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name:{type: String, required: true},
    last_name: {type: String, required: false},
    email: {type: String, required: true, unique: true},
    age: {type: Number, required: false},
    password: {type: String, required: true},
    cart:{type: mongoose.Schema.Types.ObjectId, ref: "carts"},
    role: {type: String, enum:["user", "admin", "premium"], default: "user", required: true},
    documents:{type: [
        {
            name:{type: String, required: true},
            reference:{type: String, required: true}
        }
        ], default: []
        },
    last_connection:{type: Date, default: null},
    status: {type: String, enum:["incompleto", "completo", "pendiente"], required: true, default: "pendiente"},
    avatar: {type: String, default: ""}
});

export const userModel = mongoose.model(userCollection,userSchema);