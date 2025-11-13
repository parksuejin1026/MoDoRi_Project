// 📁 lib/google-sheet-loader.ts (수정: 동적 RANGE 설정)

import { google } from 'googleapis';

const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
// RANGE 환경 변수는 더 이상 사용하지 않습니다.

const sheets = google.sheets({ version: 'v4', auth: API_KEY });

// ⭐️ 함수가 schoolCode를 받아 동적으로 탭 이름을 구성합니다.
export async function loadRuleDataFromSheet(schoolCode: string): Promise<string> { 
  if (!API_KEY || !SHEET_ID) {
    console.error("Google Sheets API Key or Sheet ID is missing.");
    return "Error: Sheets API 설정을 확인하세요.";
  }

  // ⭐️ 탭 이름과 A1 셀을 결합하여 RANGE 문자열을 만듭니다.
  // (예: schoolCode가 'dongyang'이면 'dongyang_Rule!A1' 탭을 가정)
  const schoolTabName = schoolCode.charAt(0).toUpperCase() + schoolCode.slice(1) + '_Rule';
  const range = `${schoolTabName}!A1`; // 탭 이름 + A1 셀

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: range, // ⭐️ 동적으로 생성된 RANGE 사용
    });

    const ruleText = response.data.values?.[0]?.[0];

    if (!ruleText || typeof ruleText !== 'string') {
        console.error(`Google Sheets에서 학칙 텍스트를 찾을 수 없거나 데이터가 비어 있습니다. (탭: ${schoolTabName})`);
        return `Error: ${schoolTabName} 탭의 데이터가 비어 있습니다.`;
    }

    return ruleText;
    
  } catch (error) {
    console.error("Google Sheets API 호출 중 오류 발생:", error);
    return "Error: Google Sheets 데이터 로드 중 통신 오류가 발생했습니다. (API 키, ID, 공유 설정 확인)";
  }
}