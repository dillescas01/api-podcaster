// lambda_delete_podcaster.mjs

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const { creator_id } = JSON.parse(event.body);
  const tableName = process.env.PODCASTER_TABLE;

  const params = {
    TableName: tableName,
    Key: { creator_id }
  };

  try {
    await docClient.send(new DeleteCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Podcaster deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete podcaster', details: error.message }),
    };
  }
};
