import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`PsiApp backend ouvindo em http://localhost:${env.PORT} (${env.NODE_ENV})`);
});
