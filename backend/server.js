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
        'http://localhost:5174',
        'https://flowdash.onrender.com',  // Add your production frontend URL
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

app.get('/api/employees/:emp_id', async (req, res) => {
    const { emp_id } = req.params;
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
            where emp_id = $1
        `;
        
        const { rows } = await db.query(query, [emp_id]); // Pass emp_id as parameter
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        res.json({ employee: rows[0] }); // Changed key to singular 'employee'
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

// Route to fetch all leaves data
app.get('/api/attendance', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        a.emp_id,
        a.emp_name,
        a.date,
        a.department,
        a.status,
        a.check_in,
        a.check_out,
        e.profile_url,
        e.role
      FROM 
        attendance a
      JOIN 
        employees e ON a.emp_id = e.emp_id
      ORDER BY 
        a.date DESC, a.emp_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leaves report:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for employee check-in
app.post('/api/attendance/check-in', async (req, res) => {
  try {
    const { emp_id, timestamp, status } = req.body;
    
    // Validate required fields
    if (!emp_id || !timestamp || !status) {
      return res.status(400).json({ 
        error: 'Missing required fields: emp_id, timestamp, status' 
      });
    }

    // Extract date and time from timestamp
    const checkInDate = new Date(timestamp);
    const date = checkInDate.toISOString().split('T')[0];
    const time = checkInDate.toTimeString().split(' ')[0];

    // Check if employee already checked in today
    const existingRecord = await db.query(
      'SELECT * FROM attendance WHERE emp_id = $1 AND date = $2',
      [emp_id, date]
    );

    if (existingRecord.rows.length > 0) {
      // Update existing record if check_in is null
      if (!existingRecord.rows[0].check_in) {
        await db.query(
          'UPDATE attendance SET check_in = $1, status = $2 WHERE emp_id = $3 AND date = $4',
          [time, status, emp_id, date]
        );
      } else {
        return res.status(400).json({ 
          error: 'You have already checked in today' 
        });
      }
    } else {
      // Get employee details
      const employeeResult = await db.query(
        'SELECT emp_name, department FROM employees WHERE emp_id = $1',
        [emp_id]
      );

      if (employeeResult.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Employee not found' 
        });
      }

      const employee = employeeResult.rows[0];

      // Create new attendance record
      await db.query(
        `INSERT INTO attendance (emp_id, emp_name, date, department, status, check_in) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [emp_id, employee.emp_name, date, employee.department, status, time]
      );
    }

    res.json({ 
      message: 'Check-in successful',
      data: {
        emp_id,
        date,
        check_in: time,
        status
      }
    });

  } catch (err) {
    console.error('Error during check-in:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for employee check-out
app.post('/api/attendance/check-out', async (req, res) => {
  try {
    const { emp_id, timestamp } = req.body;
    
    // Validate required fields
    if (!emp_id || !timestamp) {
      return res.status(400).json({ 
        error: 'Missing required fields: emp_id, timestamp' 
      });
    }

    // Extract date and time from timestamp
    const checkOutDate = new Date(timestamp);
    const date = checkOutDate.toISOString().split('T')[0];
    const time = checkOutDate.toTimeString().split(' ')[0];

    // Check if employee has checked in today
    const existingRecord = await db.query(
      'SELECT * FROM attendance WHERE emp_id = $1 AND date = $2',
      [emp_id, date]
    );

    if (existingRecord.rows.length === 0) {
      return res.status(400).json({ 
        error: 'You must check in first' 
      });
    }

    const record = existingRecord.rows[0];

    if (!record.check_in) {
      return res.status(400).json({ 
        error: 'You must check in first' 
      });
    }

    if (record.check_out) {
      return res.status(400).json({ 
        error: 'You have already checked out today' 
      });
    }

    // Update the record with check-out time
    await db.query(
      'UPDATE attendance SET check_out = $1 WHERE emp_id = $2 AND date = $3',
      [time, emp_id, date]
    );

    res.json({ 
      message: 'Check-out successful',
      data: {
        emp_id,
        date,
        check_out: time
      }
    });

  } catch (err) {
    console.error('Error during check-out:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get today's attendance status for an employee
app.get('/api/attendance/today/:emp_id', async (req, res) => {
  try {
    const { emp_id } = req.params;
    const { date } = req.query;
    
    // Use provided date or today's date
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const result = await db.query(
      'SELECT * FROM attendance WHERE emp_id = $1 AND date = $2',
      [emp_id, targetDate]
    );

    if (result.rows.length === 0) {
      return res.json({ 
        attendance: null,
        message: 'No attendance record found for today'
      });
    }

    res.json({ 
      attendance: result.rows[0]
    });

  } catch (err) {
    console.error('Error fetching today\'s attendance:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get attendance history for an employee
app.get('/api/attendance/history/:emp_id', async (req, res) => {
  try {
    const { emp_id } = req.params;
    const { limit = 30 } = req.query;
    
    const result = await db.query(
      `SELECT * FROM attendance 
       WHERE emp_id = $1 
       ORDER BY date DESC 
       LIMIT $2`,
      [emp_id, limit]
    );

    res.json({ 
      attendance: result.rows
    });

  } catch (err) {
    console.error('Error fetching attendance history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/leaves/details
app.get('/api/leaves', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        l.leave_id,
        l.emp_id,
        e.emp_name,
        e.department,
        e.role,
        e.profile_url,
        l.leave_type,
        l.reason,
        l.start_date,
        l.end_date,
        l.status,
        l.date_applied
      FROM 
        leaves l
      JOIN 
        employees e ON l.emp_id = e.emp_id
      ORDER BY 
        l.date_applied DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leave details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new leave request
app.post('/api/leaves', async (req, res) => {
    try {
        const { emp_id, leave_type, reason, start_date, end_date } = req.body;
        
        // Validation
        if (!emp_id || !leave_type || !reason || !start_date || !end_date) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (new Date(end_date) < new Date(start_date)) {
            return res.status(400).json({ error: 'End date cannot be before start date' });
        }

        const query = `
            INSERT INTO leaves (
                emp_id,
                leave_type,
                reason,
                start_date,
                end_date,
                status,
                date_applied
            ) VALUES ($1, $2, $3, $4, $5, 'pending', CURRENT_DATE)
            RETURNING *
        `;
        
        const { rows } = await db.query(query, [
            emp_id,
            leave_type,
            reason,
            start_date,
            end_date
        ]);
        
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('Error creating leave request:', err);
        res.status(500).json({ error: 'Failed to create leave request' });
    }
});

// GET leaves for a specific employee
app.get('/api/leaves/:emp_id', async (req, res) => {
    try {
        const { emp_id } = req.params;

        // Validate emp_id
        if (!emp_id || isNaN(emp_id)) {
            return res.status(400).json({ 
                success: false,
                error: 'Valid employee ID is required' 
            });
        }

        const query = `
            SELECT * FROM leaves
            WHERE emp_id = $1
            ORDER BY date_applied DESC
        `;  // Removed the parameter from here (it was incorrectly placed)

        const { rows } = await db.query(query, [emp_id]);  // Parameters go here as second argument

        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (err) {
        console.error('Error fetching leaves:', err);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching leave data',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
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