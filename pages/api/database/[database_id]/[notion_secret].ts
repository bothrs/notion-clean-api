const { Client } = require("@notionhq/client");
import NextCors from "nextjs-cors";

const getValue = (row) => {
  switch (row.type) {
    case "rich_text":
      return row.rich_text?.[0].text.content;

    case "select":
      return row.select.name;

    case "title":
      return row.title[0].plain_text;
  }
};

const formatResponse = (response) => {
  const formattedResponse = response.results.map((row) => {
    let formattedRow = {};
    Object.keys(row.properties).forEach((columnName) => {
      formattedRow = {
        ...formattedRow,
        [columnName]: getValue(row.properties[columnName]),
      };
    });
    return formattedRow;
  });

  return formattedResponse;
};

export const getDatabase = async (auth: string, database_id: string) => {
  const notion = new Client({
    auth,
  });

  const response = await notion.databases.query({
    database_id,
  });

  return {
    records: formatResponse(response),
  };
};

export default async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const { database_id, notion_secret } = req.query;

  const pages = await getDatabase(notion_secret, database_id);

  res.status(200).json(pages);
}
