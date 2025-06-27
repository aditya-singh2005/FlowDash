import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { db, connectDB} from './db.js'
import authRouter from './routes/auth.js';
import { verifyToken } from "./middleware/authMiddleware.js";

// Load environment variables FIRST
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

connectDB();

// Enhanced CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000', 
        'http://localhost:3001', 
        'http://localhost:5173',
        'https://your-frontend-domain.com',  // Add your production frontend URL
        'https://www.your-frontend-domain.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));



// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`🔍 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('📦 Body:', req.body);
    console.log('🔗 Headers:', req.headers);
    next();
});


app.use('/api', authRouter);

// Test route to verify server is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});



app.get('/api/employee-details', verifyToken, async (req, res) => {
  try {
    console.log('=== Employee Details API Called ===');
    console.log('req.user:', req.user);
    
    // The verifyToken middleware has already decoded the token and set req.user
    const employeeId = req.user.id;
    console.log('Looking for employee with ID:', employeeId);
    
    let employeeResult = null;
    
    try {
      // Execute the query
      console.log('Executing database query...');
      employeeResult = await db.query(`SELECT * FROM employees WHERE emp_id = $1`, [employeeId]);
      console.log('Query result:', employeeResult);
      console.log('Number of rows returned:', employeeResult?.rows?.length);
      
      if (employeeResult?.rows?.length > 0) {
        console.log('Employee data found:', employeeResult.rows[0]);
      }
    } catch (err) {
      console.log("Database query error:", err.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Database query failed',
        error: err.message 
      });
    }
    
    // Check if employee exists - check if rows array has any results
    if (!employeeResult || !employeeResult.rows || employeeResult.rows.length === 0) {
      console.log('No employee found with ID:', employeeId);
      return res.status(404).json({ 
        success: false, 
        message: 'Employee not found' 
      });
    }
    
    // Get the first (and should be only) employee record
    const employee = employeeResult.rows[0];
    console.log('Employee record:', employee);
    
    // Return employee data directly (not nested in 'data' property)
    const employeeData = {
      id: employee.emp_id,
      emp_name: employee.emp_name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      date_of_joining: employee.date_of_joining,
      profile_url: employee.profile_url,
    };
    
    console.log('Sending employee data:', employeeData);
    
    // Send the employee data directly, not wrapped in a 'data' object
    res.json(employeeData);
    
  } catch (error) {
    console.error('Error fetching employee details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

app.get('/api/get-users', async (req, res) => {
    try {
        // Replace with your actual database query
        // Example using MySQL/similar SQL database:
        const query = 'SELECT id, full_name FROM users ORDER BY full_name';
        
        // Execute the query (adjust based on your database setup)
        const users = await db.query(query);
        
        res.json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

// API route to get all employees
app.get('/api/employees', async (req, res) => {
    try {
        const query = `
            SELECT 
                emp_id, 
                emp_name, 
                email, 
                phone, 
                department, 
                role, 
                date_of_joining, 
                profile_url 
            FROM employees
            ORDER BY emp_name ASC
        `;
        
        const { rows } = await db.query(query);
        res.json({ employees: rows });
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// API route to get all tasks
app.get('/api/get-tasks', verifyToken, async (req, res) => {
    const emp_id = req.user.id;
    try {
        const result = await db.query(`SELECT * FROM tasks WHERE emp_id = $1`, [emp_id]);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});


app.put('/api/tasks/:id/status', verifyToken, async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const emp_id = req.user.id; // from the JWT

  try {
    // Optional: only allow employee to update their own task
    const check = await db.query(
      'SELECT * FROM tasks WHERE id = $1 AND emp_id = $2',
      [id, emp_id]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ msg: 'Unauthorized to update this task' });
    }

    // Update the task's status
    await db.query(
      'UPDATE tasks SET status = $1 WHERE id = $2',
      [status, id]
    );

    res.status(200).json({ msg: 'Task status updated successfully' });
  } catch (err) {
    console.error('Error updating task status:', err);
    res.status(500).json({ msg: 'Failed to update task status' });
  }
});


// API route to create a new task
app.post('/api/tasks', async (req, res) => {
    try {
        const {
            task_id,
            emp_id,
            emp_name,
            department,
            task_tag,
            status,
            assigned_date,
            due_date,
            task_description
        } = req.body;

        const query = `
            INSERT INTO tasks (
                task_id,
                emp_id,
                emp_name,
                department,
                task_tag,
                status,
                assigned_date,
                due_date,
                task_description
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        
        const values = [
            task_id,
            emp_id,
            emp_name,
            department,
            task_tag,
            status,
            assigned_date,
            due_date,
            task_description
        ];
        
        const { rows } = await db.query(query, values);
        res.status(201).json({ task: rows[0] });
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('💥 Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`)
})