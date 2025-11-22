// 📁 app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/google-sheet-auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { userid, password } = await req.json();

        if (!userid || !password) {
            return NextResponse.json({ error: '아이디와 비밀번호를 입력해주세요.' }, { status: 400 });
        }

        // 1. 전체 유저 목록 가져오기 (시트 읽기)
        const users = await getAllUsers();

        // 2. 아이디 일치 사용자 찾기
        const user = users.find(u => u.userid === userid);

        if (!user || !user.password) {
            return NextResponse.json({ error: '존재하지 않는 아이디입니다.' }, { status: 401 });
        }

        // 3. 비밀번호 확인
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
        }

        // 4. 로그인 성공
        return NextResponse.json({
            success: true,
            user: {
                userid: user.userid,
                name: user.name,
                school: user.school
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}