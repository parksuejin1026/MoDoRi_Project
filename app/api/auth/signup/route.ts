// 📁 app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { getAllUsers, addUserToSheet } from '@/lib/google-sheet-auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        // ⭐️ email 필드 추가
        const { userid, password, name, school, email } = await req.json();

        if (!userid || !password || !name || !school || !email) {
            return NextResponse.json({ error: '모든 항목(이메일 포함)을 입력해주세요.' }, { status: 400 });
        }

        // 1. 중복 아이디 체크
        const users = await getAllUsers();
        const existingUser = users.find(u => u.userid === userid);

        if (existingUser) {
            return NextResponse.json({ error: '이미 사용 중인 아이디입니다.' }, { status: 409 });
        }

        // 2. 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. 구글 시트에 추가 (email 포함)
        const success = await addUserToSheet({
            userid,
            password: hashedPassword,
            name,
            school,
            email
        });

        if (!success) {
            throw new Error('Sheet append failed');
        }

        return NextResponse.json({ success: true, message: '회원가입 성공' }, { status: 201 });

    } catch (error) {
        console.error('Signup Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}