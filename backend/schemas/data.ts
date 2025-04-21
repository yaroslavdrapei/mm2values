import mongoose from 'mongoose';

interface IData extends mongoose.Document {
  data: string;
}

const dataSchema = new mongoose.Schema<IData>({
  data: {
    type: String,
    required: true
  }
});

export const Data = mongoose.model<IData>('data', dataSchema);
