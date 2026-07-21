import { createApp } from './app';
import { testConnection } from './config/db';

const PORT = process.env.PORT || 5000;

async function start(): Promise<void> {
  try {
    await testConnection();
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
