// 📁 lib/google-sheet-loader.ts
import { google } from 'googleapis';

// 1. 환경 변수 로드
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const SHEET_ID = process.env.GOOGLE_SHEETS_ID_RULES;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

function mapCodeToKoreanName(code: string): string {
  switch (code.toLowerCase()) {
    case 'dongyang': return '동양미래대학교';
    case 'hanyang': return '한양대학교';
    case 'seoultech': return '서울과학기술대학교';
    case 'ansan': return '안산대학교';
    case 'soonchunhyang': return '순천향대학교';
    default: return '';
  }
}

interface CacheEntry {
  data: string;
  timestamp: number;
}
const CACHE_TTL = 60 * 60 * 1000;
const ruleCache = new Map<string, CacheEntry>();

export async function loadRuleDataFromSheet(schoolCode: string): Promise<string> {
  // 🚨 ID가 없으면 아예 실행하지 않고 에러 반환
  if (!SHEET_ID) {
    console.error("❌ [Critical] GOOGLE_SHEET_ID_RULES 환경 변수가 없습니다.");
    return "Error: 서버 설정 오류(학칙 시트 ID 누락). 관리자에게 문의하세요.";
  }

  const koreanName = mapCodeToKoreanName(schoolCode);

  if (!koreanName) {
    return `Error: 지원하지 않는 학교 코드(${schoolCode})입니다.`;
  }

  const now = Date.now();
  const cachedEntry = ruleCache.get(schoolCode);
  if (cachedEntry && (now - cachedEntry.timestamp < CACHE_TTL)) {
    console.log(`[Cache Hit] ${koreanName} 학칙 데이터를 캐시에서 불러옵니다.`);
    return cachedEntry.data;
  }

  console.log(`[Cache Miss] ${koreanName} 학칙 데이터를 Google Sheets에서 새로 가져옵니다.`);

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${koreanName}!A1`,
    });

    const ruleText = response.data.values?.[0]?.[0];

    if (!ruleText || typeof ruleText !== 'string') {
      console.error(`[Loader Error] ${koreanName} 탭의 A1 셀이 비어있거나 데이터를 읽을 수 없습니다.`);
      return `Error: 학칙 데이터 시트 (${koreanName} 탭 A1 셀)에 내용이 비어 있습니다.`;
    }

    ruleCache.set(schoolCode, { data: ruleText, timestamp: now });
    return ruleText;

  } catch (error) {
    console.error(`Google Sheets API 호출 중 오류 발생 (${koreanName}):`, error);
    return `Error: 학칙 데이터를 불러오는데 실패했습니다. (구글 시트 권한, 시트 ID, 탭 이름을 확인하세요)`;
  }
}