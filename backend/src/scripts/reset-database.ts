// backend/src/scripts/reset-database.ts

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

async function resetDatabase() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME || 'guardianflux';

  if (!uri) {
    throw new Error('MONGO_URI no está definido en el .env');
  }

  console.log(`Conectando a MongoDB (${dbName})...`);
  await mongoose.connect(uri, { dbName });

  const db = mongoose.connection.db;

  if(!db){
    throw new Error('No se pudo conectar a la base de datos');
  }

  // ⬇️ Opción 1: Borrar TODA la base (colecciones + índices)
  // await db.dropDatabase();
  // console.log(`Base de datos "${dbName}" eliminada por completo.`);

  // ⬇️ Opción 2: Solo limpiar colecciones relevantes (manteniendo índices)
  const collectionsToClear = ['users', 'accounts', 'invitations', 'movements'];

  for (const name of collectionsToClear) {
    const exists = await db
      .listCollections({ name })
      .hasNext()
      .catch(() => false);

    if (!exists) {
      console.log(`Colección "${name}" no existe, se omite.`);
      continue;
    }

    const collection = db.collection(name);
    const result = await collection.deleteMany({});
    console.log(
      `Colección "${name}" limpiada. Documentos eliminados: ${result.deletedCount}`,
    );
  }

  await mongoose.disconnect();
  console.log('Conexión cerrada. Reset de base completado.');
}

resetDatabase().catch((err) => {
  console.error('Error reseteando la base de datos:', err);
  process.exit(1);
});
