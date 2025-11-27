import { NextResponse } from 'next/server';
import { getAllUsers, updateUser } from '@/lib/google-sheet-auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { currentUserId, currentPassword, newUserId, newPassword, newName, school } = await req.json();

        if (!currentUserId) {
            return NextResponse.json({ error: '사용자 아이디가 필요합니다.' }, { status: 400 });
        }

        // 1. 전체 유저 목록 가져오기
        const users = await getAllUsers();
        const userIndex = users.findIndex(u => u.userid === currentUserId);
        const user = users[userIndex];

        // 2. 사용자 존재 여부 및 비밀번호 존재 여부 확인
        // ⭐️ [수정] !user.password 조건을 추가하여 비밀번호가 없는 경우(undefined)를 미리 차단합니다.
        // 이렇게 하면 아래 bcrypt.compare에서 user.password가 string임을 보장받습니다.
        if (!user || !user.password) {
            return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
        }

        // 3. 비밀번호가 전송된 경우에만 검증
        if (currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ error: '현재 비밀번호가 일치하지 않습니다.' }, { status: 401 });
            }
        }

        // 4. 아이디 변경 시 중복 체크
        if (newUserId && newUserId !== currentUserId) {
            const idExists = users.some(u => u.userid === newUserId);
            if (idExists) {
                return NextResponse.json({ error: '이미 사용 중인 아이디입니다.' }, { status: 409 });
            }
        }

        // 5. 업데이트할 데이터 준비
        let finalPassword = user.password;
        if (newPassword && newPassword.trim() !== '') {
            finalPassword = await bcrypt.hash(newPassword, 10);
        }

        const updatedData = {
            userid: newUserId || user.userid,
            password: finalPassword,
            name: newName || user.name,
            school: school || user.school,
            email: user.email // ⭐️ 이메일 유지
        };

        // 6. 구글 시트 업데이트 실행
        const success = await updateUser(currentUserId, updatedData);

        if (!success) {
            throw new Error('Sheet update failed');
        }

        return NextResponse.json({
            success: true,
            message: '회원 정보가 수정되었습니다.',
            user: {
                userid: updatedData.userid,
                name: updatedData.name,
                school: updatedData.school
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}