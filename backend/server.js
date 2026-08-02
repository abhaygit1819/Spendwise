const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/* 
 * =========================================================================
 * COMPUTER NETWORKS BRIDGE: Socket Binding & Port Configuration
 * =========================================================================
 * When we start our Express server, it occupies a specific logical "Port" 
 * (like 5000) on our OS Network Stack. A Port is an integer from 0 to 65535 
 * that identifies a specific process on a network.
 */
const app = express();
const PORT = process.env.PORT || 5000;

/* 
 * =========================================================================
 * COMPUTER NETWORKS BRIDGE: Cross-Origin Resource Sharing (CORS)
 * =========================================================================
 * By default, the browser prevents React (running on Port 5173) from requesting 
 * data from Express (running on Port 5000) due to the Same-Origin Policy.
 * The `cors()` middleware adds headers like 'Access-Control-Allow-Origin: *' 
 * to tell the browser it is safe to fetch this data.
 */
app.use(cors());

/* 
 * =========================================================================
 * OPERATING SYSTEMS BRIDGE: Stack vs Heap Allocation
 * =========================================================================
 * Incoming HTTP JSON bodies are parsed into JavaScript objects. 
 * - The variable reference pointer sits on the execution STACK.
 * - The actual parsed object structure dynamically occupies memory space on the HEAP.
 */
app.use(express.json());
                                               
/* 
 * =========================================================================
 * OPERATING SYSTEMS & DBMS BRIDGE: Virtual File System & Database Storage
 * =========================================================================
 * When we initialize 'sqlite3.Database', the OS kernel issues a 'system call' 
 * (like sys_open) to write/read a file named 'spendwise.db' on your hard drive.
 * SQLite handles writing to this file reliably using transactions.
 */
const dbPath = path.resolve(__dirname, 'spendwise.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("OS I/O Error opening SQLite database:", err.message);
    } else {
        console.log("=================================================================");
        console.log("DBMS Connection successful. Active database file: " + dbPath);
        createTableSchema();
    }
});

function createTableSchema() {
    /* 
     * =========================================================================
     * DBMS THEORY BRIDGE: Schema Definition, Integrity, and Indexing
     * =========================================================================
     * 1. Primary Key: Unique identifier for each tuple (row). The DBMS automatically   `
     *    builds a B-Tree index on this column for O(log N) fast lookups.
     * 2. NOT NULL constraints: Enforce domain integrity rules at database level.
     * 3. REAL/NUMERIC: Prevents floating-point rounding errors typical in JS numbers.
     * 
     * 
     *  
     */
    const sqlSchema = `
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL
        );
    `;

    db.run(sqlSchema, (err) => {
        if (err) {
            console.error("Schema Creation Failed:", err.message);
        } else {
            console.log("Database Schema validated. Ready for CRUD operations.");
            console.log("=================================================================");
        }
    });
}

/* 
 * =========================================================================
 * EXPRESS / NODE EVENTS BRIDGE: The Single-Threaded Event Loop
 * =========================================================================
 * Notice the 'db.all()' call utilizes an asynchronous callback function. 
 * While SQLite performs file-reads from the drive (Slow I/O), the Node.js 
 * single main thread is NOT blocked. It continues handling other users' requests. 
 * Once SQLite is ready, it queues the callback into the Event Loop's macro-task queue.
 */
app.get('/api/expenses', (req, res) => {
    const sql = `SELECT id, title, amount, category, date FROM expenses ORDER BY date DESC;`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: "Database SELECT anomaly: " + err.message });
            return;
        }
        res.json(rows);
    });
});

/* 
 * =========================================================================
 * DBMS THEORY BRIDGE: ACID Isolation & SQL Parameterized Insertion
 * =========================================================================
 * To prevent SQL Injection Attacks (where a user inputs malicious SQL inside the title), 
 * we use placeholders ('?'). The DBMS compiles the query structure first, 
 * treating user inputs purely as literal data parameters, never as executable SQL text.
 */
app.post('/api/expenses', (req, res) => {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
        return res.status(400).json({ error: "Constraint violation: Missing required properties." });
    }

    const sql = `INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?);`;
    const params = [title, amount, category, date];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: "ACID Transaction aborted on insert: " + err.message });
            return;
        }
        
        res.status(201).json({
            id: this.lastID,
            title,
            amount,
            category,
            date
        });
    });
});

app.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM expenses WHERE id = ?;`;

    db.run(sql, id, function (err) {
        if (err) {
            res.status(500).json({ error: "ACID Transaction aborted on delete: " + err.message });
            return;
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: "Tuple lookup failed: ID does not exist." });
        }

        res.json({ message: "Tuple successfully deleted from relation.", idDeleted: id });
    });
});

/* 
 * =========================================================================
 * SYSTEM CALLS BRIDGE: Socket Listening
 * =========================================================================
 * This command requests the operating system kernel to associate this Node.js process 
 * with the specified network port, transitioning our process into a 'listening' state 
 * to intercept TCP packets containing HTTP requests.
 */
app.listen(PORT, () => {
    console.log(`=================================================================`);
    console.log(`  SpendWise Server Process active & listening on Port: ${PORT}`);
    console.log(`  Local Network Access: http://localhost:${PORT}`);
    console.log(`=================================================================`);
});