import { NextResponse } from 'next/server';
import { verifyCodeAndResetPassword } from '@/lib/google-sheet-auth';

export async function POST(req: Request) {
    try {
        const { userid, code, newPassword } = await req.json();

        if (!userid || !code || !newPassword) {
            return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
        }

        // 비밀번호 검증 및 변경
        const result = await verifyCodeAndResetPassword(userid, code, newPassword);

        if (result.success) {
            return NextResponse.json({ success: true, message: result.message });
        } else {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }

    } catch (error) {
        console.error('Password Reset Verify Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}