// 📁 models/Post.ts (오류 수정 및 안정화 버전)

'use client'; // Next.js 빌드 시 충돌 방지

import mongoose, { Schema, Model, Document, Types } from 'mongoose'; 
// ⭐️ mongoose import가 하나로 통합됨

// 1. 순수 데이터 타입을 정의합니다.
export interface IPostData {
    title: string;          
    content: string;        
    author: string;         
    views: number;          
}

// 2. Mongoose Document 타입을 정의합니다.
export interface IPost extends IPostData, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    // ...
}

// 3. Mongoose 스키마 정의
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

// 4. 모델 익스포트 (캐싱 로직)
const Post: Model<IPost> = mongoose.models.Post 
    ? (mongoose.models.Post as Model<IPost>) 
    : mongoose.model<IPost>('Post', PostSchema);

export default Post;