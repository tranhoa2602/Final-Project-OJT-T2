import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AssignProject = () => {
    const { id } = useParams();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:5000/projects');
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProject) {
            alert('Please select a project.');
            return;
        }
        try {
            await axios.post('http://localhost:5000/assignedProjects', { employeeId: id, projectId: selectedProject });
            alert('Employee assigned to project successfully!');
        } catch (error) {
            console.error("Error assigning project:", error);
        }
    };

    return (
        <div>
            <h1>Assign Project</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Select Project:
                    <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                        <option value="">Select a project</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Assign</button>
            </form>
        </div>
    );
};

export default AssignProject;
