const extractData = (jsonData) => {
  const projectStatuses = jsonData.projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  const employeeParticipation = jsonData.projects.reduce((acc, project) => {
    const startDate = new Date(project.startDate);
    const monthYear = `${startDate.getMonth() + 1}/${startDate.getFullYear()}`;
    acc[monthYear] = (acc[monthYear] || 0) + project.employees.length;
    return acc;
  }, {});

  return { projectStatuses, employeeParticipation };
};

// Example usage
const jsonData = require("/path/to/ojt-final-project-default-rtdb-export.json"); // Adjust the path accordingly
const { projectStatuses, employeeParticipation } = extractData(jsonData);
