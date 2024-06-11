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
}, 'projectassignments');

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

//add new project assignment
app.post('/api/projectassignments', async (req, res) => {
    try {
        const projectAssignment = await ProjectAssignment.create(req.body);
        res.status(201).json(projectAssignment);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/latestassignments', async (req, res) => {
    try {
        const projectAssignments = await ProjectAssignment.aggregate([
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employee_id',
                    foreignField: 'employee_id',
                    as: 'employee'
                }
            },
            {
                $unwind: '$employee'
            },
            {
                $lookup: {
                    from: 'projects', 
                    localField: 'project_code',
                    foreignField: 'project_code',
                    as: 'project'
                }
            },
            {
                $unwind: '$project'
            },
            {
                $project: {
                    _id: 0,
                    employee_id: 1,
                    full_name: '$employee.full_name',
                    project_name: '$project.project_name',
                    start_date: 1
                }
            },
            {
                $sort: { start_date: -1 }
            },
            {
                $limit: 5 // Limit the results to 5
            }
        ]);
        res.json(projectAssignments);
    } catch (error) {
        console.error('Error fetching project assignments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
