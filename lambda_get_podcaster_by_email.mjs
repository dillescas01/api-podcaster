// lambda_get_podcaster_by_email.mjs

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const { creator_id } = JSON.parse(event.body);
  const tableName = process.env.PODCASTER_TABLE;

  const params = {
    TableName: tableName,
    KeyConditionExpression: 'creator_id = :creator_id',
    ExpressionAttributeValues: {
      ':creator_id': creator_id
    }
  };

  try {
    const data = await docClient.send(new QueryCommand(params));
    if (data.Items.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ podcaster: data.Items[0] }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Podcaster not found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve podcaster', details: error.message }),
    };
  }
};
