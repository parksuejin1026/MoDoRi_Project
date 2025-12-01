import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // 587 포트 사용 시 false (TLS 사용)
  auth: {
    user: process.env.EMAIL_USER, // .env의 EMAIL_USER 사용
    pass: process.env.EMAIL_PASS, // .env의 EMAIL_PASS 사용
  },
});

export async function sendVerificationEmail(to: string, code: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER, // 보내는 사람도 설정한 이메일로 지정
    to,
    subject: '[UniMate] 비밀번호 재설정 인증코드',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2563eb;">비밀번호 재설정 인증</h2>
        <p>안녕하세요, UniMate 입니다.</p>
        <p>비밀번호 재설정을 위해 아래 인증코드를 입력해주세요.</p>
        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 8px; margin: 20px 0;">
          ${code}
        </div>
        <p style="color: #666; font-size: 12px;">이 코드는 5분간 유효합니다.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}