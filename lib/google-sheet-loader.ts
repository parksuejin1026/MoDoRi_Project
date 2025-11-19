// 📁 lib/google-sheet-loader.ts (Google Sheets 데이터 로딩 유틸리티)

import { google } from 'googleapis';

const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SHEET_ID = process.env.GOOGLE_SHEETS_ID;

const sheets = google.sheets({ version: 'v4', auth: API_KEY });

// [기능 설명] 학교 코드를 Sheets에 저장된 실제 한글 탭 이름으로 매핑합니다.
function mapCodeToKoreanName(code: string): string {
    switch (code.toLowerCase()) {
        case 'dongyang':
            return '동양미래대학교';
        case 'hanyang':
            return '한양대학교';
        case 'seoultech':
            return '서울과학기술대학교'; 
        case 'ansan':
            return '안산대학교';
        case 'soonchunhyang': // ⭐️ 순천향대학교 추가
            return '순천향대학교';
        default:
            return '';
    }
}


export async function loadRuleDataFromSheet(schoolCode: string): Promise<string> { 
  if (!API_KEY || !SHEET_ID) {
    console.error("Google Sheets API Key or Sheet ID is missing.");
    return "Error: Sheets API 설정을 확인하세요.";
  }

  // 1. 학교 코드에서 정확한 한글 탭 이름을 얻습니다.
  const koreanName = mapCodeToKoreanName(schoolCode);

  if (!koreanName) {
      return `Error: 지원하지 않는 학교 코드(${schoolCode})입니다.`;
  }

  // 2. 탭 이름과 A1 셀을 결합하여 RANGE 문자열을 만듭니다.
  const range = `${koreanName}!A1`; 

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: range, 
    });

    const ruleText = response.data.values?.[0]?.[0];

    if (!ruleText || typeof ruleText !== 'string') {
        console.error(`Google Sheets에서 학칙 텍스트를 찾을 수 없거나 데이터가 비어 있습니다. (탭: ${koreanName})`);
        return `Error: 학칙 데이터 시트 (${koreanName} 탭 A1 셀)에 내용이 비어 있습니다.`;
    }

    return ruleText;
    
  } catch (error) {
    console.error(`Google Sheets API 호출 중 오류 발생 (RANGE: ${range}): ${error}`);
    return `Error: Sheets API 통신 오류 발생. (요청 범위: ${range}). 탭 이름, API 키, 공유 설정을 확인하세요.`;
  }
}