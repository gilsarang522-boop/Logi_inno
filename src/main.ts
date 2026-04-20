import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';
import { createIcons, Sparkles, Share2, Mic } from 'lucide';
import './index.css';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  createIcons({
    icons: { Sparkles, Share2, Mic }
  });

  const btnAnalyze = document.getElementById('btn-analyze') as HTMLButtonElement;
  const errorDiv = document.getElementById('error-message') as HTMLDivElement;
  
  const sectionParent = document.getElementById('result-section') as HTMLElement;
  const idleView = document.getElementById('view-idle') as HTMLElement;
  
  const analyzingContainer = document.getElementById('view-analyzing') as HTMLElement;
  const analysisSpinner = document.getElementById('analysis-spinner') as HTMLElement;
  const resultView = document.getElementById('view-result') as HTMLElement;
  
  const resultStatus = document.getElementById('result-status') as HTMLElement;
  const resultContent = document.getElementById('result-content') as HTMLElement;
  const typingIndicator = document.getElementById('typing-indicator') as HTMLElement;
  
  // Inputs
  const inpArea = document.getElementById('inp-area') as HTMLInputElement;
  const inpProblem = document.getElementById('inp-problem') as HTMLTextAreaElement;
  const inpProposal = document.getElementById('inp-proposal') as HTMLTextAreaElement;
  const inpEffect = document.getElementById('inp-effect') as HTMLTextAreaElement;
  const inpNextAction = document.getElementById('inp-nextAction') as HTMLTextAreaElement;

  if (btnAnalyze) {
      btnAnalyze.addEventListener('click', async () => {
        const area = inpArea.value.trim();
        const problem = inpProblem.value.trim();
        const proposal = inpProposal.value.trim();
        const effect = inpEffect.value.trim();
        const nextAction = inpNextAction.value.trim();

        if (!area || !problem || !proposal) {
          errorDiv.textContent = '혁신 영역, 문제 정의, 제안 내용은 필수입니다.';
          errorDiv.classList.remove('hidden');
          return;
        }

        errorDiv.classList.add('hidden');
        btnAnalyze.disabled = true;
        btnAnalyze.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>분석 중...';

        // Transition UI to Analyzing state
        idleView.classList.add('hidden');
        analyzingContainer.classList.remove('hidden');
        analysisSpinner.classList.remove('hidden');
        resultView.classList.add('hidden');
        typingIndicator.classList.remove('hidden');
        
        resultStatus.textContent = '분석 중...';
        resultContent.innerHTML = '';
        
        // Change Right Panel Style (Dark theme)
        sectionParent.className = 'flex-1 rounded-xl p-6 md:p-8 flex flex-col transition-all duration-300 bg-slate-900 border-none shadow-xl';

        const prompt = `당신은 물류 혁신 및 비즈니스 전략 전문가입니다.
다음은 우리 회사 직원이 작성한 물류 혁신 아이디어입니다.
이 아이디어를 심층적으로 분석하여 아래 5가지 항목에 대해 구조화된 피드백을 제공해주세요.

[직원의 아이디어]
- 혁신 영역: ${area}
- 문제 정의: ${problem}
- 제안 내용: ${proposal}
- 기대 효과: ${effect || '미입력'}
- 내일 당장 할 행동: ${nextAction || '미입력'}

[요구사항 - 다음 5개 항목을 반드시 포함]
1. 실현 가능성 전문 분석 (Feasibility Analysis)
2. 추천 액션 플랜 (Recommended Action Plan)
3. 예상 파급 효과 (Expected Impact)
4. 신규 비즈니스 모델 도출 (New Business Model - 가치 제안 및 수익/비용 절감 구조)
5. 관련 물류 시장 환경 분석 (Market Trends Analysis)

마크다운(Markdown) 형식을 사용하여, 제목, 글머리 기호, 굵은 글씨 등을 활용해 가독성 좋고 프로페셔널하게 작성해 주세요.`;

        try {
          const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-pro',
            contents: prompt,
          });

          // Once we receive the first chunk, transition from spinner to markdown view
          analysisSpinner.classList.add('hidden');
          resultView.classList.remove('hidden');
          
          let fullText = '';
          for await (const chunk of responseStream) {
            fullText += chunk.text;
            // Await parsing to support async markdown extensions if any
            resultContent.innerHTML = await marked.parse(fullText);
          }
          typingIndicator.classList.add('hidden');
          resultStatus.textContent = '자동 생성 완료';
        } catch (err) {
          console.error('AI Analysis Error:', err);
          errorDiv.textContent = '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          errorDiv.classList.remove('hidden');
          
          // Reverse UI to idle
          idleView.classList.remove('hidden');
          analyzingContainer.classList.add('hidden');
          sectionParent.className = 'flex-1 rounded-xl p-6 md:p-8 flex flex-col transition-all duration-300 bg-white border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]';
        } finally {
          btnAnalyze.disabled = false;
          btnAnalyze.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4"></i>비즈니스 모델 분석 시작';
          // Re-instantiate icons since innerHTML overrides them
          createIcons({ icons: { Sparkles }});
        }
      });
  }
});
