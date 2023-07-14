const axios = require("axios");
const fs = require("fs");
const { getComponentsWithoutLead } = require("../app");

jest.mock("axios");

describe("getComponentsWithoutLead", () => {
  beforeEach(() => {
    axios.get.mockReset();
    fs.writeFileSync = jest.fn();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  test("should retrieve components and issues correctly", async () => {
    const componentsData = {
      data: [
        { id: 1, name: "Component 1" },
        { id: 2, name: "Component 2" },
      ],
    };
    const issuesData = {
      data: {
        issues: [{ fields: { components: [{ id: 1, name: "Component 1" }] } }],
      },
    };

    axios.get.mockResolvedValueOnce(componentsData);
    axios.get.mockResolvedValueOnce(issuesData);

    await getComponentsWithoutLead();

    expect(axios.get).toHaveBeenCalledWith(
      "https://herocoders.atlassian.net/rest/api/3/project/SP/components"
    );
    expect(axios.get).toHaveBeenCalledWith(
      "https://herocoders.atlassian.net/rest/api/3/search?jql=project=SP"
    );
  });

  test("should generate correct output file", async () => {
    const componentsData = {
      data: [
        { id: 1, name: "Component 1" },
        { id: 2, name: "Component 2" },
      ],
    };
    const issuesData = {
      data: {
        issues: [{ fields: { components: [{ id: 1, name: "Component 1" }] } }],
      },
    };

    axios.get.mockResolvedValueOnce(componentsData);
    axios.get.mockResolvedValueOnce(issuesData);

    await getComponentsWithoutLead();

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "output.txt",
      expect.any(String)
    );
  });

  test("should log correct output to console", async () => {
    const componentsData = {
      data: [
        { id: 1, name: "Component 1" },
        { id: 2, name: "Component 2" },
      ],
    };
    const issuesData = {
      data: {
        issues: [{ fields: { components: [{ id: 1, name: "Component 1" }] } }],
      },
    };

    axios.get.mockResolvedValueOnce(componentsData);
    axios.get.mockResolvedValueOnce(issuesData);

    await getComponentsWithoutLead();

    expect(console.log).toHaveBeenCalledWith(expect.any(String));
  });

  test("should handle errors correctly", async () => {
    const errorMessage = "Network error";
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    await getComponentsWithoutLead();

    expect(console.error).toHaveBeenCalledWith("Error:", errorMessage);
  });
});
