import cors from '@elysiajs/cors'

export const corsConfig = cors({
  origin: ['http://localhost:3000', 'http://shortner-dev.codeui.com:3000'],
})
