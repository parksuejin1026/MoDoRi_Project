import { NextResponse } from 'next/server';
import { getAllUsers, deleteUser } from '@/lib/google-sheet-auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { userid, password } = await req.json();

        if (!userid || !password) {
            return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
        }

        // 1. 유저 찾기
        const users = await getAllUsers();
        const user = users.find(u => u.userid === userid);

        if (!user || !user.password) {
            return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
        }

        // 2. 비밀번호 확인
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
        }

        // 3. 구글 시트에서 삭제
        const success = await deleteUser(userid);

        if (!success) {
            throw new Error('Sheet delete failed');
        }

        return NextResponse.json({ success: true, message: '계정이 삭제되었습니다.' }, { status: 200 });

    } catch (error) {
        console.error('Delete Account Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}