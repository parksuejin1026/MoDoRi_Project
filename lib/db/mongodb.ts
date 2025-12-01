// 📁 lib/db/mongodb.ts

import mongoose, { Document, Model, Schema, Types } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// 게시물 인터페이스
export interface IPostData {
  title: string;
  content: string;
  author: string;
  userId: string;
  userEmail: string;
  school?: string;
  category: '전체' | '질문' | '정보공유' | '자유';
  views: number;
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends IPostData, Document { }

// 댓글 인터페이스
export interface IComment extends Document {
  postId: Types.ObjectId;
  userId: string;
  author: string;
  content: string;
  school?: string;
  createdAt: Date;
}

// ⭐️ 채팅 세션 인터페이스
export interface IChatSession extends Document {
  userId: string;
  schoolCode: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// ⭐️ 채팅 메시지 인터페이스
export interface IChatMessage extends Document {
  sessionId: Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}


const PostSchema = new Schema<IPost>({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  userId: { type: String, required: true, index: true },
  userEmail: { type: String, required: true },
  school: { type: String, required: false },
  category: { type: String, required: true, default: '자유', enum: ['전체', '질문', '정보공유', '자유'] },
  views: { type: Number, default: 0 },
  likes: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true
});

// 댓글 스키마 정의
const CommentSchema = new Schema<IComment>({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  userId: { type: String, required: true, index: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  school: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

// ⭐️ 채팅 세션 스키마
const ChatSessionSchema = new Schema<IChatSession>({
  userId: { type: String, required: true, index: true },
  schoolCode: { type: String, required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ⭐️ 채팅 메시지 스키마
const ChatMessageSchema = new Schema<IChatMessage>({
  sessionId: { type: Schema.Types.ObjectId, ref: 'ChatSession', required: true, index: true },
  role: { type: String, required: true, enum: ['user', 'assistant'] },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// 모델 정의
const PostModel = (mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)) as Model<IPost>;
const CommentModel = (mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)) as Model<IComment>;
const ChatSessionModel = (mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', ChatSessionSchema)) as Model<IChatSession>;
const ChatMessageModel = (mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema)) as Model<IChatMessage>;


async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export { dbConnect as default, PostModel, CommentModel, ChatSessionModel, ChatMessageModel };