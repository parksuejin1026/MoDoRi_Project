import { NextResponse } from 'next/server';
import { getAllUsers, saveVerificationCode } from '@/lib/google-sheet-auth';
import { sendVerificationEmail } from '@/lib/nodemailer';

export async function POST(req: Request) {
    try {
        const { userid, email } = await req.json();

        if (!userid || !email) {
            return NextResponse.json({ error: '아이디와 이메일을 입력해주세요.' }, { status: 400 });
        }

        // 1. 사용자 확인
        const users = await getAllUsers();
        const user = users.find(u => u.userid === userid);

        if (!user) {
            return NextResponse.json({ error: '존재하지 않는 아이디입니다.' }, { status: 404 });
        }

        // 2. 이메일 일치 확인
        if (user.email !== email) {
            return NextResponse.json({ error: '등록된 이메일과 일치하지 않습니다.' }, { status: 400 });
        }

        // 3. 인증코드 생성 (6자리 숫자)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 4. 시트에 저장
        const saveSuccess = await saveVerificationCode(userid, verificationCode);
        if (!saveSuccess) {
            throw new Error('Failed to save verification code');
        }

        // 5. 이메일 발송
        await sendVerificationEmail(email, verificationCode);

        return NextResponse.json({ success: true, message: '인증코드가 발송되었습니다.' });

    } catch (error) {
        console.error('Password Reset Request Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}