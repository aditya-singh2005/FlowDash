import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, connectDB } from '../db.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/login', async (req, res) => {
  console.log('🔐 Login attempt started');
  console.log('📨 Request body:', req.body);
  
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ msg: 'Email and password are required' });
  }
  
  console.log('👤 Attempting login for:', email);
 
  try {
    // Check if user exists
    console.log('🔍 Querying database for user...');
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    console.log('📊 Query result:', result.rows.length, 'users found');
    
    if (result.rows.length === 0) {
      console.log('❌ User not found in database');
      return res.status(401).json({ msg: 'Invalid email or password' });
    }
    
    const user = result.rows[0];
    console.log('👤 User found:', { id: user.id, email: user.email, role: user.role });
    console.log('🔐 Stored password hash:', user.password);
    console.log('🔐 Provided password:', password);
    
    // Check password
    console.log('🔐 Comparing passwords...');
    let validPass = false;
    
    // Check if password is already hashed or plain text
    if (user.password.startsWith('$2')) {
      // Password is hashed, use bcrypt.compare
      validPass = await bcrypt.compare(password, user.password);
    } else {
      // Password might be stored as plain text (for testing), compare directly
      validPass = password === user.password;
      console.log('⚠️ WARNING: Password appears to be stored as plain text');
    }
    
    console.log('✅ Password validation result:', validPass);
    
    if (!validPass) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ msg: 'Invalid email or password' });
    }
    
    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET not found in environment variables');
      return res.status(500).json({ msg: 'Server configuration error' });
    }
    
    console.log('🎫 Generating JWT token...');
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('✅ Login successful for user:', user.email);
    res.json({ 
      token,
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (err) {
    console.error('💥 Login error:', err);
    console.error('💥 Error stack:', err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Test route to check if auth router is working
router.get('/test-auth', (req, res) => {
  res.json({ message: 'Auth router is working!', timestamp: new Date().toISOString() });
});

// Route to check users in database (for debugging - remove in production)
router.get('/debug-users', async (req, res) => {
  try {
    const result = await db.query('SELECT id, email, role, password FROM users');
    console.log('🔍 Users in database:', result.rows);
    res.json({ users: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to create a test user (for debugging - remove in production)
router.post('/create-test-user', async (req, res) => {
  try {
    const email = 'admin@example.com';
    const password = 'admin123';
    const role = 'admin';
    
    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return res.json({ message: 'Test user already exists', user: existingUser.rows[0] });
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create the user
    const result = await db.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, role]
    );
    
    console.log('✅ Test user created:', result.rows[0]);
    res.json({ message: 'Test user created successfully', user: result.rows[0] });
    
  } catch (err) {
    console.error('Error creating test user:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  console.log('📝 Registration attempt started');
  console.log('📨 Request body:', req.body);
  
  const { fullName, email, password, role = 'employee' } = req.body;
  
  // Validation
  if (!fullName || !email || !password) {
    console.log('❌ Missing required fields');
    return res.status(400).json({ msg: 'Full name, email and password are required' });
  }
  
  if (password.length < 6) {
    console.log('❌ Password too short');
    return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('❌ Invalid email format');
    return res.status(400).json({ msg: 'Please provide a valid email address' });
  }
  
  const normalizedEmail = email.trim().toLowerCase();
  console.log('👤 Attempting registration for:', normalizedEmail);
  
  try {
    // Check if user already exists
    console.log('🔍 Checking if user already exists...');
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    
    if (existingUser.rows.length > 0) {
      console.log('❌ User already exists with this email');
      return res.status(409).json({ msg: 'User already exists with this email address' });
    }
    
    console.log('✅ Email is available, proceeding with registration');
    
    // Hash the password
    console.log('🔐 Hashing password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('✅ Password hashed successfully');
    
    // Begin transaction for user and employee creation
    console.log('🚀 Starting database transaction...');
    await db.query('BEGIN');
    
    try {
      // Insert user into database
      console.log('💾 Inserting user into database...');
      const userResult = await db.query(
        'INSERT INTO users (full_name, email, password, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, full_name, email, role, created_at',
        [fullName.trim(), normalizedEmail, hashedPassword, role]
      );
      
      if (userResult.rows.length === 0) {
        throw new Error('Failed to create user account');
      }
      
      const newUser = userResult.rows[0];
      console.log('✅ User created successfully:', { id: newUser.id, email: newUser.email, role: newUser.role });
      
      // Insert employee record with same ID
      console.log('👥 Inserting employee record...');
      const employeeResult = await db.query(
        'INSERT INTO employees (emp_id, emp_name, email) VALUES ($1, $2, $3) RETURNING emp_id, emp_name, email',
        [newUser.id, newUser.full_name, newUser.email]
      );
      
      if (employeeResult.rows.length === 0) {
        throw new Error('Failed to create employee record');
      }
      
      console.log('✅ Employee record created successfully:', { emp_id: employeeResult.rows[0].emp_id });
      
      // Commit transaction
      await db.query('COMMIT');
      console.log('✅ Transaction committed successfully');
      
      // Check JWT_SECRET
      if (!process.env.JWT_SECRET) {
        console.log('❌ JWT_SECRET not found in environment variables');
        return res.status(500).json({ msg: 'Server configuration error' });
      }
      
      // Generate JWT token for the new user
      console.log('🎫 Generating JWT token for new user...');
      const token = jwt.sign(
        { 
          id: newUser.id, 
          role: newUser.role, 
          email: newUser.email 
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      console.log('✅ Registration completed successfully for user:', newUser.email);
      
      // Return success response with token
      res.status(201).json({
        message: 'User registered successfully',
        token,
        role: newUser.role,
        user: {
          id: newUser.id,
          fullName: newUser.full_name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.created_at
        }
      });
      
    } catch (transactionError) {
      // Rollback transaction on error
      await db.query('ROLLBACK');
      console.log('❌ Transaction rolled back due to error');
      throw transactionError;
    }
    
  } catch (err) {
    console.error('💥 Registration error:', err);
    console.error('💥 Error stack:', err.stack);
    
    // Handle specific database errors
    if (err.code === '23505') { // Unique constraint violation
      return res.status(409).json({ msg: 'User already exists with this email address' });
    }
    
    res.status(500).json({ msg: 'Server error during registration', error: err.message });
  }
});

export default router;