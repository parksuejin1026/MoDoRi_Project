'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGlobalModal } from '@/components/GlobalModal'; // ⭐️ Import

const schools = [
    '동양미래대학교', '한양대학교',
    '서울과학기술대학교', '순천향대학교', '안산대학교',
];

export default function SignupPage() {
    const router = useRouter();
    const { showAlert } = useGlobalModal(); // ⭐️ Hook

    const [formData, setFormData] = useState({
        userid: '',
        password: '',
        passwordConfirm: '',
        name: '',
        school: '',
    });

    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'password') checkPasswordStrength(value);
    };

    const checkPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Za-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;
        setPasswordStrength(strength);
    };

    const validateForm = () => {
        if (!formData.userid || formData.userid.trim().length < 4) {
            showAlert('아이디는 4자 이상 입력해주세요.');
            return false;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[!@#$%^&*])|(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            showAlert('비밀번호는 8자 이상이어야 하며,\n영문/숫자/특수문자 중 2가지 이상을 포함해야 합니다.');
            return false;
        }

        if (formData.password !== formData.passwordConfirm) {
            showAlert('비밀번호가 일치하지 않습니다.');
            return false;
        }

        if (!formData.name.trim()) {
            showAlert('이름을 입력해주세요.');
            return false;
        }

        if (!formData.school) {
            showAlert('학교를 선택해주세요.');
            return false;
        }

        return true;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        // validateForm에서 이미 모달을 띄우므로 false만 체크
        if (!validateForm()) return;

        try {
            const { passwordConfirm, ...signupData } = formData;

            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData),
            });

            const data = await res.json();

            if (res.ok) {
                await showAlert('회원가입이 완료되었습니다!\n로그인 페이지로 이동합니다.', '환영합니다');
                router.push('/login');
            } else {
                await showAlert(data.error || '회원가입에 실패했습니다.', '가입 실패');
            }
        } catch (error) {
            await showAlert('서버 통신 중 오류가 발생했습니다.', '오류');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-blue-600 to-blue-700">
            <div className="w-full max-w-[360px] bg-white rounded-2xl p-8 shadow-xl my-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                        <BookOpen size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-blue-600 mb-1">회원가입</h1>
                    <p className="text-sm text-gray-500">룰룩과 함께 시작하세요</p>
                </div>

                <form onSubmit={handleSignup} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">아이디</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                            placeholder="4자 이상 입력하세요"
                            value={formData.userid}
                            onChange={(e) => handleInputChange('userid', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">비밀번호</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                            placeholder="8자 이상 (영문/숫자/특수문자 조합)"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                        />
                        {formData.password && (
                            <div className="flex gap-1 h-1 mt-1">
                                {[1, 2, 3, 4].map((level) => (
                                    <div
                                        key={level}
                                        className={`flex-1 rounded-full transition-colors ${passwordStrength >= level
                                                ? (passwordStrength < 3 ? 'bg-red-400' : passwordStrength === 3 ? 'bg-yellow-400' : 'bg-green-500')
                                                : 'bg-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">비밀번호 확인</label>
                        <input
                            type="password"
                            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none transition-all ${formData.passwordConfirm && formData.password !== formData.passwordConfirm
                                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                    : 'border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
                                }`}
                            placeholder="비밀번호를 한 번 더 입력하세요"
                            value={formData.passwordConfirm}
                            onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
                        />
                        {formData.passwordConfirm && (
                            formData.password === formData.passwordConfirm ? (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> 비밀번호가 일치합니다.
                                </p>
                            ) : (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle size={12} /> 비밀번호가 일치하지 않습니다.
                                </p>
                            )
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">이름</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                            placeholder="홍길동"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">학교</label>
                        <select
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                            value={formData.school}
                            onChange={(e) => handleInputChange('school', e.target.value)}
                        >
                            <option value="">학교를 선택하세요</option>
                            {schools.map((school) => (
                                <option key={school} value={school}>{school}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mt-4">
                        회원가입
                    </button>
                </form>

                <div className="text-center mt-6 text-sm text-gray-500">
                    이미 계정이 있으신가요? <Link href="/login" className="text-blue-600 font-semibold hover:underline hover:text-blue-700">로그인</Link>
                </div>
            </div>
        </div>
    );
}