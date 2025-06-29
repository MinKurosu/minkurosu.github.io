import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // <-- Certifique-se que esta linha está aqui!
  plugins: [react()],
})