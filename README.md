# Valoración LoL (Node.js + HTML)

Archivos incluidos:
- package.json
- .env.example
- server.js
- public/index.html
- README.md (este archivo)

## Uso rápido
1. Copia `.env.example` a `.env` y pega tu API key de Riot en `RIOT_API_KEY`.

2. Instala dependencias e inicia el servidor:

```bash
npm install
npm start
```

3. Abre `http://localhost:3000` en tu navegador, escribe tu nombre de invocador y presiona "Obtener valoración".

## Notas
- No publiques tu API key.
- Si recibes 401, revisa que tu API key esté activa y no haya expirado.
- Ajusta `REGION` y `MATCH_REGION` en `.env` si juegas en otra región.
