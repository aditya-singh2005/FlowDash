import express from "express"
import pg from 'pg'
import cors from "cors"
import dotenv from "dotenv"

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
dotenv.config()

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});


const connectDB = async () => {
    try{
        await db.connect();
        console.log(`✅ PostgreSQL connected successfully`);
    } catch (err) {
        console.error('❌ PostgreSQL connection error:', err.message);
        process.exit(1);
    }
}

connectDB();

app.post('/api/tasks', async (req, res) => {
    const { employeeName, task_id, taskDescription, department, dueDate, taskTag, assignedDate } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO tasks (emp_name, task_id, task_description, department, due_date, task_tag, assigned_date) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [employeeName, task_id, taskDescription, department, dueDate, taskTag, assignedDate]
        );
        res.status(201).json({ message: "Task added successfully", task: result.rows[0] });
    } catch (err) {
        console.error("❌ Error inserting task:", err.message);
        res.status(500).json({ error: "Failed to add task" });
    }
});

app.get('/api/get-tasks', async (req,res) => {
    try{
        const result  = await db.query(
            `select * from tasks`
        )
        res.status(200).json({ tasks: result.rows });
    } catch(err) {
        console.error('❌ Error fetching tasks:', err.message);
        res.status(500).json({ error: 'Failed to fetch tasks from database' });
    }

})

app.get("/api/employee-details", async (req, res) => {
  const { name } = req.query; // get ?name= from the URL

  if (!name) {
    return res.status(400).json({ error: "Employee name is required in query." });
  }

  try {
    const result = await db.query(
      'SELECT * FROM employees WHERE emp_name = $1',
      [name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found." });
    }

    res.json(result.rows[0]); // send the first matching employee
  } catch (err) {
    console.error('❌ Error fetching employee details:', err.message);
    res.status(500).json({ error: 'Failed to fetch employee details from database' });
  }
});



app.listen(PORT, () => {
    console.log(`🚀 Server running on https://localhost:${process.env.PORT}`)
})