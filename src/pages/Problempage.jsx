import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import SubmissionHistory from "../components/Sub_hist"
import ChatAi from '../components/chatAI';
import Editorial from '../components/Editorial';

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
        
        console.log(res.data.message);
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
      console.log(res.data.message);
      setRunResult(res.data.results);
      console.log("iske baad kuch hua?")
     
    } catch (err) {
      setRunResult({ error: "Execution failed. Check console." });
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#1a1a1a]">
      <span className="loading loading-spinner text-success"></span>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-white">
      {/* Navbar / Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#282828] border-b border-[#3c3c3c]">
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hover:text-white cursor-pointer">Solve Problem</span>
          <h1 className="text-sm font-bold">{problem?.title}</h1>
        </div>
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

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Description/Solutions */}
        <div className="w-1/2 flex flex-col border-r border-[#3c3c3c]">
        {/* Tab Headers */}
        <div className="flex bg-[#282828] text-[11px] font-medium uppercase tracking-wider">
          {['description', 'editorial', 'solutions', 'submissions','chatAI'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveLeftTab(tab)}
              className={`px-4 py-2 transition-all ${
                activeLeftTab === tab 
                  ? 'bg-[#1a1a1a] border-b-2 border-white text-white' 
                  : 'text-gray-400 hover:text-white'
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
              <h2 className="text-2xl font-bold mb-2">{problem?.title}</h2>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 rounded-full text-[10px] bg-[#2c2c2c] text-green-400 border border-[#3c3c3c]">
                  {problem?.difficulty}
                </span>
                <span className="px-2 py-1 rounded-full text-[10px] bg-[#2c2c2c] text-blue-400 border border-[#3c3c3c]">
                  {problem?.tags}
                </span>
              </div>
              <div className="text-[#eff1f6ff] text-sm leading-7 mb-8 whitespace-pre-wrap">
                {problem?.description}
              </div>

              <h3 className="text-sm font-bold mb-4">Examples:</h3>
              <div className="space-y-6">
                {problem?.visibleTestCases?.map((tc, index) => (
                  <div key={index} className="bg-[#2a2a2a] p-4 rounded-lg border border-[#3c3c3c]">
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Example {index + 1}</p>
                    <div className="space-y-1 font-mono text-sm">
                      <p><span className="text-gray-500">Input:</span> {tc.input}</p>
                      <p><span className="text-gray-500">Output:</span> {tc.output}</p>
                      {tc.explanation && (
                        <p className="text-gray-400 mt-2 text-xs italic">
                          <span className="text-gray-500">Explanation:</span> {tc.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 2. SOLUTIONS TAB (Reference Solutions) */}
          {activeLeftTab === 'solutions' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-4">Reference Solutions</h2>
              {
                problem?.referenceSolution?.map((sol, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                        {sol.language}
                      </span>
                    </div>
                    <pre className="bg-[#2a2a2a] p-4 rounded-lg border border-[#3c3c3c] overflow-x-auto text-sm font-mono text-gray-300">
                      <code>{sol.completeCode}</code>
                    </pre>
                  </div>
                ))
              }
            </div>
          )}

          {/* 3. EDITORIAL TAB */}
          {activeLeftTab === 'editorial' && (
            <div className="prose max-w-none">
              <h2 className="text-xl font-bold mb-4">Editorial</h2>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
              </div>
            </div>
          )}

          {/* 4. SUBMISSIONS TAB */}
          {activeLeftTab === 'submissions' && (
          
              <div >
                <SubmissionHistory problemId={problemId}/>
              </div>
             
            
          )}

          {/*AI KA CODE*/}
          {activeLeftTab === 'chatAI' && (
            <div >
              <p className="text-lg font-semibold">chat with AI </p>
             <ChatAi problem={problem}/>
            </div>
          )}
        </div>
      </div>

        {/* Right Side: Code Editor */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-2 bg-[#282828] h-10 border-b border-[#3c3c3c]">
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent text-xs text-gray-300 focus:outline-none cursor-pointer hover:text-white"
            >
              <option className="bg-[#282828]" value="c++">C++</option>
              <option className="bg-[#282828]" value="c">C</option>
              <option className="bg-[#282828]" value="java">Java</option>
              
            </select>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              theme="vs-dark"
              language={selectedLanguage === 'c++' ? 'cpp' : selectedLanguage}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                padding: { top: 10 },
                fontFamily: 'Fira Code, monospace',
              }}
            />
          </div>

          {/* Bottom Panel */}
       {/* Bottom Panel */}
        <div className="h-56 border-t border-[#3c3c3c] bg-[#1a1a1a] flex flex-col">
          {/* 1. THE BUTTONS (TAB BAR) */}
          <div className="flex bg-[#282828] text-[11px] font-medium uppercase border-b border-[#3c3c3c]">
            <button 
              onClick={() => setActiveBottomTab('testcase')}
              className={`px-4 py-2 ${activeBottomTab === 'testcase' ? 'text-white border-b-2 border-green-500 bg-[#1a1a1a]' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Testcase
            </button>
            <button 
              onClick={() => setActiveBottomTab('result')}
              className={`px-4 py-2 ${activeBottomTab === 'result' ? 'text-white border-b-2 border-green-500 bg-[#1a1a1a]' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Result
            </button>
          </div>

          {/* 2. THE CONTENT AREA */}
          <div className="flex-1 p-3 font-mono text-sm overflow-y-auto">
            {activeBottomTab === 'testcase' ? (
              <div className="space-y-1">
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-tight">Default Input:</p>
                <pre className="bg-[#2a2a2a] p-2 rounded text-gray-300 border border-[#3c3c3c] text-xs max-h-32 overflow-y-auto">
                  {problem?.visibleTestCases?.[0]?.input || "No testcase available"}
                </pre>
              </div>
            ) : (
              <div className="text-gray-400 h-full">
                {isExecuting ? (
                  <div className="flex items-center gap-2 text-xs py-2">
                    <span className="loading loading-spinner loading-xs text-green-500"></span> 
                    Executing...
                  </div>
                ) : runResult ? (
                  <div className="space-y-2">
                    {/* Simple Status Row */}
                    <div className="flex items-center justify-between border-b border-[#3c3c3c] pb-1">
                      <p className={`text-sm font-bold uppercase ${runResult.status === "accepted" ? "text-green-500" : "text-red-500"}`}>
                        {runResult.status?.replace('_', ' ')}
                      </p>
                      <div className="text-[10px] text-gray-500 flex gap-2">
                        <span>{runResult.passed}/{runResult.total} PASSED</span>
                        <span>{runResult.runtime}s</span>
                      </div>
                    </div>

                    {/* Error Detail (Shows only on failure) */}
                    {runResult.status !== "accepted" && (
                      <div className="space-y-1">
                        <div className="bg-red-900/10 p-2 rounded border border-red-900/20 text-[11px] text-red-400 italic">
                          {runResult.detail || runResult.error || "Logic failure"}
                        </div>
                        <pre className="text-[10px] text-gray-500 bg-[#2a2a2a] p-1 rounded overflow-x-auto border border-[#3c3c3c] max-h-20">
                          {runResult.output || "No console output"}
                        </pre>
                      </div>
                    )}

                    {/* Simple Success Text (Shows only on success) */}
                    {runResult.status === "accepted" && (
                      <div className="py-4 text-center">
                        <p className="text-green-500 text-xs font-bold uppercase tracking-widest">✓ Solution Accepted</p>
                        <p className="text-[10px] text-gray-500 mt-1 italic">Memory: {runResult.memoryUsage}KB</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic py-4">Click "Run" to test your solution.</div>
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