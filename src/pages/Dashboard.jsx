import React, { useState, useEffect } from "react";
import { Layout, Card, Row, Col, Skeleton } from "antd";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../firebaseConfig"; // Ensure you have your firebase configuration
import styles from "../styles/layouts/Dashboard.module.scss"; // Import the SCSS module

const { Content } = Layout;

const Dashboard = () => {
  const [projectStatuses, setProjectStatuses] = useState({});
  const [employeeParticipation, setEmployeeParticipation] = useState({});
  const [employeeCounts, setEmployeeCounts] = useState({
    total: 0,
    participating: 0,
    notParticipating: 0,
    terminated: 0,
  });
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Fetch data from Firebase with a delay to simulate loading
    const fetchData = async () => {
      setLoading(true); // Set loading to true before data fetch
      const db = getDatabase(app);
      const projectsRef = ref(db, "projects");
      const employeesRef = ref(db, "employees");

      const [projectsSnapshot, employeesSnapshot] = await Promise.all([
        get(projectsRef),
        get(employeesRef),
      ]);

      const projectsData = projectsSnapshot.val();
      const employeesData = employeesSnapshot.val();

      const { projectStatuses, employeeParticipation } =
        extractData(projectsData);

      const { total, participating, notParticipating, terminated } =
        calculateEmployeeCounts(employeesData, projectsData);

      setProjectStatuses(projectStatuses);
      setEmployeeParticipation(employeeParticipation);
      setEmployeeCounts({ total, participating, notParticipating, terminated });
      setProjectCount(Object.keys(projectsData).length);

      setTimeout(() => {
        setLoading(false); // Set loading to false after data fetch
      }, 1500); // Set loading time to 1.5 seconds
    };

    fetchData();
  }, []);

  const dataPie = {
    labels: Object.keys(projectStatuses),
    datasets: [
      {
        data: Object.values(projectStatuses),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const dataBar = {
    labels: Object.keys(employeeParticipation),
    datasets: [
      {
        label: "Number of Employees",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        data: Object.values(employeeParticipation),
      },
    ],
  };

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Row gutter={16} className={styles.row}>
          <Col span={8}>
            <Skeleton loading={loading} active>
              <Card className={`${styles.card} ${styles.card1}`} hoverable>
                <h2 className={styles.cardTitle}>Total Employees</h2>
                <h1 className={styles.cardValue}>{employeeCounts.total}</h1>
                <p className={styles.cardChange}>
                  Total employees in the company
                </p>
              </Card>
            </Skeleton>
          </Col>
          <Col span={8}>
            <Skeleton loading={loading} active>
              <Card className={`${styles.card} ${styles.card2}`} hoverable>
                <h2 className={styles.cardTitle}>Employees Participating</h2>
                <h1 className={styles.cardValue}>
                  {employeeCounts.participating}
                </h1>
                <p className={styles.cardChange}>
                  Employees currently participating in projects
                </p>
              </Card>
            </Skeleton>
          </Col>
          <Col span={8}>
            <Skeleton loading={loading} active>
              <Card className={`${styles.card} ${styles.card3}`} hoverable>
                <h2 className={styles.cardTitle}>
                  Employees Not Participating
                </h2>
                <h1 className={styles.cardValue}>
                  {employeeCounts.notParticipating}
                </h1>
                <p className={styles.cardChange}>
                  Employees not currently participating in projects
                </p>
              </Card>
            </Skeleton>
          </Col>
        </Row>
        <Row gutter={16} className={`${styles.row} ${styles.centeredRow}`}>
          <Col span={8}>
            <Skeleton loading={loading} active>
              <Card className={`${styles.card} ${styles.card4}`} hoverable>
                <h2 className={styles.cardTitle}>Projects Created</h2>
                <h1 className={styles.cardValue}>{projectCount}</h1>
                <p className={styles.cardChange}>Total projects created</p>
              </Card>
            </Skeleton>
          </Col>
          <Col span={8}>
            <Skeleton loading={loading} active>
              <Card className={`${styles.card} ${styles.card5}`} hoverable>
                <h2 className={styles.cardTitle}>Terminated Employees</h2>
                <h1 className={styles.cardValue}>
                  {employeeCounts.terminated}
                </h1>
                <p className={styles.cardChange}>
                  Employees terminated from the company
                </p>
              </Card>
            </Skeleton>
          </Col>
        </Row>
        <Row gutter={16} className={styles.row}>
          <Col span={12}>
            <Skeleton loading={loading} active>
              <Card
                title="Project Status Distribution"
                className={styles.chartCard}
              >
                <div className={styles.chartContainer}>
                  <Doughnut data={dataPie} className={styles.doughnutChart} />
                </div>
              </Card>
            </Skeleton>
          </Col>
          <Col span={12}>
            <Skeleton loading={loading} active>
              <Card
                title="Employee Participation Over Time"
                className={styles.chartCard}
              >
                <div className={styles.chartContainer}>
                  <Bar data={dataBar} />
                </div>
              </Card>
            </Skeleton>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;

// Utility function to extract data from JSON
const extractData = (jsonData) => {
  const projectStatuses = Object.values(jsonData).reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  const employeeParticipation = Object.values(jsonData).reduce(
    (acc, project) => {
      const startDate = new Date(project.startDate);
      const monthYear = `${
        startDate.getMonth() + 1
      }/${startDate.getFullYear()}`;
      acc[monthYear] =
        (acc[monthYear] || 0) +
        (project.employees ? project.employees.length : 0);
      return acc;
    },
    {}
  );

  return { projectStatuses, employeeParticipation };
};

// Utility function to calculate employee counts
const calculateEmployeeCounts = (employeesData, projectsData) => {
  const total = Object.keys(employeesData).length;
  const terminated = Object.values(employeesData).filter(
    (employee) => employee.status === "terminated"
  ).length;

  const participating = new Set();
  Object.values(projectsData).forEach((project) => {
    if (project.employees) {
      project.employees.forEach((employeeId) => participating.add(employeeId));
    }
  });

  const notParticipating = total - participating.size;

  return {
    total,
    participating: participating.size,
    notParticipating,
    terminated,
  };
};
