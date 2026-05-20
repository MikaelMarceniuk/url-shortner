import { MongoClient, Db } from 'mongodb'
import { env } from '../env.config'

class AppMongoClient {
  private clientInstance!: MongoClient
  private dbInstance: Db | null = null

  getClient(): MongoClient {
    return (this.clientInstance ||= new MongoClient(env.MONGODB_URL))
  }

  // Método utilitário para pegar a instância do Banco de Dados diretamente
  getDb(): Db {
    if (!this.dbInstance) {
      this.dbInstance = this.getClient().db() // Usa o banco padrão definido na URI
    }
    return this.dbInstance
  }

  async testConnection(): Promise<boolean> {
    const client = this.getClient()
    const maxAttempts = 5
    const delayMs = 2000

    // Se já temos a instância do banco, testamos com um ping rápido
    if (this.dbInstance) {
      try {
        await this.dbInstance.command({ ping: 1 })
        console.log('[Database] MongoDB already connected.')
        return true
      } catch {
        console.log('[Database] Connection lost. Reconnecting...')
        this.dbInstance = null
      }
    }

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(
          `[Database] Connection attempt ${attempt}/${maxAttempts}...`,
        )

        // No driver nativo, apenas chamamos o connect() diretamente
        await client.connect()

        // Inicializa a instância do banco de dados
        this.dbInstance = client.db()

        // Garante que o banco está realmente respondendo
        await this.dbInstance.command({ ping: 1 })

        console.log('[Database] Connection established successfully.')
        return true
      } catch (error) {
        console.error(
          `[Database] Connection attempt ${attempt} failed. Error:`,
          error instanceof Error ? error.message : error,
        )

        if (attempt < maxAttempts) {
          console.log(
            `[Database] Waiting ${delayMs / 1000} seconds before retrying...\n`,
          )
          await new Promise((resolve) => setTimeout(resolve, delayMs))
        }
      }
    }

    console.error(
      '[Database] Could not connect to the database after 5 attempts.',
    )
    console.error('[Database] Stopping the application process...')

    // Termina o processo Node.js imediatamente em caso de falha crítica
    process.exit(1)
  }
}

export const mongoClient = new AppMongoClient()
