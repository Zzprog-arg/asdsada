require('dotenv').config();
const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const path = require('path');

const app = express();
const cache = new NodeCache({ stdTTL: 60 }); // cache 60s

const PORT = process.env.PORT || 3000;
const RIOT_KEY = process.env.RIOT_API_KEY;
const REGION = process.env.REGION || 'la1';
const MATCH_REGION = process.env.MATCH_REGION || 'americas';

if(!RIOT_KEY){
  console.error('ERROR: Define RIOT_API_KEY en el .env (usa .env.example como referencia)');
  process.exit(1);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const axiosCfg = { headers: { 'X-Riot-Token': RIOT_KEY }, timeout: 10000 };

async function getSummonerByName(name){
  const url = `https://${REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}`;
  const r = await axios.get(url, axiosCfg);
  return r.data;
}

async function getMatchesByPuuid(puuid, count=10){
  const url = `https://${MATCH_REGION}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}&queue=450`; // 450 = ARAM queue
  const r = await axios.get(url, axiosCfg);
  return r.data;
}

async function getMatch(matchId){
  const url = `https://${MATCH_REGION}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
  const r = await axios.get(url, axiosCfg);
  return r.data;
}

function computeRatingFromMatches(matchDatas, puuid){
  if(!matchDatas || !matchDatas.length) return { rating: 0, details: {} };

  // Filtrar solo partidas de ARAM
  const aramMatches = matchDatas.filter(m => m.info.queueId === 450);
  if(!aramMatches.length) return { rating: 0, details: {} };

  let wins = 0;
  let totalKills = 0, totalDeaths = 0, totalAssists = 0;
  let totalVision = 0, totalCS = 0, totalGames = 0;

  for(const m of aramMatches){
    const participant = m.info.participants.find(p => p.puuid === puuid);
    if(!participant) continue;
    totalGames++;
    if(participant.win) wins++;
    totalKills += participant.kills;
    totalDeaths += participant.deaths;
    totalAssists += participant.assists;
    totalVision += (participant.visionScore || 0);
    totalCS += (participant.totalMinionsKilled || 0) + (participant.neutralMinionsKilled || 0);
  }

  if(totalGames === 0) return { rating: 0, details: {} };

  const winRate = wins / totalGames; // 0..1
  const avgKDA = (totalKills + totalAssists) / Math.max(1, totalDeaths);
  const avgVision = totalVision / totalGames;
  const avgCS = totalCS / totalGames;

  // Normalizaciones específicas para ARAM
  const normKDA = Math.min(avgKDA, 8) / 8; // ARAM tiene KDAs más altos, asume 0..8
  const normVision = Math.min(avgVision, 40) / 40; // ARAM tiene menos visión, 0..40
  const normCS = Math.min(avgCS / 8, 10) / 10; // ARAM tiene menos CS por minuto
  
  // Fórmula ajustada para ARAM: winRate 40%, KDA 35%, Vision 15%, CS 10%
  const rating = Math.round((winRate * 40 + normKDA * 35 + normVision * 15 + normCS * 10) * 100) / 100;

  return {
    rating,
    details: {
      games: totalGames,
      wins,
      winRate: +(winRate.toFixed(3)),
      avgKDA: +(avgKDA.toFixed(2)),
      avgVision: +(avgVision.toFixed(1)),
      avgCS: +(avgCS.toFixed(1)),
      totalKills, totalDeaths, totalAssists
    }
  };
}

app.get('/api/player/:name', async (req, res) => {
  try{
    const name = req.params.name;
    const cacheKey = `player:${name}`;
    const cached = cache.get(cacheKey);
    if(cached) return res.json(cached);

    const summ = await getSummonerByName(name);
    const matchIds = await getMatchesByPuuid(summ.puuid, 20); // últimas 20 partidas de ARAM
    // obtener matches de ARAM en paralelo con manejo de errores simple
    const matches = [];
    for(const id of matchIds){
      try{
        const m = await getMatch(id);
        matches.push(m);
      } catch(e){
        console.warn('No se pudo obtener match', id, e.message);
      }
    }

    const result = computeRatingFromMatches(matches, summ.puuid);
    const response = { summoner: { name: summ.name, id: summ.id, puuid: summ.puuid, level: summ.summonerLevel }, ...result };

    cache.set(cacheKey, response);
    res.json(response);
    } catch(err){
    // debug: imprimir status y body de la respuesta de Riot (si existe)
    console.error('Riot error status:', err.response?.status);
    console.error('Riot error data:', JSON.stringify(err.response?.data || err.message, null, 2));
    const status = err.response?.status || 500;
    res.status(status).json({ error: 'Error al obtener datos de Riot', details: err.response?.data || err.message });
  }

});

app.listen(PORT, ()=> console.log(`Server listening on http://localhost:${PORT}`));
