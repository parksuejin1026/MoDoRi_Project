// 📁 lib/google-sheet-auth.ts
import { google } from 'googleapis';
import bcrypt from 'bcryptjs';

// 환경 변수 로드
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const SHEET_ID = process.env.GOOGLE_SHEETS_ID_USERS;

// 인증 객체 생성
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export interface UserData {
    userid: string;
    password?: string;
    name: string;
    school: string;
    email: string; // ⭐️ 추가
}

// 1. 모든 회원 정보 가져오기 (범위 확장 A~H)
// A: ID, B: PW, C: Name, D: School, E: Date, F: Email, G: AuthCode, H: AuthExpire
export async function getAllUsers(): Promise<UserData[]> {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Users!A2:F', // F열(이메일)까지 가져옴
        });

        const rows = response.data.values || [];

        return rows.map((row) => ({
            userid: row[0],
            password: row[1],
            name: row[2],
            school: row[3],
            email: row[5] || '', // F열
        }));
    } catch (error) {
        console.error('구글 시트 회원 목록 로드 실패:', error);
        return [];
    }
}

// 2. 회원 정보 추가하기 (이메일 포함)
export async function addUserToSheet(user: UserData): Promise<boolean> {
    try {
        const timestamp = new Date().toISOString();

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'Users!A:F',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                // ID, PW, Name, School, Date, Email
                values: [[user.userid, user.password, user.name, user.school, timestamp, user.email]],
            },
        });
        return true;
    } catch (error) {
        console.error('구글 시트 회원 추가 실패:', error);
        return false;
    }
}

// 3. 회원 정보 수정하기 (기존 유지)
export async function updateUser(originalUserId: string, updatedUser: UserData): Promise<boolean> {
    try {
        const rows = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Users!A2:A',
        });

        const userIds = rows.data.values?.flat() || [];
        const rowIndex = userIds.findIndex((id) => id === originalUserId);

        if (rowIndex === -1) return false;

        const sheetRowNumber = rowIndex + 2;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `Users!A${sheetRowNumber}:D${sheetRowNumber}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[updatedUser.userid, updatedUser.password, updatedUser.name, updatedUser.school]],
            },
        });

        return true;
    } catch (error) {
        console.error('구글 시트 회원 수정 실패:', error);
        return false;
    }
}

// 4. 회원 삭제하기 (기존 유지)
export async function deleteUser(userid: string): Promise<boolean> {
    try {
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: SHEET_ID
        });
        const sheet = spreadsheet.data.sheets?.find(s => s.properties?.title === 'Users');
        const sheetId = sheet?.properties?.sheetId;

        if (sheetId === undefined) return false;

        const rows = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Users!A2:A',
        });

        const userIds = rows.data.values?.flat() || [];
        const rowIndex = userIds.findIndex((id) => id === userid);

        if (rowIndex === -1) return false;

        const startIndex = rowIndex + 1;
        const endIndex = startIndex + 1;

        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SHEET_ID,
            requestBody: {
                requests: [{
                    deleteDimension: {
                        range: {
                            sheetId: sheetId,
                            dimension: "ROWS",
                            startIndex: startIndex,
                            endIndex: endIndex
                        }
                    }
                }]
            }
        });

        return true;
    } catch (error) {
        console.error('구글 시트 회원 삭제 실패:', error);
        return false;
    }
}

// ⭐️ 5. 인증 코드 저장 (G열: 코드, H열: 만료시간)
export async function saveVerificationCode(userid: string, code: string): Promise<boolean> {
    try {
        const rows = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Users!A2:A',
        });

        const userIds = rows.data.values?.flat() || [];
        const rowIndex = userIds.findIndex((id) => id === userid);

        if (rowIndex === -1) return false;

        const sheetRowNumber = rowIndex + 2;
        // 5분 후 만료
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `Users!G${sheetRowNumber}:H${sheetRowNumber}`, // G, H열 사용
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[code, expiresAt]],
            },
        });

        return true;
    } catch (error) {
        console.error('인증 코드 저장 실패:', error);
        return false;
    }
}

// ⭐️ 6. 코드 검증 및 비밀번호 재설정
export async function verifyCodeAndResetPassword(userid: string, code: string, newPasswordRaw: string): Promise<{ success: boolean, message: string }> {
    try {
        // 1. 유저 위치 찾기
        const rows = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Users!A2:H', // H열까지 읽음
        });

        const allData = rows.data.values || [];
        const rowIndex = allData.findIndex((row) => row[0] === userid);

        if (rowIndex === -1) return { success: false, message: '사용자를 찾을 수 없습니다.' };

        const userRow = allData[rowIndex];
        const savedCode = userRow[6]; // G열
        const expiresAt = userRow[7]; // H열

        // 2. 코드 및 만료시간 검증
        if (!savedCode || !expiresAt) {
            return { success: false, message: '인증 요청 내역이 없습니다.' };
        }

        if (String(savedCode).trim() !== String(code).trim()) {
            return { success: false, message: '인증 코드가 일치하지 않습니다.' };
        }

        if (new Date() > new Date(expiresAt)) {
            return { success: false, message: '인증 코드가 만료되었습니다. 다시 요청해주세요.' };
        }

        // 3. 비밀번호 변경 및 인증코드 초기화
        const sheetRowNumber = rowIndex + 2;
        const hashedPassword = await bcrypt.hash(newPasswordRaw, 10);

        // B열(비밀번호) 업데이트, G,H열(인증정보) 삭제
        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: SHEET_ID,
            requestBody: {
                data: [
                    {
                        range: `Users!B${sheetRowNumber}`,
                        values: [[hashedPassword]]
                    },
                    {
                        range: `Users!G${sheetRowNumber}:H${sheetRowNumber}`,
                        values: [['', '']] // 초기화
                    }
                ],
                valueInputOption: 'USER_ENTERED'
            }
        });

        return { success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };

    } catch (error) {
        console.error('비밀번호 재설정 실패:', error);
        return { success: false, message: '서버 오류가 발생했습니다.' };
    }
}