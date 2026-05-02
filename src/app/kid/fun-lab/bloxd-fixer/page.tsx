'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CodeIssue {
  line: number;
  type: 'error' | 'warning' | 'info';
  message: string;
  fix?: string;
}

export default function BloxdCodeFixer() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [fixedCode, setFixedCode] = useState('');
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  // BLOXD.io code scanner and fixer
  const scanAndFixCode = () => {
    setScanning(true);
    setScanned(false);
    
    setTimeout(() => {
      const foundIssues: CodeIssue[] = [];
      let fixed = code;
      const lines = code.split('\n');

      // Check for common BLOXD.io issues
      lines.forEach((line, index) => {
        const lineNum = index + 1;

        // Missing semicolons
        if (line.trim() && !line.trim().endsWith(';') && !line.trim().endsWith('{') && !line.trim().endsWith('}') && !line.trim().startsWith('//') && !line.trim().startsWith('if') && !line.trim().startsWith('for') && !line.trim().startsWith('while') && !line.trim().startsWith('function')) {
          foundIssues.push({
            line: lineNum,
            type: 'warning',
            message: 'Missing semicolon at end of line',
            fix: 'Added semicolon'
          });
          fixed = fixed.replace(line, line + ';');
        }

        // Common typos
        if (line.includes('functoin')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: 'Typo: "functoin" should be "function"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace('functoin', 'function');
        }

        if (line.includes('retrun')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: 'Typo: "retrun" should be "return"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace('retrun', 'return');
        }

        if (line.includes('cosole')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: 'Typo: "cosole" should be "console"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace('cosole', 'console');
        }

        // BLOXD.io specific checks
        if (line.includes('player.positon')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: 'Typo: "positon" should be "position"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace('player.positon', 'player.position');
        }

        if (line.includes('world.spawnEnemy') && !line.includes('()')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: 'Missing parentheses for function call',
            fix: 'Added ()'
          });
        }

        // Variable naming issues
        if (line.match(/let\s+\d/)) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: 'Variable names cannot start with numbers',
            fix: 'Variables should start with letters'
          });
        }

        // Bracket matching
        const openBrackets = (line.match(/\{/g) || []).length;
        const closeBrackets = (line.match(/\}/g) || []).length;
        if (openBrackets !== closeBrackets && (line.includes('{') || line.includes('}'))) {
          foundIssues.push({
            line: lineNum,
            type: 'warning',
            message: 'Possible bracket mismatch',
            fix: 'Check your brackets'
          });
        }

        // Missing var/let/const
        if (line.match(/^\s*[a-zA-Z_]\w*\s*=/) && !line.includes('let') && !line.includes('const') && !line.includes('var')) {
          foundIssues.push({
            line: lineNum,
            type: 'warning',
            message: 'Variable declared without let/const/var',
            fix: 'Should use let, const, or var'
          });
        }

        // BLOXD API tips
        if (line.includes('player.health') && !line.includes('player.health =')) {
          foundIssues.push({
            line: lineNum,
            type: 'info',
            message: '💡 Tip: Use player.setHealth() for better results',
            fix: 'Recommendation'
          });
        }

        if (line.includes('setInterval') || line.includes('setTimeout')) {
          foundIssues.push({
            line: lineNum,
            type: 'warning',
            message: '⚠️ Be careful with timers - they can cause lag!',
            fix: 'Performance warning'
          });
        }
      });

      // If no issues found
      if (foundIssues.length === 0) {
        foundIssues.push({
          line: 0,
          type: 'info',
          message: '✅ No issues found! Your code looks great!',
        });
      }

      setIssues(foundIssues);
      setFixedCode(fixed);
      setScanning(false);
      setScanned(true);
    }, 1500); // Simulate scanning time
  };

  const copyFixedCode = () => {
    navigator.clipboard.writeText(fixedCode);
    alert('✅ Fixed code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border-2 border-white/20">
          <button
            onClick={() => router.push('/kid/fun-lab')}
            className="text-white/80 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Fun Lab
          </button>
          <h1 className="text-5xl font-black text-white mb-3 drop-shadow-lg">
            🔧 BLOXD Code Fixer
          </h1>
          <p className="text-xl text-white/90">
            Paste your bloxd.io code and I'll scan it for errors and fix them!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">📝 Your Code</h2>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your BLOXD.io code here...

Example:
function onPlayerJoin() {
  player.positon.x = 10
  cosole.log('Player joined')
}"
              className="w-full h-96 bg-gray-900 text-green-400 font-mono p-4 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-400"
              spellCheck={false}
            />
            
            <button
              onClick={scanAndFixCode}
              disabled={!code.trim() || scanning}
              className={`w-full mt-4 py-4 rounded-2xl font-bold text-xl transition-all transform ${
                !code.trim() || scanning
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105 hover:shadow-2xl'
              }`}
            >
              {scanning ? '🔍 Scanning...' : '🚀 Scan & Fix Code!'}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {/* Issues Found */}
            {scanned && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {issues.length === 1 && issues[0].line === 0 ? '✅ Results' : '🔍 Issues Found'}
                </h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl ${
                        issue.type === 'error'
                          ? 'bg-red-500/20 border-2 border-red-400'
                          : issue.type === 'warning'
                          ? 'bg-yellow-500/20 border-2 border-yellow-400'
                          : 'bg-blue-500/20 border-2 border-blue-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️'}
                        </span>
                        <div className="flex-1">
                          {issue.line > 0 && (
                            <div className="text-white/70 text-sm mb-1">
                              Line {issue.line}
                            </div>
                          )}
                          <div className="text-white font-semibold">
                            {issue.message}
                          </div>
                          {issue.fix && (
                            <div className="text-green-300 text-sm mt-1">
                              ✓ {issue.fix}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fixed Code */}
            {scanned && fixedCode !== code && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20">
                <h2 className="text-3xl font-bold text-white mb-4">✨ Fixed Code</h2>
                <textarea
                  value={fixedCode}
                  readOnly
                  className="w-full h-64 bg-gray-900 text-green-400 font-mono p-4 rounded-xl resize-none focus:outline-none"
                  spellCheck={false}
                />
                <button
                  onClick={copyFixedCode}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-xl hover:scale-105 transition-transform"
                >
                  📋 Copy Fixed Code
                </button>
              </div>
            )}

            {/* Tips */}
            {!scanned && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20">
                <h2 className="text-3xl font-bold text-white mb-4">💡 Tips</h2>
                <div className="space-y-3 text-white/90">
                  <p>✅ Checks for typos (functoin, retrun, cosole)</p>
                  <p>✅ Finds missing semicolons</p>
                  <p>✅ Detects bracket mismatches</p>
                  <p>✅ BLOXD.io API corrections</p>
                  <p>✅ Performance warnings</p>
                  <p>✅ Variable naming issues</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Example Code Snippets */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20">
          <h2 className="text-3xl font-bold text-white mb-4">📚 Common BLOXD.io Code Patterns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-xl">
              <h3 className="text-white font-bold mb-2">❌ Common Mistake:</h3>
              <code className="text-red-400 text-sm">
                player.positon.x = 10<br/>
                cosole.log("hi")
              </code>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl">
              <h3 className="text-white font-bold mb-2">✅ Fixed Version:</h3>
              <code className="text-green-400 text-sm">
                player.position.x = 10;<br/>
                console.log("hi");
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
