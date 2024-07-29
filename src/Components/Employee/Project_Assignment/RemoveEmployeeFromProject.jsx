import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RemoveEmployeeFromProject = () => {
    const { id } = useParams();
    const [assignedProjects, setAssignedProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');

    useEffect(() => {
        const fetchAssignedProjects = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/assignedProjects?employeeId=${id}`);
                setAssignedProjects(response.data);
            } catch (error) {
                console.error("Error fetching assigned projects:", error);
            }
        };

        fetchAssignedProjects();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/removeEmployeeProject`, { employeeId: id, projectId: selectedProject });
            alert('Employee removed from project successfully!');
            // Fetch the updated list of assigned projects
            const response = await axios.get(`http://localhost:5000/assignedProjects?employeeId=${id}`);
            setAssignedProjects(response.data);
        } catch (error) {
            console.error("Error removing employee from project:", error);
        }
    };

    return (
        <div>
            <h1>Remove Employee from Project</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Select Project:
                    <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                        {assignedProjects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Remove</button>
            </form>
        </div>
    );
};

export default RemoveEmployeeFromProject;
