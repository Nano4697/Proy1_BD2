import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    email: string;
    password: string;
    comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
});

//metodo que cifra el password de un nuevo usuario
userSchema.pre<IUser>("save", async function (next) {
    const self = this;
    if (!self.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(self.password, salt);
    self.password = hashedPassword;
    next();
});

//compara la contraseña ingresada con la guardada
userSchema.methods.comparePassword = async function (
    password: string
): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export default model<IUser>("User", userSchema);
