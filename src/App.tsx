/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { Loader2, Sparkles, Share2, Mic } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [formData, setFormData] = useState({
    area: '',
    problem: '',
    proposal: '',
    effect: '',
    nextAction: '',
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async () => {
    if (!formData.area || !formData.problem || !formData.proposal) {
      setError('혁신 영역, 문제 정의, 제안 내용은 필수입니다.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult('');
    setError('');

    const prompt = `
당신은 물류 혁신 및 비즈니스 전략 전문가입니다.
다음은 우리 회사 직원이 작성한 물류 혁신 아이디어입니다.
이 아이디어를 심층적으로 분석하여 아래 5가지 항목에 대해 구조화된 피드백을 제공해주세요.

[직원의 아이디어]
- 혁신 영역: ${formData.area}
- 문제 정의: ${formData.problem}
- 제안 내용: ${formData.proposal}
- 기대 효과: ${formData.effect || '미입력'}
- 내일 당장 할 행동: ${formData.nextAction || '미입력'}

[요구사항 - 다음 5개 항목을 반드시 포함]
1. 실현 가능성 전문 분석 (Feasibility Analysis)
2. 추천 액션 플랜 (Recommended Action Plan)
3. 예상 파급 효과 (Expected Impact)
4. 신규 비즈니스 모델 도출 (New Business Model - 가치 제안 및 수익/비용 절감 구조)
5. 관련 물류 시장 환경 분석 (Market Trends Analysis)

마크다운(Markdown) 형식을 사용하여, 제목, 글머리 기호, 굵은 글씨 등을 활용해 가독성 좋고 프로페셔널하게 작성해 주세요. 친절하고 독려하는 톤 앤 매너를 유지해 주세요.
    `;

    try {
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-pro',
        contents: prompt,
      });

      for await (const chunk of responseStream) {
        setAnalysisResult((prev) => prev + chunk.text);
      }
    } catch (err: any) {
      console.error('AI Analysis Error:', err);
      setError('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-5 md:gap-6">

        {/* Header Column */}
        <header className="col-span-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
              I
            </div>
            <h1 className="text-base md:text-lg font-bold text-slate-800 leading-snug">
              "오늘 4시간 동안 배운 것을 바탕으로, 우리 회사 물류에서 <br className="hidden md:block" /> 가장 먼저 혁신하고 싶은 것은 무엇입니까?"
            </h1>
          </div>
          <div className="flex gap-3 shrink-0">
            <span className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-semibold flex items-center">
              v1.0
            </span>
          </div>
        </header>

        {/* Left Column: Form & Workflows */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 md:gap-6">

          {/* Step 1: Idea Input */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 01</h2>
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[11px] font-bold">혁신 아이디어 입력</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">혁신 영역 <span className="text-indigo-500">*</span></label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="예: 라스트마일 배송, 창고 자동화 등"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">문제 정의 <span className="text-indigo-500">*</span></label>
                <textarea
                  name="problem"
                  rows={2}
                  value={formData.problem}
                  onChange={handleInputChange}
                  placeholder="겪고 있는 가장 큰 문제점은 무엇인가요?"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-y transition-shadow"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">제안 내용 <span className="text-indigo-500">*</span></label>
                <textarea
                  name="proposal"
                  rows={3}
                  value={formData.proposal}
                  onChange={handleInputChange}
                  placeholder="문제를 해결할 구체적인 아이디어를 적어주세요."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-y transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">기대 효과</label>
                  <textarea
                    name="effect"
                    rows={2}
                    value={formData.effect}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-y transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">내일 할 행동</label>
                  <textarea
                    name="nextAction"
                    rows={2}
                    value={formData.nextAction}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-y transition-shadow"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 bg-red-50 p-3 rounded-lg text-xs font-semibold border border-red-100 mt-2">
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    분석 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    비즈니스 모델 분석 시작
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Step 2 & 3 Combined in a mini-grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 md:gap-6">
            <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 02</h2>
                <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide">조별 공유</span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  분석 결과 중 가장 인상적인 <strong className="text-indigo-600">핵심 포인트 1가지</strong>를 공유하기
                </p>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 03</h2>
                <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide">전체 발표</span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Mic className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  조별 대표 혁신 아이디어를 <strong className="text-indigo-600">1분 안에 발표</strong>하고 강사 피드백 받기
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Right Column: AI Analysis Output */}
        <div className="col-span-12 lg:col-span-8 flex flex-col h-full min-h-[600px] lg:min-h-0">
          <section
            className={`flex-1 rounded-xl p-6 md:p-8 flex flex-col transition-all duration-300 ${
              analysisResult || isAnalyzing
                ? 'bg-slate-900 border-none shadow-xl'
                : 'bg-white border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
            }`}
          >
            {analysisResult || isAnalyzing ? (
              <div className="flex flex-col h-full text-white">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">BM Report</h2>
                  </div>
                  <span className="px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-bold tracking-wide">
                    {isAnalyzing ? '분석 중...' : '자동 생성 완료'}
                  </span>
                </div>

                {isAnalyzing && !analysisResult && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-12">
                    <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-slate-800">
                      <div className="absolute inset-[-8px] rounded-full border-8 border-transparent border-t-indigo-500 border-r-indigo-500 animate-[spin_1.5s_linear_infinite]"></div>
                      <div className="text-indigo-400 font-bold text-xs uppercase tracking-widest animate-pulse">AI Engine</div>
                    </div>
                    <p className="text-sm text-slate-400 font-medium tracking-wide">수백만 개의 비즈니스 케이스를 매핑 중입니다...</p>
                  </div>
                )}

                <div className={`prose prose-invert prose-sm md:prose-base max-w-none flex-1
                  prose-headings:text-indigo-400 prose-h1:text-xl prose-h2:text-lg prose-h3:text-sm 
                  prose-a:text-indigo-300 prose-strong:text-indigo-300 prose-ul:text-slate-300 prose-p:text-slate-300 
                  overflow-y-auto ${!analysisResult && isAnalyzing ? 'hidden' : 'block'}`}>
                  <Markdown>{analysisResult}</Markdown>
                  {isAnalyzing && (
                     <span className="inline-block w-2.5 h-4 bg-indigo-500 ml-1 animate-pulse align-middle"></span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center h-full text-slate-500">
                <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-slate-100 mb-6">
                  <Sparkles className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-sm font-bold text-slate-700 tracking-wide mb-2 uppercase">대기 중</h3>
                <p className="text-xs text-slate-400 max-w-[250px] text-center leading-relaxed">
                  좌측에 아이디어를 입력하고 분석 시작을 누르면, 이 공간에 체계적인 비즈니스 모델 및 시장 효과 보고서가 생성됩니다.
                </p>
              </div>
            )}
          </section>
        </div>

      </div>
    </div>
  );
}
