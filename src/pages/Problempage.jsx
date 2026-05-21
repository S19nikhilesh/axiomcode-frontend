import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import SubmissionHistory from "../components/Sub_hist"
import ChatAi from '../components/chatAI';
import Editorial from '../components/Editorial';
import { Sun, Moon } from 'lucide-react';

function ProblemPage() {
  const { problemId } = useParams();
  const editorRef = useRef(null);
  
  // State Management
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('c++');
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeBottomTab, setActiveBottomTab] = useState('testcase');
  const [loading, setLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') || 'dark');

const handleProblemsPageThemeToggle = () => {
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setCurrentTheme(nextTheme);
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('theme', nextTheme);
};

  // Load problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/ProblemById/${problemId}`);
        setProblem(res.data);
      } catch (err) {
        console.error("Error fetching problem", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  // Update editor content when language or problem changes
  useEffect(() => {
    if (problem && editorRef.current) {
      const langCode = problem.startCode?.find(c => c.language === selectedLanguage)?.initialCode;
      editorRef.current.setValue(langCode || "// write your code here");
    }
  }, [selectedLanguage, problem]);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;

    if (problem) {
      const langCode = problem.startCode?.find(c => c.language === selectedLanguage)?.initialCode;
      editor.setValue(langCode || "// write your code here");
    }
  }

  // API Call for Running Code (Dry Run)
  const handleRunCode = async () => {
    setIsExecuting(true);
    setActiveBottomTab('result');
    const userCode = editorRef.current.getValue();

    try {
        const res = await axiosClient.post(`/submission/run/${problemId}`, {
            code: userCode,
            language: selectedLanguage,
        });
        setRunResult(res.data.results);
    } catch (err) {
        if (err.response && err.response.status === 429) {
            alert("Opps! You are submitting too fast. Please wait a minute.");
            setRunResult({ error: "Rate limit exceeded. Try again in 1 minute." });
        } else {
            setRunResult({ error: "Execution failed. Check console." });
            console.error(err);
        }
    } finally {
        setIsExecuting(false);
    }
  };

  // API Call for Full Submission
  const handleSubmitCode = async () => {
    setIsExecuting(true);
    setActiveBottomTab('result');
    const userCode = editorRef.current.getValue();
    try {
      const res = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: userCode,
        language: selectedLanguage,
      });
      setRunResult(res.data.results);
    } catch (err) {
      setRunResult({ error: "Execution failed. Check console." });
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-base-300">
      <span className="loading loading-spinner text-success"></span>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-base-300 text-base-content transition-colors duration-200">
      
      {/* Navbar / Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-base-100 border-b border-base-content/10">
        <div className="flex items-center gap-4">
        <span className="text-base-content/60 text-sm hover:text-base-content cursor-pointer transition-colors">Solve Problem</span>
        <h1 className="text-sm font-bold">{problem?.title}</h1>
        </div>
    
      <div className="flex items-center gap-4"> {/* Yahan layout sahi rakhne ke liye gap aur items-center de diya */}
      
      {/* 🌗 INDEPENDENT DOM-BASED THEME TOGGLE SWITCH */}
      <button 
        onClick={handleProblemsPageThemeToggle}
        className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-base-content transition-colors"
        aria-label="Toggle Theme"
      >
        {currentTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Run & Submit Buttons */}
      <div className="flex gap-2">
        <button 
          onClick={handleRunCode} 
          disabled={isExecuting}
          className={`btn btn-sm btn-ghost lowercase text-green-500 ${isExecuting ? 'loading' : ''}`}
        >
          Run
        </button>
        <button 
          onClick={handleSubmitCode}
          disabled={isExecuting}
          className="btn btn-sm btn-success lowercase px-4 font-bold"
        >
          Submit
        </button>
      </div>
    </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Description/Solutions */}
        <div className="w-1/2 flex flex-col border-r border-base-content/10 bg-base-200">
          
          {/* Tab Headers */}
          <div className="flex bg-base-100 text-[11px] font-medium uppercase tracking-wider border-b border-base-content/5">
            {['description', 'editorial', 'solutions', 'submissions','chatAI'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveLeftTab(tab)}
                className={`px-4 py-2 transition-all ${
                  activeLeftTab === tab 
                    ? 'bg-base-200 border-b-2 border-base-content text-base-content font-bold' 
                    : 'text-base-content/50 hover:text-base-content'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            
            {/* 1. DESCRIPTION TAB */}
            {activeLeftTab === 'description' && (
              <>
                <h2 className="text-2xl font-bold mb-2 text-base-content">{problem?.title}</h2>
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 rounded-full text-[10px] bg-base-300 text-success border border-base-content/10">
                    {problem?.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded-full text-[10px] bg-base-300 text-info border border-base-content/10">
                    {problem?.tags}
                  </span>
                </div>
                <div className="text-base-content/90 text-sm leading-7 mb-8 whitespace-pre-wrap">
                  {problem?.description}
                </div>

                <h3 className="text-sm font-bold mb-4 text-base-content">Examples:</h3>
                <div className="space-y-6">
                  {problem?.visibleTestCases?.map((tc, index) => (
                    <div key={index} className="bg-base-300 p-4 rounded-lg border border-base-content/10">
                      <p className="text-xs font-bold text-base-content/40 mb-2 uppercase">Example {index + 1}</p>
                      <div className="space-y-1 font-mono text-sm">
                        <p><span className="text-base-content/40">Input:</span> <span className="text-base-content">{tc.input}</span></p>
                        <p><span className="text-base-content/40">Output:</span> <span className="text-base-content">{tc.output}</span></p>
                        {tc.explanation && (
                          <p className="text-base-content/60 mt-2 text-xs italic">
                            <span className="text-base-content/40">Explanation:</span> {tc.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 2. SOLUTIONS TAB */}
            {activeLeftTab === 'solutions' && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold mb-4 text-base-content">Reference Solutions</h2>
                {problem?.referenceSolution?.map((sol, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-info bg-info/10 px-2 py-1 rounded">
                        {sol.language}
                      </span>
                    </div>
                    <pre className="bg-base-300 p-4 rounded-lg border border-base-content/10 overflow-x-auto text-sm font-mono text-base-content/90">
                      <code>{sol.completeCode}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}

            {/* 3. EDITORIAL TAB */}
            {activeLeftTab === 'editorial' && (
              <div className="prose max-w-none">
                <h2 className="text-xl font-bold mb-4 text-base-content">Editorial</h2>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-base-content/90">
                  <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
                </div>
              </div>
            )}

            {/* 4. SUBMISSIONS TAB */}
            {activeLeftTab === 'submissions' && (
              <div>
                <SubmissionHistory problemId={problemId}/>
              </div>
            )}

            {/* 5. AI TAB */}
            {activeLeftTab === 'chatAI' && (
              <div>
                <p className="text-lg font-semibold mb-3 text-base-content"> AXIOM AI </p>
                <ChatAi problem={problem}/>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Code Editor */}
        <div className="w-1/2 flex flex-col bg-base-100">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-2 bg-base-200 h-10 border-b border-base-content/10">
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent text-xs text-base-content/80 focus:outline-none cursor-pointer hover:text-base-content"
            >
              <option className="bg-base-200 text-base-content" value="c++">C++</option>
              <option className="bg-base-200 text-base-content" value="c">C</option>
              <option className="bg-base-200 text-base-content" value="java">Java</option>
            </select>
          </div>

          {/* Monaco Editor Wrapper */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              theme="vs-dark" // Editor content coding standard hamesha dark set badhiya lagta hai
              language={selectedLanguage === 'c++' ? 'cpp' : selectedLanguage}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                padding: { top: 10 },
                fontFamily: 'Fira Code, monospace',
              }}
            />
          </div>

          {/* Bottom Panel */}
          <div className="h-56 border-t border-base-content/10 bg-base-200 flex flex-col">
            
            {/* 1. THE BUTTONS (TAB BAR) */}
            <div className="flex bg-base-100 text-[11px] font-medium uppercase border-b border-base-content/10">
              <button 
                onClick={() => setActiveBottomTab('testcase')}
                className={`px-4 py-2 transition-colors ${activeBottomTab === 'testcase' ? 'text-base-content border-b-2 border-green-500 bg-base-200 font-bold' : 'text-base-content/40 hover:text-base-content'}`}
              >
                Testcase
              </button>
              <button 
                onClick={() => setActiveBottomTab('result')}
                className={`px-4 py-2 transition-colors ${activeBottomTab === 'result' ? 'text-base-content border-b-2 border-green-500 bg-base-200 font-bold' : 'text-base-content/40 hover:text-base-content'}`}
              >
                Result
              </button>
            </div>

            {/* 2. THE CONTENT AREA */}
            <div className="flex-1 p-3 font-mono text-sm overflow-y-auto bg-base-300">
              {activeBottomTab === 'testcase' ? (
                <div className="space-y-1">
                  <p className="text-base-content/40 text-[10px] uppercase font-bold tracking-tight">Default Input:</p>
                  <pre className="bg-base-100 p-2 rounded text-base-content/90 border border-base-content/10 text-xs max-h-32 overflow-y-auto">
                    {problem?.visibleTestCases?.[0]?.input || "No testcase available"}
                  </pre>
                </div>
              ) : (
                <div className="text-base-content/70 h-full">
                  {isExecuting ? (
                    <div className="flex items-center gap-2 text-xs py-2 text-success">
                      <span className="loading loading-spinner loading-xs"></span> 
                      Executing...
                    </div>
                  ) : runResult ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-base-content/10 pb-1">
                        <p className={`text-base font-black uppercase ${runResult.status === "accepted" ? "text-green-500" : "text-red-500"}`}>
                          {runResult.status?.replace('_', ' ')}
                        </p>
                        <div className="text-xs text-base-content/40 flex gap-2 font-bold">
                          <span>{runResult.passed}/{runResult.total} TEST CASES PASSED</span>              
                        </div>
                      </div>

                      {/* Error Detail */}
                      {runResult.status !== "accepted" && (
                        <div className="space-y-1">
                          <div className="bg-error/10 p-2 rounded border border-error/20 text-[11px] text-error italic">
                            {runResult.detail || runResult.error || "Logic failure"}
                          </div>
                          <pre className="text-[10px] text-base-content/50 bg-base-100 p-1 rounded overflow-x-auto border border-base-content/10 max-h-20">
                            {runResult.output || "No console output"}
                          </pre>
                        </div>
                      )}

                      {/* Simple Success Text */}
                      {runResult.status === "accepted" && (
                        <div className="py-4 text-center">
                          <p className="text-green-500 text-xs font-bold uppercase tracking-widest">✓ Solution Accepted</p>
                          <p className="text-[10px] text-base-content/40 mt-1 italic">Memory: {runResult.memoryUsage}KB</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-base-content/40 italic py-4">Click "Run" to test your solution.</div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
            
      </div>
    </div>
  );
}

export default ProblemPage;