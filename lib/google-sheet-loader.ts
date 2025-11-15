// 📁 lib/google-sheet-loader.ts (안정화 버전)

import { google } from 'googleapis';

// --- [필수 환경 변수 설정] ---
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
// -----------------------------

// ⭐️ 챗봇이 허용하는 학교 코드와 Google Sheets의 실제 탭 이름을 1:1로 매핑합니다.
//    (실제 시트 탭 이름과 대소문자까지 정확히 일치해야 합니다.)
const SCHOOL_TAB_MAP: { [key: string]: string } = {
    'dongyang': '동양미래대학교', // 예시: 학교 코드가 'dongyang'이면 시트 탭 이름은 'Dongyang_Rule'
    'hanyang': '한양대학교',   // 예시: 다른 학교 코드가 있다면 여기에 추가
    // 필요한 모든 학교 코드를 추가해주세요.
};

const sheets = google.sheets({ version: 'v4', auth: API_KEY });

/**
 * schoolCode를 받아 동적으로 Google Sheets에서 해당 학교의 학칙 데이터를 불러옵니다.
 * @param schoolCode URL에서 넘어오는 학교 코드 (예: 'dongyang')
 * @returns 학칙 원문 텍스트 또는 오류 메시지
 */
export async function loadRuleDataFromSheet(schoolCode: string): Promise<string> {
    
    // 1. 필수 환경 변수 및 학교 코드 유효성 검사
    if (!API_KEY || !SHEET_ID) {
        console.error("Google Sheets API Key 또는 Sheet ID가 누락되었습니다.");
        return "Error: Sheets API 설정을 확인하세요.";
    }

    const schoolTabName = SCHOOL_TAB_MAP[schoolCode];
    
    if (!schoolTabName) {
        console.error(`정의되지 않거나 매핑되지 않은 학교 코드입니다: ${schoolCode}`);
        return `Error: 정의되지 않거나 매핑되지 않은 학교 코드입니다: ${schoolCode}`;
    }

    // 2. 동적 RANGE 설정 (예: 'Dongyang_Rule!A1')
    const range = `${schoolTabName}!A1`;

    try {
        // 3. Google Sheets API 호출
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: range,
        });

        // A1 셀의 데이터를 추출합니다.
        const ruleText = response.data.values?.[0]?.[0];

        if (!ruleText || typeof ruleText !== 'string') {
            console.error(`Google Sheets에서 학칙 텍스트를 찾을 수 없거나 데이터가 비어 있습니다. (탭: ${schoolTabName})`);
            return `Error: ${schoolTabName} 탭의 A1 셀 데이터가 비어 있거나 올바르지 않습니다.`;
        }

        return ruleText;

    } catch (error) {
        console.error("Google Sheets API 호출 중 오류 발생:", error);
        // API 키 권한 또는 시트 공유 설정 오류일 가능성이 높습니다.
        return "Error: Google Sheets 데이터 로드 중 통신 오류가 발생했습니다. (API 키, ID, 시트 공유 설정 확인)";
    }
}