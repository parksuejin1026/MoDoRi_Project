'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash, X, MapPin, Clock, Calendar } from 'lucide-react';

interface Course {
    id: string;
    name: string;
    day: string; // '월', '화', '수', '목', '금'
    startTime: number; // 9 ~ 18
    endTime: number; // 9 ~ 18
    location: string;
    color: string;
}

const DAYS = ['월', '화', '수', '목', '금'];
const TIMES = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const COLORS = ['bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-green-100', 'bg-blue-100', 'bg-indigo-100', 'bg-purple-100', 'bg-pink-100'];

export default function TimetablePage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // 상세 모달 상태
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // 삭제 확인 모달 상태

    // 새 수업 입력 상태
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseDay, setNewCourseDay] = useState('월');
    const [newCourseStart, setNewCourseStart] = useState(9);
    const [newCourseEnd, setNewCourseEnd] = useState(10);
    const [newCourseLocation, setNewCourseLocation] = useState('');

    // 사용자 ID 로드 및 시간표 데이터 조회
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedId = localStorage.getItem('userId');
            if (storedId) {
                setCurrentUserId(storedId);
                fetchTimetable(storedId);
            }
        }
    }, []);

    const fetchTimetable = async (userId: string) => {
        try {
            const response = await fetch(`/api/timetable?userId=${userId}`);
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setCourses(result.data);
                }
            }
        } catch (error) {
            console.error('시간표 로딩 실패:', error);
        }
    };

    const saveTimetable = async (updatedCourses: Course[]) => {
        if (!currentUserId) return;

        try {
            await fetch('/api/timetable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUserId,
                    courses: updatedCourses
                }),
            });
        } catch (error) {
            console.error('시간표 저장 실패:', error);
            alert('시간표 저장 중 오류가 발생했습니다.');
        }
    };

    const handleAddCourse = async () => {
        if (!newCourseName) return;

        const newCourse: Course = {
            id: Date.now().toString(),
            name: newCourseName,
            day: newCourseDay,
            startTime: Number(newCourseStart),
            endTime: Number(newCourseEnd),
            location: newCourseLocation,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };

        const updatedCourses = [...courses, newCourse];
        setCourses(updatedCourses);
        await saveTimetable(updatedCourses);

        setIsModalOpen(false);
        resetForm();
    };

    const handleDeleteCourse = async () => {
        if (!selectedCourse) return;

        const updatedCourses = courses.filter(c => c.id !== selectedCourse.id);
        setCourses(updatedCourses);
        await saveTimetable(updatedCourses);
        setIsDeleteConfirmOpen(false);
        setIsDetailModalOpen(false);
    };

    const handleCourseClick = (course: Course) => {
        setSelectedCourse(course);
        setIsDetailModalOpen(true);
    };

    const resetForm = () => {
        setNewCourseName('');
        setNewCourseDay('월');
        setNewCourseStart(9);
        setNewCourseEnd(10);
        setNewCourseLocation('');
    };

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            {/* 헤더 */}
            <div className="p-6 pb-4 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">시간표</h2>
                    <p className="text-sm text-muted-foreground">이번 학기 시간표를 관리하세요.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* 시간표 그리드 */}
            <div className="flex-1 overflow-y-auto p-4 pb-24">
                <div className="grid grid-cols-6 gap-1 border border-border rounded-xl overflow-hidden bg-card">
                    {/* 헤더 (요일) */}
                    <div className="bg-muted p-2 text-center text-xs font-medium text-muted-foreground border-b border-r border-border"></div>
                    {DAYS.map(day => (
                        <div key={day} className="bg-muted p-2 text-center text-sm font-bold text-foreground border-b border-border">
                            {day}
                        </div>
                    ))}

                    {/* 시간 슬롯 */}
                    {TIMES.map(time => (
                        <>
                            {/* 시간 표시 */}
                            <div key={`time-${time}`} className="bg-muted p-2 text-center text-xs text-muted-foreground border-r border-border h-16 flex items-start justify-center pt-1">
                                {time}:00
                            </div>

                            {/* 요일별 셀 */}
                            {DAYS.map(day => {
                                // 해당 시간/요일에 수업이 있는지 확인
                                const course = courses.find(c =>
                                    c.day === day && c.startTime <= time && c.endTime > time
                                );

                                // 수업 시작 시간인 경우에만 렌더링 (rowspan 효과)
                                if (course && course.startTime === time) {
                                    const duration = course.endTime - course.startTime;
                                    return (
                                        <div
                                            key={`${day}-${time}`}
                                            className={`p-1 relative z-10`}
                                            style={{ gridRow: `span ${duration}` }}
                                        >
                                            <div className={`w-full h-full rounded-lg p-2 text-xs flex flex-col justify-between ${course.color} border border-black/5 shadow-sm cursor-pointer hover:opacity-90 transition-opacity`}
                                                onClick={() => handleCourseClick(course)}
                                            >
                                                <div>
                                                    <p className="font-bold text-gray-800 line-clamp-2">{course.name}</p>
                                                    <p className="text-gray-600 mt-1">{course.location}</p>
                                                </div>
                                                <p className="text-gray-500 text-[10px] self-end">{course.startTime}:00 - {course.endTime}:00</p>
                                            </div>
                                        </div>
                                    );
                                } else if (course) {
                                    // 수업 중인 시간은 렌더링 하지 않음 (위에서 span으로 처리)
                                    return null;
                                } else {
                                    // 빈 셀
                                    return (
                                        <div key={`${day}-${time}`} className="border-b border-r border-border/50 h-16"></div>
                                    );
                                }
                            })}
                        </>
                    ))}
                </div>
            </div>

            {/* 수업 추가 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-border flex justify-between items-center">
                            <h3 className="font-bold text-lg">수업 추가</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">과목명</label>
                                <input
                                    type="text"
                                    value={newCourseName}
                                    onChange={(e) => setNewCourseName(e.target.value)}
                                    className="w-full p-2 border border-border rounded-lg bg-background"
                                    placeholder="예: 컴퓨터구조"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">요일</label>
                                    <select
                                        value={newCourseDay}
                                        onChange={(e) => setNewCourseDay(e.target.value)}
                                        className="w-full p-2 border border-border rounded-lg bg-background"
                                    >
                                        {DAYS.map(day => <option key={day} value={day}>{day}요일</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">강의실</label>
                                    <input
                                        type="text"
                                        value={newCourseLocation}
                                        onChange={(e) => setNewCourseLocation(e.target.value)}
                                        className="w-full p-2 border border-border rounded-lg bg-background"
                                        placeholder="예: 301호"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">시작 시간</label>
                                    <select
                                        value={newCourseStart}
                                        onChange={(e) => setNewCourseStart(Number(e.target.value))}
                                        className="w-full p-2 border border-border rounded-lg bg-background"
                                    >
                                        {TIMES.map(t => <option key={t} value={t}>{t}:00</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">종료 시간</label>
                                    <select
                                        value={newCourseEnd}
                                        onChange={(e) => setNewCourseEnd(Number(e.target.value))}
                                        className="w-full p-2 border border-border rounded-lg bg-background"
                                    >
                                        {TIMES.filter(t => t > newCourseStart).map(t => <option key={t} value={t}>{t}:00</option>)}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleAddCourse}
                                disabled={!newCourseName}
                                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl mt-2 hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                추가하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 수업 상세 모달 */}
            {isDetailModalOpen && selectedCourse && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className={`p-6 ${selectedCourse.color} relative`}>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="absolute top-4 right-4 text-black/50 hover:text-black transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="font-bold text-2xl text-gray-900 mb-1">{selectedCourse.name}</h3>
                            <p className="text-gray-700 font-medium">{selectedCourse.location}</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 text-foreground">
                                <Calendar className="text-muted-foreground" size={20} />
                                <span className="font-medium">{selectedCourse.day}요일</span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground">
                                <Clock className="text-muted-foreground" size={20} />
                                <span className="font-medium">{selectedCourse.startTime}:00 - {selectedCourse.endTime}:00</span>
                            </div>
                            <div className="flex items-center gap-3 text-foreground">
                                <MapPin className="text-muted-foreground" size={20} />
                                <span className="font-medium">{selectedCourse.location || '강의실 정보 없음'}</span>
                            </div>

                            <div className="pt-4 mt-4 border-t border-border">
                                <button
                                    onClick={() => setIsDeleteConfirmOpen(true)}
                                    className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash size={18} />
                                    수업 삭제하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 삭제 확인 모달 */}
            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-xs rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="font-bold text-lg text-center mb-2">수업 삭제</h3>
                        <p className="text-center text-muted-foreground mb-6">
                            정말로 이 수업을 삭제하시겠습니까?<br />
                            삭제된 내용은 복구할 수 없습니다.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                className="flex-1 py-3 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleDeleteCourse}
                                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
