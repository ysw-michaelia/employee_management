import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));

const mongoURI = process.env.CONNECTION_URL;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

//define Employee model
const Employee = mongoose.model('Employee', {
    employee_id: { type: String, unique: true },
    full_name: String,
    email: String,
    hashed_password: String
}, 'employees'); 

//define Project model
const Project = mongoose.model('Project', {
    project_code: { type: String, unique: true },
    project_name: String,
    project_description: String
}, 'projects');

//define ProjectAssignment module
const ProjectAssignment = mongoose.model('ProjectAssignment', {
    employee_id: String,
    project_code: String,
    start_date: Date
}, 'project_assignments');

//add new emplyee
app.post('/api/employees', async (req, res) => {
    try {
      const employee = await Employee.create(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

//add new project
app.post('/api/projects', async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
