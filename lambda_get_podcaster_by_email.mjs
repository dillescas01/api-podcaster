// lambda_get_podcaster_by_email.mjs

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

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

  // Validación del parámetro requerido
  if (!creator_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing creator_id in request body' }),
    };
  }

  const tableName = process.env.PODCASTER_TABLE;

  const params = {
    TableName: tableName,
    KeyConditionExpression: 'creator_id = :creator_id',
    ExpressionAttributeValues: {
      ':creator_id': creator_id,
    },
  };

  try {
    const data = await docClient.send(new QueryCommand(params));

    if (data.Items && data.Items.length > 0) {
      // Si se encuentra el podcaster
      return {
        statusCode: 200,
        body: JSON.stringify({ podcaster: data.Items[0] }), // Aquí aseguramos que el objeto se convierta en JSON
      };
    } else {
      // Si no se encuentra el podcaster
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Podcaster not found' }),
      };
    }
  } catch (error) {
    // Manejo de errores
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to retrieve podcaster',
        details: error.message, // Enviamos el error como cadena JSON
      }),
    };
  }
};