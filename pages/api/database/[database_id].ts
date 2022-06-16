const { Client } = require("@notionhq/client");

const getValue = (row: any) => {
  switch (row.type) {
    case "rich_text":
      return row.rich_text?.[0].text.content;

    case "select":
      return row.select.name;

    case "title":
      return row.title[0].plain_text;
  }
};

const formatResponse = (response: any) => {
  const formattedResponse = response.results.map((row: any) => {
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

  return formatResponse(response);
};

export default async function handler(req: any, res: any) {
  const { database_id } = req.query;
  const { notion_secret } = req.headers;

  console.log(notion_secret, database_id);
  const pages = await getDatabase(notion_secret, database_id);

  res.status(200).json(pages);
}
