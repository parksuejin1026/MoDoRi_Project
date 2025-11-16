// 📁 lib/db/mongodb.ts (최종 통합 버전)

import mongoose, { Mongoose, Schema, Model, Document, Types } from 'mongoose'; 
// import '@/models/Post'; // 👈 이 줄은 제거합니다.

// ⭐️ Post 모델 정의를 이 파일 내부에 직접 통합합니다.
// 1. 순수 데이터 타입 정의 (IPostData, IPost)
export interface IPostData {
    title: string;          
    content: string;        
    author: string;         
    views: number;          
}

export interface IPost extends IPostData, Document {
    _id: Types.ObjectId;
    createdAt: Date;
}

// 2. Mongoose 스키마 정의
const PostSchema: Schema = new Schema({
    title: { type: String, required: [true, '제목을 입력해야 합니다.'], trim: true },
    content: { type: String, required: [true, '내용을 입력해야 합니다.'] },
    author: { type: String, required: [true, '작성자 정보가 누락되었습니다.'] },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: false, 
    toJSON: { virtuals: true },
});

// 3. 모델 정의 및 익스포트
export const PostModel: Model<IPost> = mongoose.models.Post 
    ? (mongoose.models.Post as Model<IPost>) 
    : mongoose.model<IPost>('Post', PostSchema);


// ⭐️ 4. DB 연결 로직 (이하 동일)
declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'MONGODB_URI 환경 변수가 .env.local에 정의되어 있지 않습니다.'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // ... (dbConnect 함수 내용 유지) ...
  if (cached.conn) {
    console.log('Using existing DB connection.');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Creating new DB connection...');
    
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('DB connection established successfully.');
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e; 
  }
}

export default dbConnect;