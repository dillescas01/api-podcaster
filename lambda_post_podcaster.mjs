// lambda_post_podcaster.mjs

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const { creator_id, country, name, password, info, picture } = JSON.parse(event.body);
  const tableName = process.env.PODCASTER_TABLE;

  const params = {
    TableName: tableName,
    Item: {
      creator_id,
      country,
      name,
      password,
      info,
      picture,
    }
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Podcaster created successfully!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create podcaster', details: error.message }),
    };
  }
};
