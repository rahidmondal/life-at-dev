import { Client, Databases, TablesDB } from 'node-appwrite';

/**
 * Creates an admin client for server-side Appwrite operations.
 * This client has elevated permissions via API Key and should ONLY be used in server-side code.
 *
 * @returns Object containing the admin client, databases (legacy), and tablesDB instances
 */
export function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? '')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '')
    .setKey(process.env.APPWRITE_API_KEY ?? '');

  const databases = new Databases(client);
  const tablesDB = new TablesDB(client);

  return {
    client,
    databases,
    tablesDB,
  };
}
