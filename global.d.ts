// 📁 global.d.ts 파일 내용 (프로젝트 최상위)

import { Mongoose } from 'mongoose';

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  }
}