// 📁 lib/db/mongodb.ts 파일 내용 (Global Type 확장 및 안정화)

import mongoose, { Mongoose } from 'mongoose'; 

// ⭐️ 1. 이 파일 내에서 global 객체의 타입을 직접 확장합니다.
// 이 코드는 global.d.ts 파일에 있는 내용과 동일하지만, 해당 파일이 로드되지 않을 경우를 대비합니다.
declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  }
}

// 2. 환경 변수 확인 (이전과 동일)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'MONGODB_URI 환경 변수가 .env.local에 정의되어 있지 않습니다.'
  );
}

// 3. 전역 변수에 연결 캐싱
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using existing DB connection.');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Creating new DB connection...');
    
    // MONGODB_URI! : string이 확실하다고 명시 (이전 문제 해결)
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