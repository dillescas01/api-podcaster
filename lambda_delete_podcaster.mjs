import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  let body;

  // Asegúrate de manejar ambos casos: string o ya objeto
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON format in request body' }),
    };
  }

  const { creator_id } = body;

  // Validación de campo requerido
  if (!creator_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required field: creator_id' }),
    };
  }

  const tableName = process.env.PODCASTER_TABLE;

  const params = {
    TableName: tableName,
    Key: { creator_id },
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