
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { COURSE_GENERAL, UNIT_1_DATA, UNIT_2_DATA, UNIT_3_DATA, UNIT_4_DATA, UNIT_5_DATA, UNITS } from './constants';
import { AppState, SubTab, UnitData, Question, GlossaryTerm } from './types';
import { GlossaryTable } from './components/GlossaryTable';
import { QuestionCard } from './components/QuestionCard';
import { generateUnitContent, generateGlossaryTerms } from './services/geminiService';

declare global {
  // Define AIStudio interface to ensure identical modifiers and matching types across global scope
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [activeUnit, setActiveUnit] = useState<UnitData | null>(null);
  const [subTab, setSubTab] = useState<SubTab>('INFO');
  const [dynamicQuestions, setDynamicQuestions] = useState<Record<number, Question[]>>({});
  const [dynamicGlossary, setDynamicGlossary] = useState<Record<number, GlossaryTerm[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [visibleAnalyses, setVisibleAnalyses] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasAiKey, setHasAiKey] = useState<boolean>(false);

  // Quiz States
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    checkApiKeyStatus();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const checkApiKeyStatus = async () => {
    try {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasAiKey(hasKey);
    } catch (e) {
      console.error("Error checking API key status", e);
    }
  };

  const handleOpenKeyDialog = async () => {
    try {
      await window.aistudio.openSelectKey();
      // Assume success as per guidelines
      setHasAiKey(true);
      setErrorMessage(null);
    } catch (e) {
      console.error("Error opening key dialog", e);
    }
  };

  const startTimer = (minutes: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(minutes * 60);
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setQuizFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleAnalysis = (caseId: string) => {
    setVisibleAnalyses(prev => ({ ...prev, [caseId]: !prev[caseId] }));
  };

  const openUnit = (unitId: number) => {
    const unitMap: Record<number, UnitData> = {
      1: UNIT_1_DATA, 2: UNIT_2_DATA, 3: UNIT_3_DATA, 4: UNIT_4_DATA, 5: UNIT_5_DATA
    };
    setActiveUnit(unitMap[unitId] || UNIT_1_DATA);
    setState(AppState.UNIT_VIEW);
    setSubTab('INFO');
    setQuizStarted(false);
    setQuizFinished(false);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startUnitQuiz = async () => {
    if (!activeUnit) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const questions = await generateUnitContent(activeUnit.id, `التقييم النهائي للوحدة: ${activeUnit.title}`, 20);
      setQuizQuestions(questions);
      setQuizStarted(true);
      setQuizFinished(false);
      setQuizScore(0);
      setCurrentQuizIndex(0);
      setHasAnsweredCurrent(false);
      startTimer(20); 
    } catch (error: any) {
      setErrorMessage(error.message || "فشل في بدء التقييم.");
      if (error.message?.includes("API")) setHasAiKey(false);
    } finally {
      setIsLoading(false);
    }
  };

  const startComprehensiveExam = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const questions = await generateUnitContent("ALL", "الامتحان النهائي الشامل للمقرر", 30);
      setQuizQuestions(questions);
      setQuizStarted(true);
      setQuizFinished(false);
      setQuizScore(0);
      setCurrentQuizIndex(0);
      setHasAnsweredCurrent(false);
      setState(AppState.FULL_EXAM);
      startTimer(45); 
    } catch (error: any) {
      setErrorMessage(error.message || "فشل في بدء الامتحان الشامل.");
      if (error.message?.includes("API")) setHasAiKey(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!activeUnit) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const questions = await generateUnitContent(activeUnit.id, activeUnit.title, 10);
      setDynamicQuestions(prev => ({
        ...prev,
        [activeUnit.id]: [...(prev[activeUnit.id] || []), ...questions]
      }));
    } catch (error: any) {
      setErrorMessage(error.message || "فشل في توليد الأسئلة.");
      if (error.message?.includes("API")) setHasAiKey(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateGlossary = async () => {
    if (!activeUnit) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const terms = await generateGlossaryTerms(activeUnit.id, activeUnit.title);
      setDynamicGlossary(prev => ({
        ...prev,
        [activeUnit.id]: [...(prev[activeUnit.id] || []), ...terms]
      }));
    } catch (error: any) {
      setErrorMessage(error.message || "فشل في توليد المصطلحات.");
      if (error.message?.includes("API")) setHasAiKey(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    if (hasAnsweredCurrent) return;
    if (answer === quizQuestions[currentQuizIndex].answer) setQuizScore(prev => prev + 1);
    setHasAnsweredCurrent(true);
  };

  const nextQuizQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setHasAnsweredCurrent(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setQuizFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const getGrade = (score: number, total: number) => {
    const p = (score / total) * 100;
    if (p >= 85) return { label: 'امتياز (Excellent)', color: 'text-emerald-600' };
    if (p >= 75) return { label: 'جيد جداً (Very Good)', color: 'text-blue-600' };
    if (p >= 65) return { label: 'جيد (Good)', color: 'text-amber-600' };
    if (p >= 50) return { label: 'مقبول (Pass)', color: 'text-orange-600' };
    return { label: 'راسب (Fail)', color: 'text-rose-600' };
  };

  const renderQuizMode = () => {
    if (quizFinished) {
      const grade = getGrade(quizScore, quizQuestions.length);
      return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
          <div className="bg-white p-8 md:p-16 rounded-[4rem] shadow-2xl text-center space-y-10 border-[16px] border-indigo-900 animate-in zoom-in duration-500 max-w-4xl w-full">
            <h2 className="text-4xl md:text-5xl font-black text-indigo-950">تقرير الأداء النهائي</h2>
            <div className="flex flex-col items-center">
              <div className="text-8xl md:text-[10rem] font-black text-amber-500 drop-shadow-lg leading-none">
                {quizScore}<span className="text-4xl text-gray-300">/{quizQuestions.length}</span>
              </div>
              <div className={`text-3xl md:text-5xl font-black mt-6 ${grade.color}`}>
                {grade.label}
              </div>
            </div>
            <div className="bg-indigo-50 p-8 rounded-[2.5rem] border-2 border-indigo-100 text-right">
              <p className="text-xl font-bold text-gray-700 leading-relaxed italic">
                {quizScore / quizQuestions.length >= 0.85 ? "تهانينا! لقد أثبت كفاءة أكاديمية استثنائية تليق بطلاب علم النفس المتميزين." : 
                 quizScore / quizQuestions.length >= 0.5 ? "نتيجة مرضية، ننصحك بالتركيز على المصطلحات الدقيقة لرفع تقديرك في الامتحان النهائي." : 
                 "تحتاج إلى إعادة قراءة مخرجات التعلم والقاموس الذكي قبل المحاولة القادمة."}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
              <button onClick={() => { setQuizStarted(false); setQuizFinished(false); state === AppState.FULL_EXAM ? startComprehensiveExam() : startUnitQuiz(); }} className="bg-indigo-900 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-indigo-950 shadow-xl transition-all">إعادة الاختبار 🔄</button>
              <button onClick={() => { setQuizStarted(false); setQuizFinished(false); setState(AppState.HOME); }} className="bg-white text-indigo-900 border-4 border-indigo-900 px-12 py-5 rounded-2xl font-black text-xl hover:bg-indigo-50 transition-all">الخروج 🏠</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto py-10 space-y-8 animate-in fade-in">
        <div className="sticky top-4 z-50 bg-indigo-950 p-6 rounded-[2.5rem] shadow-2xl border-2 border-indigo-800 text-white flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="text-right">
             <h3 className="text-2xl font-black text-amber-400">بوابة الاختبار الإلكتروني</h3>
             <p className="text-indigo-300 font-bold text-sm">سؤال {currentQuizIndex + 1} من {quizQuestions.length}</p>
           </div>
           
           <div className={`flex items-center gap-4 px-8 py-3 rounded-2xl border-2 ${timeLeft < 120 ? 'bg-rose-900 border-rose-500 animate-pulse' : 'bg-indigo-900 border-indigo-700'}`}>
              <span className="text-xl">⏱️</span>
              <span className="text-3xl font-black font-mono">{formatTime(timeLeft)}</span>
           </div>

           <div className="h-4 w-32 md:w-48 bg-indigo-800 rounded-full overflow-hidden border border-indigo-700">
             <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}></div>
           </div>
        </div>

        {quizQuestions.length > 0 && (
          <div className="transition-all duration-500">
             <QuestionCard 
               key={quizQuestions[currentQuizIndex].id} 
               question={quizQuestions[currentQuizIndex]} 
               onAnswer={handleQuizAnswer} 
               selectedAnswer={hasAnsweredCurrent ? 'DISABLED_IN_EXAM' : undefined} 
             />
          </div>
        )}

        {hasAnsweredCurrent && (
          <button 
            onClick={nextQuizQuestion} 
            className="w-full bg-indigo-900 hover:bg-indigo-950 text-white py-8 rounded-[2.5rem] font-black text-3xl shadow-2xl transition-all transform hover:scale-105 active:scale-95"
          >
            {currentQuizIndex < quizQuestions.length - 1 ? 'السؤال التالي ←' : 'تسليم الإجابات وإنهاء التقييم 📊'}
          </button>
        )}
      </div>
    );
  };

  const renderHome = () => (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-b-[12px] border-indigo-900 relative overflow-hidden text-right">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-indigo-950 mb-6">{COURSE_GENERAL.name}</h1>
          <p className="text-2xl text-indigo-600 font-black mb-8">{COURSE_GENERAL.university} - {COURSE_GENERAL.faculty}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-amber-500 p-8 rounded-[2.5rem] shadow-2xl text-white flex flex-col justify-between group hover:scale-[1.01] transition-transform">
              <div className="text-right mb-6">
                <h3 className="text-3xl font-black mb-4">🎓 الاختبار النهائي الشامل</h3>
                <p className="font-bold text-amber-50 leading-relaxed text-lg">تحدي الـ 30 سؤالاً: يغطي كافة الوحدات الدراسية ويحاكي الامتحان النهائي الرسمي.</p>
              </div>
              <button 
                onClick={startComprehensiveExam} 
                disabled={isLoading}
                className="bg-white text-amber-600 px-8 py-5 rounded-2xl font-black shadow-xl text-xl flex items-center justify-center gap-4 hover:bg-amber-50 transition-colors"
              >
                {isLoading ? 'جاري التحضير...' : 'دخول الامتحان الآن ←'}
              </button>
            </div>

            <div className="bg-indigo-950 p-8 rounded-[2.5rem] shadow-2xl text-white flex flex-col justify-between border border-indigo-800">
               <div className="text-right mb-6">
                  <h3 className="text-3xl font-black mb-4 flex items-center gap-3">
                    <span className="text-amber-400">🧠</span> محرك Gemini AI
                  </h3>
                  <p className="font-bold text-indigo-200 leading-relaxed text-lg">
                    {hasAiKey ? 'نظام الذكاء الاصطناعي متصل وجاهز لتوليد المحتوى التفاعلي.' : 'يرجى تفعيل مفتاح الوصول لاستخدام ميزات الذكاء الاصطناعي.'}
                  </p>
               </div>
               <button 
                  onClick={handleOpenKeyDialog}
                  className={`w-full ${hasAiKey ? 'bg-indigo-800 text-indigo-100' : 'bg-rose-600 text-white'} py-5 rounded-2xl font-black shadow-xl text-xl flex items-center justify-center gap-4 transition-all`}
               >
                  {hasAiKey ? '✅ المفتاح نشط (تغيير)' : '🔑 تفعيل مفتاح API الآن'}
               </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <div className="bg-indigo-50 p-5 rounded-[1.5rem] border border-indigo-100 flex flex-col items-center">
               <span className="text-[10px] uppercase font-black text-indigo-400 mb-1">رمز المقرر</span>
               <span className="text-indigo-900 font-black text-xl">{COURSE_GENERAL.code}</span>
             </div>
             <div className="bg-indigo-50 p-5 rounded-[1.5rem] border border-indigo-100 flex flex-col items-center">
               <span className="text-[10px] uppercase font-black text-indigo-400 mb-1">المستوى</span>
               <span className="text-indigo-900 font-black text-xl">{COURSE_GENERAL.level}</span>
             </div>
             <div className="bg-indigo-50 p-5 rounded-[1.5rem] border border-indigo-100 flex flex-col items-center">
               <span className="text-[10px] uppercase font-black text-indigo-400 mb-1">الساعات</span>
               <span className="text-indigo-900 font-black text-xl">{COURSE_GENERAL.hours}</span>
             </div>
             <div className="bg-indigo-900 p-5 rounded-[1.5rem] shadow-xl flex flex-col items-center">
               <span className="text-[10px] uppercase font-black text-indigo-200 mb-1">منسق المقرر</span>
               <span className="text-white font-black text-sm text-center">{COURSE_GENERAL.coordinator}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 items-start text-right">
        <section className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
          <h2 className="text-3xl font-black text-indigo-950 mb-8 border-r-[10px] border-indigo-700 pr-6">الوحدات الدراسية (خارطة التعلم)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {UNITS.map(unit => (
              <button key={unit.id} onClick={() => openUnit(unit.id)} className="group p-8 bg-indigo-50/30 rounded-[2.5rem] hover:bg-indigo-900 hover:text-white transition-all text-right border-2 border-transparent shadow-sm flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-black text-indigo-500 group-hover:text-indigo-200">الوحدة {unit.id}</span>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-900 group-hover:bg-amber-400 transition-all shadow-sm">
                     <span className="font-black">0{unit.id}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-3">{unit.title}</h3>
                <p className="text-sm opacity-80 font-bold leading-relaxed mb-6 flex-grow">{unit.description}</p>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-indigo-100/50 group-hover:border-indigo-800">
                  <span className="text-xs font-black opacity-60">التقييم: 20 MCQ</span>
                  <span className="bg-white text-indigo-900 px-4 py-2 rounded-xl font-black text-xs shadow-md group-hover:bg-amber-400 transition-colors">استكشاف ←</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderUnitView = () => {
    if (!activeUnit) return null;
    const allUnitQuestions = [...activeUnit.questions, ...(dynamicQuestions[activeUnit.id] || [])];
    const allUnitGlossary = [...activeUnit.glossary, ...(dynamicGlossary[activeUnit.id] || [])];

    if (quizStarted) return renderQuizMode();

    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500 pb-20 text-right">
        <div className="bg-white p-8 rounded-3xl shadow-xl border-t-8 border-indigo-900">
           <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
             <h1 className="text-2xl md:text-3xl font-black text-indigo-950">الوحدة {activeUnit.id}: {activeUnit.title}</h1>
             <button onClick={() => setState(AppState.HOME)} className="bg-indigo-50 text-indigo-700 px-6 py-2 rounded-xl font-bold hover:bg-indigo-100">← الرئيسية</button>
           </div>
           
           {errorMessage && (
             <div className="mb-8 p-6 bg-rose-50 border-r-8 border-rose-600 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
               <p className="text-rose-950 font-black text-lg">{errorMessage}</p>
               <button onClick={handleOpenKeyDialog} className="bg-rose-600 text-white px-6 py-2 rounded-xl font-black">تفعيل المفتاح 🔑</button>
             </div>
           )}

           <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4 overflow-x-auto no-scrollbar">
              {(['INFO', 'GLOSSARY', 'PRACTICE', 'CASES', 'QUIZ'] as SubTab[]).map(tab => (
                <button key={tab} onClick={() => setSubTab(tab)} className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${subTab === tab ? 'bg-indigo-900 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {tab === 'INFO' && 'الأهداف والخطط'}
                  {tab === 'GLOSSARY' && 'القاموس الذكي'}
                  {tab === 'PRACTICE' && 'بنك الممارسة'}
                  {tab === 'CASES' && 'المواقف التفاعلية'}
                  {tab === 'QUIZ' && 'التقييم النهائي'}
                </button>
              ))}
           </div>
        </div>

        {subTab === 'QUIZ' && (
          <div className="space-y-10">
            <div className="bg-white p-12 md:p-20 rounded-[3.5rem] shadow-2xl text-center space-y-10 border-t-[16px] border-indigo-900 relative overflow-hidden max-w-4xl mx-auto">
              <div className="relative z-10">
                <span className="text-7xl mb-6 block">📝</span>
                <h2 className="text-4xl md:text-5xl font-black text-indigo-950 mb-6 uppercase tracking-tighter">التقييم النهائي للوحدة {activeUnit.id}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                   <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                      <span className="block text-gray-400 font-bold text-xs mb-1 uppercase">عدد الأسئلة</span>
                      <span className="text-indigo-950 font-black text-3xl">20 سؤال</span>
                   </div>
                   <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                      <span className="block text-gray-400 font-bold text-xs mb-1 uppercase">الزمن المتاح</span>
                      <span className="text-indigo-950 font-black text-3xl">20 دقيقة</span>
                   </div>
                   <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                      <span className="block text-gray-400 font-bold text-xs mb-1 uppercase">درجة النجاح</span>
                      <span className="text-indigo-950 font-black text-3xl">50%</span>
                   </div>
                </div>
                <p className="text-xl text-gray-600 font-bold mb-10 max-w-2xl mx-auto leading-relaxed italic">
                   "الهدف من هذا التقييم هو قياس تمكنك من المفاهيم الدينامية وتطبيقات القياس النفسي في البيئة المحلية."
                </p>
                <button 
                  onClick={startUnitQuiz} 
                  disabled={isLoading} 
                  className="bg-indigo-900 hover:bg-indigo-950 text-white px-20 py-8 rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto"
                >
                  {isLoading ? 'جاري بناء الاختبار...' : 'دخول بوابة التقييم الآن ←'}
                </button>
              </div>
            </div>
          </div>
        )}

        {subTab === 'INFO' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-gray-100">
              <h3 className="text-2xl font-black text-indigo-900 mb-8 border-r-4 border-indigo-600 pr-4">🎯 الأهداف التعليمية</h3>
              <ul className="space-y-4">
                {activeUnit.objectives.map((obj, i) => (
                  <li key={i} className="flex gap-4 p-5 bg-indigo-50/50 rounded-2xl items-center border border-indigo-50">
                    <div className="w-8 h-8 bg-indigo-900 text-white rounded-lg flex items-center justify-center font-black text-xs">{i+1}</div>
                    <span className="text-gray-800 text-lg font-bold leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-gray-100">
              <h3 className="text-2xl font-black text-indigo-900 mb-8 border-r-4 border-indigo-600 pr-4">📅 الخطة الزمنية</h3>
              <div className="space-y-4">
                {activeUnit.weeklyPlan.map((p, i) => (
                  <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-indigo-600 font-black text-sm">الأسبوع {p.week}</span>
                    </div>
                    <h4 className="font-black text-gray-900 text-lg mb-2">{p.topic}</h4>
                    <p className="text-sm text-gray-600 font-bold mb-4">{p.activity}</p>
                    <div className="bg-indigo-900/5 p-3 rounded-xl flex items-center gap-3">
                       <span className="text-xl">📍</span>
                       <span className="text-sm font-black text-indigo-900">{p.localExample}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {subTab === 'GLOSSARY' && (
          <div className="space-y-8">
            <div className="bg-indigo-900 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
               <div className="text-right relative z-10">
                  <h3 className="text-3xl font-black mb-2">القاموس الذكي (Gemini Enabled)</h3>
                  <p className="text-indigo-200 text-lg font-bold">توليد مصطلحات إضافية وتوضيحات معمقة من واقع البيئة السيناوية.</p>
               </div>
               <button onClick={handleGenerateGlossary} disabled={isLoading} className="bg-emerald-500 hover:bg-emerald-600 px-10 py-5 rounded-2xl font-black transition-all shadow-xl flex items-center gap-4 relative z-10 text-xl group">
                 {isLoading ? 'جاري التوليد...' : 'توليد مصطلحات Gemini 🧠'}
               </button>
            </div>
            <GlossaryTable terms={allUnitGlossary} />
          </div>
        )}

        {subTab === 'PRACTICE' && (
          <div className="space-y-8">
            <div className="bg-indigo-950 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
               <div className="text-right relative z-10">
                  <h3 className="text-3xl font-black mb-2">بنك الممارسة (100 سؤال)</h3>
                  <p className="text-indigo-200 text-lg font-bold">توليد أسئلة MCQ جديدة لتدريبك على الربط بين النظرية والتطبيق.</p>
               </div>
               <button onClick={handleGenerateQuestions} disabled={isLoading} className="bg-emerald-500 hover:bg-emerald-600 px-10 py-5 rounded-2xl font-black transition-all shadow-xl flex items-center gap-4 relative z-10 text-xl">
                 {isLoading ? 'جاري التحميل...' : 'توليد أسئلة Gemini 🧠'}
               </button>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {allUnitQuestions.map(q => <QuestionCard key={q.id} question={q} onAnswer={() => {}} />)}
            </div>
          </div>
        )}

        {subTab === 'CASES' && (
          <div className="space-y-12">
            {activeUnit.cases.map(c => (
              <div key={c.id} className="bg-white p-10 rounded-[3rem] shadow-xl border-l-[12px] border-emerald-500 text-right transition-all hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-black text-sm">دراسة حالة سيناوية 📍</div>
                  <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-black text-sm">المهارة: {c.targetSkill}</div>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-indigo-950 mb-10 leading-relaxed bg-gray-50/50 p-8 rounded-[2rem] italic">
                   "{c.scenario}"
                </h3>
                <div className="space-y-4 mb-10">
                   {c.questions.map((q, i) => (
                     <div key={i} className="flex gap-4 p-6 bg-white border border-gray-100 rounded-[1.5rem] hover:bg-indigo-50/30 transition-colors">
                       <span className="font-black text-emerald-600 text-xl">Q:</span>
                       <p className="text-gray-800 font-bold text-xl leading-relaxed">{q}</p>
                     </div>
                   ))}
                </div>
                <button 
                  onClick={() => toggleAnalysis(c.id)} 
                  className={`w-full py-6 rounded-[2rem] font-black text-xl transition-all shadow-md ${visibleAnalyses[c.id] ? 'bg-indigo-950 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                >
                    {visibleAnalyses[c.id] ? 'إخفاء التحليل' : 'فتح ملف التحليل الخبير (الرؤية السيناوية) 🔬'}
                </button>
                {visibleAnalyses[c.id] && (
                  <div className="mt-10 p-10 bg-emerald-50/30 rounded-[3rem] border border-emerald-200 animate-in fade-in slide-in-from-top-4 duration-500 shadow-inner">
                    <div className="space-y-12">
                      <div>
                        <h4 className="font-black text-emerald-950 mb-4 flex items-center gap-3 text-2xl">
                          <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
                          التأصيل الأكاديمي
                        </h4>
                        <p className="text-emerald-900 leading-relaxed text-xl font-semibold bg-white p-6 rounded-2xl shadow-sm">{c.expertAnalysis.theory}</p>
                      </div>
                      <div>
                        <h4 className="font-black text-emerald-950 mb-4 flex items-center gap-3 text-2xl">
                          <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
                          الرؤية السيناوية المحلية
                        </h4>
                        <p className="text-emerald-900 leading-relaxed text-xl font-semibold bg-white p-6 rounded-2xl shadow-sm">{c.expertAnalysis.sinaiInsight}</p>
                      </div>
                      <div className="bg-indigo-900 p-10 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
                        <h4 className="font-black mb-6 flex items-center gap-3 text-2xl relative z-10">
                          <span className="text-amber-400">💡</span> الحل العملي المقترح (ميداني)
                        </h4>
                        <p className="text-indigo-100 font-bold text-xl leading-relaxed relative z-10">{c.expertAnalysis.practicalSolution}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return <Layout>{state === AppState.HOME ? renderHome() : (state === AppState.FULL_EXAM ? renderQuizMode() : renderUnitView())}</Layout>;
};

export default App;
