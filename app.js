const axios = require("axios");
const fs = require("fs");

async function getComponentsWithoutLead() {
  try {
    const componentsResponse = await axios.get(
      "https://herocoders.atlassian.net/rest/api/3/project/SP/components"
    );
    const components = componentsResponse.data;
    const issuesResponse = await axios.get(
      "https://herocoders.atlassian.net/rest/api/3/search?jql=project=SP"
    );
    const issues = issuesResponse.data.issues;

    const componentsWithoutLead = {};

    for (const issue of issues) {
      const issueComponents = issue.fields.components;
      for (const component of issueComponents) {
        const componentId = component.id;
        const componentName = component.name;
        if (!componentsWithoutLead[componentId]) {
          componentsWithoutLead[componentId] = {
            name: componentName,
            count: 0,
          };
        }
        componentsWithoutLead[componentId].count++;
      }
    }
    const componentsWithoutLeadList = Object.values(
      componentsWithoutLead
    ).filter((component) => !component.lead);

    let output = "";
    componentsWithoutLeadList.forEach((component) => {
      output += `Component: ${component.name} (Issue Count: ${component.count})\n`;
    });

    fs.writeFileSync("output.txt", output);

    console.log(output);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

getComponentsWithoutLead();

module.exports = { getComponentsWithoutLead };
