import React, { useState } from 'react';
import { Search, Trophy, TrendingUp, Eye, Sword, Shield, Clock, Star, Zap, Target } from 'lucide-react';

interface PlayerStats {
  summoner: {
    name: string;
    id: string;
    puuid: string;
    level: number;
  };
  rating: number;
  details: {
    games: number;
    wins: number;
    winRate: number;
    avgKDA: number;
    avgVision: number;
    avgCS: number;
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
  };
}

interface AramRank {
  name: string;
  tier: string;
  color: string;
  minRating: number;
  icon: string;
}

interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({ isLoading: false, error: null });

  const aramRanks: AramRank[] = [
    { name: 'Hierro', tier: 'IV-I', color: 'text-amber-600', minRating: 0, icon: '🔩' },
    { name: 'Bronce', tier: 'IV-I', color: 'text-amber-700', minRating: 25, icon: '🥉' },
    { name: 'Plata', tier: 'IV-I', color: 'text-gray-400', minRating: 45, icon: '🥈' },
    { name: 'Oro', tier: 'IV-I', color: 'text-yellow-400', minRating: 65, icon: '🥇' },
    { name: 'Platino', tier: 'IV-I', color: 'text-cyan-400', minRating: 78, icon: '💎' },
    { name: 'Diamante', tier: 'IV-I', color: 'text-blue-400', minRating: 88, icon: '💠' },
    { name: 'Master', tier: '', color: 'text-purple-400', minRating: 94, icon: '👑' },
    { name: 'Gran Maestro', tier: '', color: 'text-red-400', minRating: 97, icon: '⚡' },
    { name: 'Challenger', tier: '', color: 'text-yellow-300', minRating: 99, icon: '🏆' }
  ];

  const getAramRank = (rating: number): AramRank => {
    for (let i = aramRanks.length - 1; i >= 0; i--) {
      if (rating >= aramRanks[i].minRating) {
        return aramRanks[i];
      }
    }
    return aramRanks[0];
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setLoadingState({ isLoading: false, error: 'Please enter a summoner name' });
      return;
    }

    setLoadingState({ isLoading: true, error: null });
    setPlayerStats(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock ARAM data - replace with actual API call to your backend
      const mockData: PlayerStats = {
        summoner: {
          name: searchTerm,
          id: 'mock-id',
          puuid: 'mock-puuid',
          level: Math.floor(Math.random() * 200) + 30
        },
        rating: Math.floor(Math.random() * 100), // 0-100 rating for ARAM
        details: {
          games: Math.floor(Math.random() * 50) + 20, // More ARAM games
          wins: Math.floor(Math.random() * 30) + 10,
          winRate: (Math.random() * 0.5) + 0.35, // 35-85% win rate
          avgKDA: (Math.random() * 3) + 1.5, // 1.5-4.5 KDA
          avgVision: Math.floor(Math.random() * 30) + 20, // 20-50 vision
          avgCS: Math.floor(Math.random() * 100) + 150, // 150-250 CS
          totalKills: Math.floor(Math.random() * 200) + 50,
          totalDeaths: Math.floor(Math.random() * 150) + 30,
          totalAssists: Math.floor(Math.random() * 250) + 80
        }
      };

      setPlayerStats(mockData);
      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      setLoadingState({ 
        isLoading: false, 
        error: 'Failed to fetch player data. Please try again.' 
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-400 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              ARAM Ranking
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Sistema de ranking personalizado para ARAM - Demuestra tu dominio en el Abismo de los Lamentos
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter summoner name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  disabled={loadingState.isLoading}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loadingState.isLoading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {loadingState.isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  'Search Player'
                )}
              </button>
            </div>
            
            {loadingState.error && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-300">
                {loadingState.error}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {playerStats && (
          <div className="max-w-6xl mx-auto">
            {(() => {
              const currentRank = getAramRank(playerStats.rating);
              return (
                <>
            {/* Player Header */}
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700/50 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="text-center sm:text-left mb-6 sm:mb-0">
                  <h2 className="text-3xl font-bold text-white mb-2">{playerStats.summoner.name}</h2>
                  <div className="flex items-center justify-center sm:justify-start">
                        <Zap className="w-5 h-5 text-cyan-400 mr-2" />
                        <span className="text-slate-300">Nivel {playerStats.summoner.level} • Especialista ARAM</span>
                  </div>
                </div>
                
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="text-6xl mb-2">{currentRank.icon}</div>
                        <div className={`text-2xl font-bold ${currentRank.color}`}>
                          {currentRank.name} {currentRank.tier}
                        </div>
                      </div>
                  <div className="mb-2">
                        <span className={`text-4xl font-bold ${currentRank.color}`}>
                      {playerStats.rating}
                    </span>
                        <span className="text-xl text-slate-400 ml-1">pts</span>
                  </div>
                      <div className="text-sm text-slate-400">
                        Rating ARAM
                  </div>
                </div>
              </div>
            </div>
                </>
              );
            })()}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Games & Win Rate */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-6 h-6 text-cyan-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Rendimiento</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Partidas ARAM</span>
                    <span className="text-white font-semibold">{playerStats.details.games}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Victorias</span>
                    <span className="text-green-400 font-semibold">{playerStats.details.wins}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">% Victorias</span>
                    <span className="text-green-400 font-semibold">
                      {(playerStats.details.winRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* KDA Stats */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                <div className="flex items-center mb-4">
                  <Sword className="w-6 h-6 text-red-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Combate</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">KDA Promedio</span>
                    <span className="text-blue-400 font-semibold">{playerStats.details.avgKDA.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Asesinatos</span>
                    <span className="text-green-400 font-semibold">{playerStats.details.totalKills}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Muertes</span>
                    <span className="text-red-400 font-semibold">{playerStats.details.totalDeaths}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Asistencias</span>
                    <span className="text-purple-400 font-semibold">{playerStats.details.totalAssists}</span>
                  </div>
                </div>
              </div>

              {/* Vision & CS */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-yellow-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Control del Mapa</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Visión Promedio</span>
                    <span className="text-yellow-400 font-semibold">{playerStats.details.avgVision.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">CS Promedio</span>
                    <span className="text-orange-400 font-semibold">{playerStats.details.avgCS.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* ARAM Specific Stats */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 text-purple-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Especialización</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Modo Favorito</span>
                    <span className="text-cyan-400 font-semibold">ARAM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Experiencia</span>
                    <span className="text-purple-400 font-semibold">
                      {playerStats.details.games > 100 ? 'Veterano' : 
                       playerStats.details.games > 50 ? 'Experimentado' : 'Novato'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Estilo</span>
                    <span className="text-yellow-400 font-semibold">
                      {playerStats.details.avgKDA > 2.5 ? 'Agresivo' : 
                       playerStats.details.avgKDA > 1.5 ? 'Equilibrado' : 'Defensivo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ranking System Explanation */}
            <div className="bg-gradient-to-r from-slate-800/50 to-blue-900/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700/50">
              <div className="flex items-start">
                <Trophy className="w-6 h-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-yellow-300 mb-3">Sistema de Ranking ARAM</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                    {aramRanks.map((rank, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl mb-1">{rank.icon}</div>
                        <div className={`font-semibold ${rank.color}`}>{rank.name}</div>
                        <div className="text-slate-400 text-xs">{rank.minRating}+ pts</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-300 mt-4 text-sm">
                    El rating se calcula basado en tu rendimiento en ARAM: ratio de victorias (40%), KDA promedio (35%), 
                    puntuación de visión (15%) y farm (10%). ¡Demuestra tu dominio en el Abismo!
                  </p>
                </div>
              </div>
            </div>

            {/* Integration Note */}
            <div className="bg-orange-900/30 backdrop-blur-sm rounded-2xl p-6 border border-orange-700/50">
              <div className="flex items-start">
                <Clock className="w-6 h-6 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-orange-300 mb-2">Integración con Backend</h4>
                  <p className="text-slate-300 mb-3">
                    Esta demo usa datos simulados. Para obtener estadísticas reales de ARAM:
                  </p>
                  <ul className="text-slate-300 space-y-1 ml-4">
                    <li>• Modifica tu server.js para filtrar solo partidas de ARAM</li>
                    <li>• Ajusta el cálculo de rating para enfocarse en métricas de ARAM</li>
                    <li>• Actualiza la llamada API en handleSearch() para usar tu endpoint</li>
                    <li>• Filtra por gameMode: <code className="bg-slate-700 px-2 py-1 rounded text-orange-300">"ARAM"</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;