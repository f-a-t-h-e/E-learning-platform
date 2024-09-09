import { Document, Types } from "mongoose";

export type ExtractInterface<T> = Omit<T, keyof Document> & {
    _id: string | Types.ObjectId;
  }