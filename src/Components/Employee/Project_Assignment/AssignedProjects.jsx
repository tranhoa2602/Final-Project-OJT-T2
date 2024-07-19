import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AssignedProjects = () => {
    const { id } = useParams();
    const [assignedProjects, setAssignedProjects] = useState([]);

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

    return (
        <div>
            <h1>Assigned Projects</h1>
            <ul>
                {assignedProjects.map(project => (
                    <li key={project.id}>
                        {project.projectId ? `Project ID: ${project.projectId}` : 'Project name not available'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AssignedProjects;
