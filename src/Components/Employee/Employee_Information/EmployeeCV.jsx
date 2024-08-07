import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const exportEmployeeCV = (employee, projects, translations) => {
  const {
    addressLabel,
    emailLabel,
    workingExperience,
    typicalProjects,
    projectName,
    roleLabel,
    descriptionLabel,
    specificationLabel,
    languagesFrameworkLabel,
    technologiesLabel,
  } = translations;

  const experienceArray = employee.experience
    ? employee.experience.split("\n")
    : [];

  const projectsArray = Array.isArray(projects) ? projects : [];

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header Section
          new Paragraph({
            children: [
              new TextRun({
                text: employee.name.toUpperCase(),
                bold: true,
                size: 56,
                color: "#2c3e50",
                font: "Times New Roman",
              }),
            ],
            alignment: "center",
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${addressLabel}: ${employee.address || ""}`,
                size: 28,
                color: "#7f8c8d",
                font: "Times New Roman",
              }),
            ],
            alignment: "center",
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${emailLabel}: ${employee.email}`,
                size: 28,
                color: "#7f8c8d",
                font: "Times New Roman",
              }),
            ],
            alignment: "center",
            spacing: { after: 400 },
          }),
          // Working Experience Section
          new Paragraph({
            children: [
              new TextRun({
                text: workingExperience,
                bold: true,
                size: 30,
                color: "#2980b9",
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          ...experienceArray.map(
            (exp) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp}`,
                    size: 20,
                    color: "#2c3e50",
                    font: "Times New Roman",
                  }),
                ],
                spacing: { after: 200 },
              })
          ),
          // Typical Projects Section
          new Paragraph({
            children: [
              new TextRun({
                text: typicalProjects,
                bold: true,
                size: 30,
                color: "#2980b9",
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          ...projectsArray
            .map((project) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${projectName}: ${project.name || ""}`,
                    bold: true,
                    size: 24,
                    color: "#34495e",
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${roleLabel}: ${employee.positionName || ""}`,
                    size: 20,
                    color: "#7f8c8d",
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${descriptionLabel}: ${project.description || ""}`,
                    size: 20,
                    color: "#2c3e50",
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${specificationLabel}: ${employee.specification || ""}`,
                    size: 20,
                    color: "#2c3e50",
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${languagesFrameworkLabel}: ${project.programmingLanguage || ""
                      }`,
                    size: 20,
                    color: "#2c3e50",
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${technologiesLabel}: ${project.technology || ""}`,
                    size: 20,
                    color: "#2c3e50",
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "\n", // Adding space between projects
                  }),
                ],
              }),
            ])
            .flat(),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${employee.name}_CV.docx`);
  });
};

export default exportEmployeeCV;
