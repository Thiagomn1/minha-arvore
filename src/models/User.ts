import { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  cpf: string;
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Evita recompilar o modelo no hot reload (Next.js)
export default models.User || model<IUser>("User", UserSchema);
