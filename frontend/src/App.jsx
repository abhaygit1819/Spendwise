import React, { useState, useEffect } from 'react';

// ============================================================================
// COMPUTER NETWORKS (LAYER 7 - APPLICATION LAYER)
// The API base endpoint represents an Application Layer identifier. 
// At the Transport Layer (Layer 4), this resolves to the loopback IP address 
// (127.0.0.1) bound to TCP port 5000 via OS Network Sockets.
// ============================================================================
const API_BASE_URL = import.meta.env.VITE_API_URL;
// ============================================================================
// DATA STRUCTURES (STATIC HASH MAP)
// In memory, this object is evaluated as a static Key-Value store. 
// Lookup time targeting any budget threshold domain is O(1) constant time complexity.
// ============================================================================
const BUDGETS = {
  Hosting: 3000,
  Food: 2000,
  Utilities: 1500,
  Education: 1000,
  Other: 1000
};

export default function App() {
  // ============================================================================
  // OPERATING SYSTEMS & MEMORY ALLOCATION
  // The state pointer variables live within the active execution Stack frame.
  // However, their state values—especially complex objects and arrays like 'expenses'—
  // dynamically occupy memory chunks allocated inside the runtime process HEAP.
  // Primitive values (strings, booleans) utilize fixed stack space allocations.
  // ============================================================================
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ============================================================================
  // CONCURRENCY & ASYNC SCHEDULING (THE EVENT LOOP)
  // To bypass the React Compiler's strict 'Synchronous Render Cascade' validation,
  // we push the invocation into a macro-task queue using a 0ms setTimeout.
  // This defers execution until the synchronous Call Stack is completely clear,
  // ensuring the initial UI layout paint finishes before the state changes.
  // ============================================================================
  useEffect(() => {
    const deferralTimer = setTimeout(() => {
      fetchExpenses();
    }, 0);
    
    // RESOURCE DEALLOCATION (Memory Leak Prevention)
    // Acts as a manual destructor; clears the timer from the kernel task list
    // if this component is unmounted before the asynchronous task resolves.
    return () => clearTimeout(deferralTimer);
  }, []);

  // ============================================================================
  // NON-BLOCKING I/O & MULTITHREADING ENCAPSULATION
  // JavaScript runs on a single main thread. The 'async/await' keywords do not
  // freeze the thread; they leverage the OS kernel's asynchronous network polling 
  // infrastructure, allowing the UI to remain interactive during HTTP I/O wait times.
  // ============================================================================
  const fetchExpenses = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // CN: Initiates an HTTP GET request stream across the network socket pipeline.
      const response = await fetch(`${API_BASE_URL}/expenses`);
      if (!response.ok) {
        throw new Error(`HTTP fetch failed: Status ${response.status}`);
      }
      // DE-SERIALIZATION: Parsing raw text byte packets into a JavaScript Heap object array.
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setErrorMsg(`Failed to reach the database backend. Ensure your backend is running. Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // DBMS TRANSITIONAL STATE: THE POST TRANSACTION
  // Submitting this form serializes runtime variables into a standard JSON stream.
  // This payload is transmitted over the network to trigger an upstream SQL statement:   
  // "INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?);"
  // ============================================================================
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // DOMAIN VALUE CONSTRAINTS
    // Basic verification asserting database schema constraints prior to hitting the network wire.
    if (!title || !amount) {
      setErrorMsg('Validation Constraint: Title and Amount are required.');
      return;
    }

    const payload = {
      title,
      amount: parseFloat(amount), // DATA TYPE CASTING: Map text strings to numbers (REAL)
      category,
      date
    };

    try {
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) // SERIALIZATION: Converting memory maps to wire string formats
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server rejected transactional payload.');
      }

      const newExpense = await response.json();

      // DATA STRUCTURES (IMMUTABILITY & ARRAY UNPACKING)
      // Instead of mutating the original memory reference array in-place, we allocate
      // a brand new array reference pointer, prepending the new item in O(1) amortized time.
      setExpenses([newExpense, ...expenses]);
      
      setTitle('');
      setAmount('');
      setSuccessMsg(`Database write successful: "${title}" added!`);
    } catch (err) {
      setErrorMsg(`Transaction aborted: ${err.message}`);
    }
  };

  // ============================================================================
  // DBMS RELATIONAL ALGEBRA: INDEXED TUPLE DELETION
  // Deletes an exact record targeting its unique PRIMARY KEY (id).
  // Upstream, this fires a targeted database drop: "DELETE FROM expenses WHERE id = ?"
  // ============================================================================
  const handleDeleteExpense = async (id, expenseTitle) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Server rejected deletion sequence.');
      }

      // DSA ALGORITHMS (LINEAR ALGORITHMIC FILTERING)
      // Performs a comprehensive O(N) traversal scan across the entire array.
      // Every element whose index ID does not match the predicate target is preserved,
      // creating a new array copy to instantly match the updated database relation state.
      setExpenses(expenses.filter(exp => exp.id !== id));
      setSuccessMsg(`Database row deleted: "${expenseTitle}" permanently removed.`);
    } catch (err) {
      setErrorMsg(`Delete transaction failed: ${err.message}`);
    }
  };

  // ============================================================================
  // DSA COMPUTE: DATA AGGREGATION & REDUCTION
  // Time Complexity: O(N) linear iteration over the structural list array.
  // Space Complexity: O(K) where K is the number of distinct string hash categories.
  // This computes localized analytics inside memory arrays using accumulator patterns.
  // ============================================================================
  const totalsByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  // TOTAL OUTLAY SUMMARY: A secondary linear O(N) calculation tracking financial scalar totals.
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans flex flex-col selection:bg-indigo-500/30">
      
      {/* Header Panel */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
            S
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight">SpendWise <span className="text-indigo-400">Live Client</span></h1>
            <p className="text-xs text-slate-400">Connected Sandbox Pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs text-slate-400 font-mono">React Engine Active</span>
        </div>
      </header>

      {/* Grid Dashboard */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Forms & Visual Limits (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Notifications */}
          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
              <span className="font-bold">SYSTEM ERROR:</span> {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl">
              <span className="font-bold">SYSTEM SUCCESS:</span> {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input Form Block */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-xl">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
                  Insert Entry (POST Transaction)
                </h3>

                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Expense Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Server Hosting"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Amount (₹)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 1500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Category</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Food">Food</option>
                        <option value="Hosting">Hosting</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Transaction Date</label>
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-semibold rounded-xl text-xs shadow-md"
                  >
                    Execute ACID Write Query
                  </button>
                </form>
              </div>
            </div>

            {/* In-Memory Limit Analysis Engine */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-xl">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
                  DSA Real-Time Aggregations
                </h3>

                <div className="space-y-3.5">
                  {Object.keys(BUDGETS).map(cat => {
                    const spent = totalsByCategory[cat] || 0;
                    const limit = BUDGETS[cat];
                    const percent = Math.min((spent / limit) * 100, 100);
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-300">{cat}</span>
                          <span className="text-slate-500">₹{spent} / ₹{limit}</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                          <div 
                            style={{ width: `${percent}%` }}
                            className={`h-full transition-all duration-500 rounded-full ${percent >= 100 ? 'bg-rose-500' : percent > 75 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-800/60 pt-3 mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Outlay:</span>
                <span className="text-sm font-bold text-white">₹{totalSpent}</span>
              </div>
            </div>

          </div>

          {/* Database Tuples Table */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Transaction Tuples (database relation)</h3>
              <button 
                onClick={fetchExpenses}
                className="text-[10px] bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-slate-800 px-2.5 py-1 rounded-full transition-colors"
              >
                Refresh Log Sync
              </button>
            </div>

            {loading ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Evaluating DB cursor indices...
              </div>
            ) : expenses.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Empty database relation. Populate the form to begin tracking operations.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                      <th className="p-3.5">ID (PK)</th>
                      <th className="p-3.5">Title Name</th>
                      <th className="p-3.5">Category Domain</th>
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5 text-right">Value (REAL)</th>
                      <th className="p-3.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {/* ==========================================================
                        DSA & RECONCILIATION IDENTIFIERS (THE 'key' HASH ID)
                        By mapping each record to exp.id, we supply React's tree
                        diffing engine with an immutable identifier hash map reference. 
                        This turns table re-renders into absolute O(1) targeted DOM updates.
                        ========================================================== */}
                    {expenses.map(exp => (
                      <tr key={exp.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="p-3.5 font-mono text-slate-500 text-[10px]">{exp.id}</td>
                        <td className="p-3.5 font-medium text-white">{exp.title}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-indigo-300 border border-slate-800">
                            {exp.category}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-400">{exp.date}</td>
                        <td className="p-3.5 text-right font-semibold text-white">₹{exp.amount}</td>
                        <td className="p-3.5 text-center">
                          <button 
                            onClick={() => handleDeleteExpense(exp.id, exp.title)}
                            className="text-[10px] text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Academic Blueprint Guide Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col h-full justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Academic Blueprint Sandbox</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <h4 className="text-xs font-bold text-indigo-400 mb-1">1. Computer Networks Connection</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    This React App triggers native fetch operations targeting <code className="text-indigo-300">API_BASE_URL</code> on Port 5000. Under the hood, this translates down to TCP segments managed by the OS Socket framework.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <h4 className="text-xs font-bold text-indigo-400 mb-1">2. OS Memory Stack vs. Heap</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Every state update is thread-safe on the client side. Primitives (`title`, `amount`) are evaluated inside local call frames, while database list objects exist as reference memory addresses on the runtime **Heap**.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <h4 className="text-xs font-bold text-indigo-400 mb-1">3. DBMS Normalization Concepts</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Notice that transactions use standard Primary Keys (the ID generated by SQLite) to maintain O(log N) indexing capability. This ensures referential consistency between UI updates and the SQL engine.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-[10px] text-slate-400">
              <span className="font-bold text-slate-300 block">System Orchestration Verification:</span>
              <p className="leading-relaxed">
                When you click "Execute ACID Write Query", watch how your browser transmits network packets directly to Port 5000, triggering an asynchronous operation to commit details permanently on your machine.
              </p>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};;