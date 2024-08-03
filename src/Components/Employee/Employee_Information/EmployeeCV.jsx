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
          new Paragraph({
            children: [
              new TextRun({
                text: employee.name.toUpperCase(),
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Address: ${employee.address || ""}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Email: ${employee.email}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "WORKING EXPERIENCE",
                bold: true,
                size: 24,
              }),
            ],
          }),
          ...experienceArray.map(
            (exp) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp}`,
                  }),
                ],
              })
          ),
          new Paragraph({
            children: [
              new TextRun({
                text: "TYPICAL PROJECTS",
                bold: true,
                size: 24,
              }),
            ],
          }),
          ...projectsArray
            .map((project) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Project Name: ${project.name || ""}`,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Role: ${employee.positionName || ""}`,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Description: ${project.description || ""}`,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Languages and Framework: ${
                      project.programmingLanguage || ""
                    }`,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Technologies: ${project.technology || ""}`,
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
