import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const { creator_id, country, name, password, info, picture } = JSON.parse(event.body);
  const tableName = process.env.PODCASTER_TABLE;

  const params = {
    TableName: tableName,
    Key: { creator_id },
    UpdateExpression: 'SET #country = :country, #name = :name, #password = :password, #info = :info, #picture = :picture',
    ExpressionAttributeNames: {
      '#country': 'country',
      '#name': 'name',  // Usamos un alias para "name"
      '#password': 'password',
      '#info': 'info',
      '#picture': 'picture'
    },
    ExpressionAttributeValues: {
      ':country': country,
      ':name': name,
      ':password': password,
      ':info': info,
      ':picture': picture,
    },
    ReturnValues: 'ALL_NEW'
  };

  try {
    const data = await docClient.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Podcaster updated successfully', updatedItem: data.Attributes }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update podcaster', details: error.message }),
    };
  }
};