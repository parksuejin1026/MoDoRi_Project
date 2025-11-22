// 📁 lib/google-sheet-auth.ts
import { google } from 'googleapis';

// 환경 변수 로드
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// ⭐️ [중요] 회원 정보 전용 시트 ID 사용
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
}

// 1. 모든 회원 정보 가져오기
export async function getAllUsers(): Promise<UserData[]> {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Users!A2:E',
        });

        const rows = response.data.values || [];

        return rows.map((row) => ({
            userid: row[0],
            password: row[1],
            name: row[2],
            school: row[3],
        }));
    } catch (error) {
        console.error('구글 시트 회원 목록 로드 실패:', error);
        return [];
    }
}

// 2. 회원 정보 추가하기
export async function addUserToSheet(user: UserData): Promise<boolean> {
    try {
        const timestamp = new Date().toISOString();

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'Users!A:E',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[user.userid, user.password, user.name, user.school, timestamp]],
            },
        });
        return true;
    } catch (error) {
        console.error('구글 시트 회원 추가 실패:', error);
        return false;
    }
}

// 3. 회원 정보 수정하기
export async function updateUser(originalUserId: string, updatedUser: UserData): Promise<boolean> {
    try {
        const rows = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Users!A2:A', // 아이디 컬럼만 조회
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

// 4. 회원 삭제하기
export async function deleteUser(userid: string): Promise<boolean> {
    try {
        // 'Users' 시트의 ID(sheetId) 찾기
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: SHEET_ID
        });
        const sheet = spreadsheet.data.sheets?.find(s => s.properties?.title === 'Users');
        const sheetId = sheet?.properties?.sheetId;

        if (sheetId === undefined) {
            console.error("'Users' 시트를 찾을 수 없습니다.");
            return false;
        }

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