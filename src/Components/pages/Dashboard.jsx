import React, { useEffect, useState } from "react";
import { Layout, Card, Row, Col, Skeleton } from "antd";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { getDatabase, ref, get, child } from "firebase/database";
import {
  TeamOutlined,
  UsergroupAddOutlined,
  UserDeleteOutlined,
  ProjectOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import app from "../../../firebaseConfig";
import styles from "../../styles/layouts/Dashboard.module.scss";

const { Content } = Layout;

const Dashboard = () => {
  const { t } = useTranslation(); // Use useTranslation hook
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
  const [monthlyAdditions, setMonthlyAdditions] = useState({
    ProgramLanguages: {},
    Technologies: {},
  });

  useEffect(() => {
    // Fetch data from Firebase with a delay to simulate loading
    const fetchData = async () => {
      setLoading(true); // Set loading to true before data fetch
      const db = getDatabase(app);
      const dbRef = ref(db);

      const [
        projectsSnapshot,
        employeesSnapshot,
        programLanguagesSnapshot,
        technologiesSnapshot,
      ] = await Promise.all([
        get(child(dbRef, "projects")),
        get(child(dbRef, "employees")),
        get(child(dbRef, "programmingLanguages")),
        get(child(dbRef, "technologies")),
      ]);

      const projectsData = projectsSnapshot.val();
      const employeesData = employeesSnapshot.val();
      const programLanguagesData = programLanguagesSnapshot.val();
      const technologiesData = technologiesSnapshot.val();

      const { projectStatuses, employeeParticipation } =
        extractData(projectsData);

      const { total, participating, notParticipating, terminated } =
        calculateEmployeeCounts(employeesData, projectsData);

      const monthlyAdditions = calculateMonthlyAdditions(
        programLanguagesData,
        technologiesData
      );

      setProjectStatuses(projectStatuses);
      setEmployeeParticipation(employeeParticipation);
      setEmployeeCounts({ total, participating, notParticipating, terminated });
      setProjectCount(Object.keys(projectsData).length);
      setMonthlyAdditions(monthlyAdditions);

      setTimeout(() => {
        setLoading(false);
      }, 1500);
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

  const combinedDataBar = {
    labels: Object.keys(monthlyAdditions.ProgramLanguages),
    datasets: [
      {
        label: "Program Languages",
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        data: Object.values(monthlyAdditions.ProgramLanguages),
      },
      {
        label: "Technologies",
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        data: Object.values(monthlyAdditions.Technologies),
      },
    ],
  };

  return (
    <Layout className={styles.layout}>
      <h1 className="title">{t("DASHBOARD")}</h1>
      <Content className={styles.content}>
        <Row gutter={16} className={styles.row}>
          <Col span={8}>
            <Skeleton loading={loading} active>
              <Card className={`${styles.card} ${styles.card1}`} hoverable>
                <div className={styles.cardContent}>
                  <div className={styles.cardText}>
                    <h2 className={styles.cardTitle}>{t("Total Employees")}</h2>
                    <h1 className={styles.cardValue}>{employeeCounts.total}</h1>
                  </div>
                  <TeamOutlined className={styles.cardIcon} />
                </div>
              </Card>
            </Skeleton>
          </Col>
          <Col span={8}>
            <Skeleton loading={loading} active>
              <Card className={`${styles.card} ${styles.card2}`} hoverable>
                <div className={styles.cardContent}>
                  <div className={styles.cardText}>
                    <h2 className={styles.cardTitle}>
                      {t("Employees Participating")}
                    </h2>
                    <h1 className={styles.cardValue}>
                      {employeeCounts.participating}
                    </h1>
                  </div>
                  <UsergroupAddOutlined className={styles.cardIcon} />
                </div>
              </Card>
            </Skeleton>
          </Col>
          <Col span={8}>
            <Skeleton loading={loading} active>
              <Card className={`${styles.card} ${styles.card3}`} hoverable>
                <div className={styles.cardContent}>
                  <div className={styles.cardText}>
                    <h2 className={styles.cardTitle}>
                      {t("Employees Not Participating")}
                    </h2>
                    <h1 className={styles.cardValue}>
                      {employeeCounts.notParticipating}
                    </h1>
                  </div>
                  <UserDeleteOutlined className={styles.cardIcon} />
                </div>
              </Card>
            </Skeleton>
          </Col>
        </Row>
        <Row gutter={16} className={`${styles.row} ${styles.centeredRow}`}>
          <Col span={8}>
            <Skeleton loading={loading} active>
              <Card className={`${styles.card} ${styles.card4}`} hoverable>
                <div className={styles.cardContent}>
                  <div className={styles.cardText}>
                    <h2 className={styles.cardTitle}>
                      {t("Total Projects Created")}
                    </h2>
                    <h1 className={styles.cardValue}>{projectCount}</h1>
                  </div>
                  <ProjectOutlined className={styles.cardIcon} />
                </div>
              </Card>
            </Skeleton>
          </Col>
          <Col span={8}>
            <Skeleton loading={loading} active>
              <Card className={`${styles.card} ${styles.card5}`} hoverable>
                <div className={styles.cardContent}>
                  <div className={styles.cardText}>
                    <h2 className={styles.cardTitle}>
                      {t("Terminated Employees")}
                    </h2>
                    <h1 className={styles.cardValue}>
                      {employeeCounts.terminated}
                    </h1>
                  </div>
                  <LogoutOutlined className={styles.cardIcon} />
                </div>
              </Card>
            </Skeleton>
          </Col>
        </Row>
        <Row gutter={16} className={styles.row}>
          <Col span={12}>
            <Skeleton loading={loading} active>
              <Card
                title={t("Project Status Distribution")}
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
                title={t("Employee Participation Over Time")}
                className={styles.chartCard}
              >
                <div className={styles.chartContainer}>
                  <Bar data={dataBar} />
                </div>
              </Card>
            </Skeleton>
          </Col>
        </Row>
        <Row gutter={16} className={styles.row}>
          <Col span={24}>
            <Skeleton loading={loading} active>
              <Card
                title={t("Additions: ProgramLanguages and Technologies")}
                className={styles.chartCard}
              >
                <div className={styles.chartContainer}>
                  <Bar data={combinedDataBar} />
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

// Utility function to calculate monthly additions of ProgramLanguages and Technologies
const calculateMonthlyAdditions = (programLanguagesData, technologiesData) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const processAdditions = (data) =>
    data
      ? Object.values(data).reduce((acc, item) => {
          const dateAdded = formatDate(item.dateAdded);
          acc[dateAdded] = (acc[dateAdded] || 0) + 1;
          return acc;
        }, {})
      : {};

  const ProgramLanguages = processAdditions(programLanguagesData);
  const Technologies = processAdditions(technologiesData);

  return { ProgramLanguages, Technologies };
};
