import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const exportEmployeeCV = (employee, projects) => {
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
                text: `Address: ${employee.address || ""}`,
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
                text: `Email: ${employee.email}`,
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
                text: "WORKING EXPERIENCE",
                bold: true,
                size: 40,
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
                    size: 28,
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
                text: "TYPICAL PROJECTS",
                bold: true,
                size: 40,
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
                    text: `Project Name: ${project.name || ""}`,
                    bold: true,
                    size: 32,
                    color: "#34495e",
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Role: ${employee.positionName || ""}`,
                    size: 28,
                    color: "#7f8c8d",
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Description: ${project.description || ""}`,
                    size: 28,
                    color: "#2c3e50",
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Languages and Framework: ${
                      project.programmingLanguage || ""
                    }`,
                    size: 28,
                    color: "#2c3e50",
                    font: "Times New Roman",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Technologies: ${project.technology || ""}`,
                    size: 28,
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
