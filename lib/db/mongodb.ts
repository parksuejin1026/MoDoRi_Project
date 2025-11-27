// 📁 lib/db/mongodb.ts

import mongoose, { Document, Model, Schema, Types } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// 게시물 인터페이스에 userId, userEmail, category, likes, school 추가
export interface IPostData {
  title: string;
  content: string;
  author: string;
  userId: string; // 작성자 고유 ID
  userEmail: string; // 작성자 이메일 (권한 확인용)
  school?: string; // ⭐️ 추가: 작성자 학교 (기존 데이터 호환을 위해 optional)
  category: '전체' | '질문' | '정보공유' | '자유'; // 카테고리
  views: number;
  likes: string[]; // 좋아요를 누른 사용자 ID 목록
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends IPostData, Document { }

// 댓글 인터페이스 (답글 기능 구현을 위해 추가)
export interface IComment extends Document {
  postId: Types.ObjectId;
  userId: string;
  author: string;
  content: string;
  school?: string; // ⭐️ 추가: 작성자 학교
  createdAt: Date;
}


const PostSchema = new Schema<IPost>({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  userId: { type: String, required: true, index: true },
  userEmail: { type: String, required: true },
  school: { type: String, required: false }, // ⭐️ 학교 필드 추가
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
  school: { type: String, required: false }, // ⭐️ 학교 필드 추가
  createdAt: { type: Date, default: Date.now },
});


let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// 모델 정의
const PostModel = (mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)) as Model<IPost>;
const CommentModel = (mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)) as Model<IComment>;


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

export { dbConnect as default, PostModel, CommentModel };