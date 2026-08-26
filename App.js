import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';

const THEME = {
  bg: '#09090B',
  surface: '#131316',
  surfaceAlt: '#0E0E11',
  border: '#232329',
  textPrimary: '#F4F4F5',
  textSecondary: '#A1A1AA',
  textTertiary: '#6B6B74',
  accent: '#6366F1',
  accentSoft: 'rgba(99,102,241,0.14)',
  gold: '#EAB308',
  success: '#22C55E',
};

const CONTENT_MAX_WIDTH = 1120;

const GAMES = [
  {
    id: '1',
    title: 'Valorant',
    category: 'FPS',
    rating: '4.8',
    platform: 'PC',
    year: '2020',
    hours: '342 h',
    color: '#FF4655',
    desc: 'FPS tático 5v5 da Riot Games, focado em precisão, gestão de utilitários e trabalho em equipe.',
    image: 'https://tse3.mm.bing.net/th/id/OIP.ObRT-43dOSCPLvYUMDyyDgAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    id: '2',
    title: 'Elden Ring',
    category: 'RPG',
    rating: '4.9',
    platform: 'PS5 · PC',
    year: '2022',
    hours: '210 h',
    color: '#C9A86A',
    desc: 'RPG de ação em mundo aberto da FromSoftware, com exploração desafiadora e narrativa profunda.',
    image: 'https://tse2.mm.bing.net/th/id/OIP.qi-NaOzhyKV4a6pHQ4UfYQHaC_?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    id: '3',
    title: 'League of Legends',
    category: 'MOBA',
    rating: '4.6',
    platform: 'PC',
    year: '2009',
    hours: '890 h',
    color: '#0AC8B9',
    desc: 'MOBA competitivo 5v5 da Riot Games e um dos títulos mais relevantes do cenário de esports.',
    image: 'https://tse4.mm.bing.net/th/id/OIP.xEs_Cxxm4UfQtXsjVEP_sQHaC5?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    id: '4',
    title: 'Fortnite',
    category: 'Battle Royale',
    rating: '4.5',
    platform: 'Multiplataforma',
    year: '2017',
    hours: '156 h',
    color: '#FFE812',
    desc: 'Battle Royale desenvolvido pela Epic Games, conhecido pelo sistema de construção e atualizações constantes.',
    image: 'https://tse2.mm.bing.net/th/id/OIP._CMzl1DLqliORf8P391YRgHaEK?r=0&w=1280&h=720&rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    id: '5',
    title: 'God of War Ragnarök',
    category: 'Aventura',
    rating: '4.9',
    platform: 'PS5',
    year: '2022',
    hours: '78 h',
    color: '#4A90E2',
    desc: 'Aventura de ação da Santa Monica Studio que conclui a saga nórdica de Kratos e Atreus.',
    image: 'https://tse4.mm.bing.net/th/id/OIP.7PpvVFDc7ZKoDWHcIVoXXgHaCe?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    id: '6',
    title: 'Cyberpunk 2077',
    category: 'RPG',
    rating: '4.4',
    platform: 'PC · PS5',
    year: '2020',
    hours: '112 h',
    color: '#FCEE0A',
    desc: 'RPG de mundo aberto ambientado em Night City, com narrativa ramificada e alta personalização.',
    image: 'https://th.bing.com/th/id/R.0ad4dce80988a9ebf96606a47459e2a3?rik=90nSJNgB2KbH9g&pid=ImgRaw&r=0',
  },
  {
    id: '7',
    title: 'Call of Duty: MW III',
    category: 'FPS',
    rating: '4.3',
    platform: 'Multiplataforma',
    year: '2023',
    hours: '203 h',
    color: '#737373',
    desc: 'FPS com campanha cinematográfica e multiplayer competitivo de alta intensidade.',
    image: 'https://th.bing.com/th/id/R.15a7f372a79b00baa3b6308e0d68b7c6?rik=mWZTfjNoW3m5zA&pid=ImgRaw&r=0',
  },
  {
    id: '8',
    title: 'The Witcher 3',
    category: 'RPG',
    rating: '4.9',
    platform: 'Multiplataforma',
    year: '2015',
    hours: '315 h',
    color: '#B45309',
    desc: 'RPG premiado da CD Projekt Red, reconhecido pela qualidade da narrativa e pelo mundo detalhado.',
    image: 'https://th.bing.com/th/id/R.6b7c342cdc7670991612c3d98bea429c?rik=HDkmqa6lPQOS%2bA&pid=ImgRaw&r=0',
  },
];

const CATEGORIES = ['Todos', 'FPS', 'RPG', 'MOBA', 'Battle Royale', 'Aventura'];

export default function App() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('Todos');
  const [favorites, setFavorites] = useState(['1', '3']);
  const [tab, setTab] = useState('home');
  const [selectedGame, setSelectedGame] = useState(null);

  const { width } = useWindowDimensions();
  const columns = width >= 1280 ? 3 : width >= 820 ? 2 : 1;

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const favoriteGames = useMemo(
    () => GAMES.filter((g) => favorites.includes(g.id)),
    [favorites]
  );

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedCat = activeCat.trim().toLowerCase();
    return GAMES.filter((g) => {
      const matchSearch = !normalizedSearch || g.title.toLowerCase().includes(normalizedSearch);
      const matchCategory = normalizedCat === 'todos' || g.category.trim().toLowerCase() === normalizedCat;
      const matchTab = tab !== 'favs' || favorites.includes(g.id);
      return matchSearch && matchCategory && matchTab;
    });
  }, [search, activeCat, favorites, tab]);

  const renderCard = ({ item }) => (
    <View style={styles.cardSlot}>
      <GameCard
        game={item}
        isFavorite={favorites.includes(item.id)}
        onToggleFavorite={() => toggleFavorite(item.id)}
        onPress={() => setSelectedGame(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.screen}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLogo}>GAMEVAULT</Text>
            <Text style={styles.headerTagline}>SUA BIBLIOTECA GAMER</Text>
          </View>
          <View style={styles.headerAvatar}>
            <Text style={styles.avatarInitials}>GG</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          <TabButton label="Início" active={tab === 'home'} onPress={() => setTab('home')} />
          <TabButton
            label="Favoritos"
            count={favorites.length}
            active={tab === 'favs'}
            onPress={() => setTab('favs')}
          />
          <TabButton label="Perfil" active={tab === 'profile'} onPress={() => setTab('profile')} />
        </View>

        {tab === 'profile' ? (
          <ProfileView favoriteGames={favoriteGames} />
        ) : (
          <>
            <View style={styles.searchWrap}>
              <TextInput
                placeholder="Buscar por título..."
                placeholderTextColor={THEME.textTertiary}
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
                  <Text style={styles.clearText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScrollView}
              contentContainerStyle={styles.categoryScroll}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCat(cat)}
                  style={[styles.chip, activeCat === cat && styles.chipActive]}
                >
                  <Text style={[styles.chipText, activeCat === cat && styles.chipTextActive]}>
                    {cat.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.infoBar}>
              <Text style={styles.infoCount}>{filtered.length} títulos</Text>
              <Text style={styles.infoFilter}>
                {activeCat === 'Todos' ? 'TODOS OS GÊNEROS' : activeCat.toUpperCase()}
              </Text>
            </View>

            <FlatList
              key={`grid-${columns}`}
              data={filtered}
              keyExtractor={(item) => item.id}
              renderItem={renderCard}
              numColumns={columns}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyTitle}>Nenhum título encontrado</Text>
                  <Text style={styles.emptySubtitle}>
                    Ajuste a busca ou selecione outra categoria.
                  </Text>
                </View>
              }
            />
          </>
        )}
      </View>

      <Modal
        visible={!!selectedGame}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedGame(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedGame && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.modalImageWrap]}>
                  <Image
                    source={{ uri: selectedGame.image }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlayTop} />
                  <View style={styles.imageOverlayBottom} />
                  <View style={styles.modalRatingBadge}>
                    <Text style={styles.modalRatingBadgeText}>★ {selectedGame.rating}</Text>
                  </View>
                </View>

                <View style={styles.modalHeader}>
                  <View style={styles.modalHeadingGroup}>
                    <Text style={styles.modalTitle}>{selectedGame.title}</Text>
                    <Text style={styles.modalMeta}>
                      {selectedGame.platform} · {selectedGame.year}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.categoryPill,
                      { borderColor: selectedGame.color },
                    ]}
                  >
                    <View style={[styles.categoryDot, { backgroundColor: selectedGame.color }]} />
                    <Text style={[styles.categoryPillText, { color: selectedGame.color }]}>
                      {selectedGame.category.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.sectionLabel}>SINOPSE</Text>
                <Text style={styles.modalDescription}>{selectedGame.desc}</Text>

                <Text style={styles.sectionLabel}>ESTATÍSTICAS</Text>
                <View style={styles.modalStats}>
                  <StatBox value={selectedGame.hours} label="TEMPO JOGADO" />
                  <StatBox value={`${selectedGame.rating}/5`} label="AVALIAÇÃO" />
                  <StatBox value={selectedGame.year} label="LANÇAMENTO" />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    activeOpacity={0.8}
                    onPress={() => setSelectedGame(null)}
                  >
                    <Text style={styles.primaryButtonText}>JOGAR AGORA</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.secondaryButton,
                      favorites.includes(selectedGame.id) && styles.secondaryButtonActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => toggleFavorite(selectedGame.id)}
                  >
                    <Text style={styles.secondaryButtonText}>
                      {favorites.includes(selectedGame.id) ? 'FAVORITADO' : 'FAVORITAR'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedGame(null)}>
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function GameCard({ game, isFavorite, onToggleFavorite, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={[styles.cardBanner, { backgroundColor: game.color }]}>
        <Image
          source={{ uri: game.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlayTop} />
        <View style={styles.imageOverlayBottom} />
        <View style={styles.cardRatingBadge}>
          <Text style={styles.cardRatingText}>★ {game.rating}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton} onPress={onToggleFavorite} hitSlop={8}>
          <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>{game.title}</Text>
        <View style={styles.cardMetaRow}>
          <View style={[styles.categoryDot, { backgroundColor: game.color }]} />
          <Text style={styles.cardCategory}>{game.category.toUpperCase()}</Text>
          <Text style={styles.cardSeparator}>·</Text>
          <Text style={styles.cardMetaText}>{game.platform}</Text>
        </View>
        <Text style={styles.cardHours}>{game.hours} jogadas · {game.year}</Text>
      </View>
    </TouchableOpacity>
  );
}

function TabButton({ label, active, count, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tabButton, active && styles.tabButtonActive]}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
      {count !== undefined && (
        <View style={[styles.tabBadge, active && styles.tabBadgeActive]}>
          <Text style={[styles.tabBadgeText, active && styles.tabBadgeTextActive]}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function StatBox({ value, label }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function AchievementItem({ title, description }) {
  return (
    <View style={styles.achievementRow}>
      <View style={styles.achievementCheck}>
        <Text style={styles.achievementCheckText}>✓</Text>
      </View>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{title}</Text>
        <Text style={styles.achievementDescription}>{description}</Text>
      </View>
    </View>
  );
}

function ProfileView({ favoriteGames }) {
  return (
    <ScrollView
      style={styles.profileScroll}
      contentContainerStyle={styles.profileContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>GG</Text>
        </View>
        <Text style={styles.profileName}>Gustavo Gomes</Text>
        <Text style={styles.profileRank}>Nível 42 · Rank Lendário</Text>
        <View style={styles.xpBarTrack}>
          <View style={styles.xpBarFill} />
        </View>
        <Text style={styles.xpBarLabel}>7.200 / 10.000 XP</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatBox value={GAMES.length} label="JOGOS" />
        <StatBox value={favoriteGames.length} label="FAVORITOS" />
        <StatBox value="1.890" label="HORAS" />
        <StatBox value="127" label="CONQUISTAS" />
      </View>

      <Text style={styles.sectionLabel}>CONQUISTAS RECENTES</Text>
      <View style={styles.achievementsList}>
        <AchievementItem title="Maratonista" description="100 horas registradas em um único mês." />
        <AchievementItem title="Mira de Ouro" description="1.000 abates certeiros em Valorant." />
        <AchievementItem title="Platina Completa" description="Progresso de 100% em Elden Ring." />
      </View>

      <Text style={styles.sectionLabel}>FAVORITOS ATUAIS</Text>
      {favoriteGames.length === 0 ? (
        <Text style={styles.emptyFavorites}>
          Nenhum favorito selecionado até o momento.
        </Text>
      ) : (
        favoriteGames.map((g) => (
          <View key={g.id} style={styles.favoriteRow}>
            <View style={[styles.categoryDot, { backgroundColor: g.color }]} />
            <View style={styles.favoriteRowInfo}>
              <Text style={styles.favoriteRowTitle}>{g.title}</Text>
              <Text style={styles.favoriteRowSub}>
                {g.category} · {g.hours}
              </Text>
            </View>
            <Text style={styles.favoriteRowRating}>★ {g.rating}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    paddingTop: 52,
  },
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  headerLogo: {
    color: THEME.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 3,
  },
  headerTagline: {
    color: THEME.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 4,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.accent,
  },
  avatarInitials: {
    color: THEME.accent,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },

  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: THEME.surfaceAlt,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: THEME.accent,
  },
  tabLabel: {
    color: THEME.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: THEME.surface,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  tabBadgeText: {
    color: THEME.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surfaceAlt,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: THEME.border,
    height: 46,
  },
  searchInput: {
    flex: 1,
    color: THEME.textPrimary,
    fontSize: 14,
  },
  clearText: {
    color: THEME.textTertiary,
    fontSize: 14,
    paddingLeft: 10,
  },

  categoryScrollView: {
    flexGrow: 0,
    flexShrink: 0,
  },
  categoryScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: THEME.surfaceAlt,
    borderWidth: 1,
    borderColor: THEME.border,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  chipActive: {
    backgroundColor: THEME.accentSoft,
    borderColor: THEME.accent,
  },
  chipText: {
    color: THEME.textSecondary,
    fontWeight: '600',
    fontSize: 11,
    letterSpacing: 1,
  },
  chipTextActive: {
    color: THEME.accent,
  },

  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  infoCount: {
    color: THEME.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  infoFilter: {
    color: THEME.textTertiary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 32,
  },
  cardSlot: {
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 16,
  },

  card: {
    backgroundColor: THEME.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  cardBanner: {
    aspectRatio: 16 / 9,
    overflow: 'hidden',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  imageOverlayTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9,9,11,0.18)',
  },
  imageOverlayBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '58%',
    backgroundColor: 'rgba(9,9,11,0.42)',
  },
  cardRatingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(9,9,11,0.82)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardRatingText: {
    color: THEME.gold,
    fontWeight: '700',
    fontSize: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(9,9,11,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  favoriteIcon: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  favoriteIconActive: {
    color: '#EF4444',
  },
  cardInfo: {
    padding: 14,
  },
  cardTitle: {
    color: THEME.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardCategory: {
    color: THEME.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  cardSeparator: {
    color: THEME.textTertiary,
    fontSize: 10,
  },
  cardMetaText: {
    color: THEME.textTertiary,
    fontSize: 11,
    fontWeight: '500',
  },
  cardHours: {
    color: THEME.textTertiary,
    fontSize: 11,
    marginTop: 6,
    fontWeight: '500',
  },

  emptyWrap: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    color: THEME.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  emptySubtitle: {
    color: THEME.textTertiary,
    marginTop: 6,
    fontSize: 13,
  },

  sectionLabel: {
    color: THEME.textTertiary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 22,
    marginBottom: 10,
  },

  profileScroll: {
    flex: 1,
    marginTop: 4,
  },
  profileContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: THEME.surface,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  profileAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: THEME.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.accent,
    marginBottom: 12,
  },
  profileAvatarText: {
    color: THEME.accent,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  profileName: {
    color: THEME.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  profileRank: {
    color: THEME.textSecondary,
    fontWeight: '600',
    fontSize: 12,
    marginTop: 4,
  },
  xpBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: THEME.border,
    borderRadius: 3,
    marginTop: 18,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    width: '72%',
    backgroundColor: THEME.accent,
    borderRadius: 3,
  },
  xpBarLabel: {
    color: THEME.textTertiary,
    fontSize: 11,
    marginTop: 8,
    fontWeight: '500',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  statBox: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: THEME.surface,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  statValue: {
    color: THEME.textPrimary,
    fontSize: 19,
    fontWeight: '800',
  },
  statLabel: {
    color: THEME.textTertiary,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: 1.2,
  },

  achievementsList: {
    gap: 10,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  achievementCheck: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(34,197,94,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.35)',
  },
  achievementCheckText: {
    color: THEME.success,
    fontSize: 13,
    fontWeight: '800',
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },
  achievementTitle: {
    color: THEME.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  achievementDescription: {
    color: THEME.textTertiary,
    fontSize: 11,
    marginTop: 2,
  },

  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 8,
  },
  favoriteRowInfo: {
    flex: 1,
    marginLeft: 12,
  },
  favoriteRowTitle: {
    color: THEME.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  favoriteRowSub: {
    color: THEME.textTertiary,
    fontSize: 11,
    marginTop: 2,
  },
  favoriteRowRating: {
    color: THEME.gold,
    fontWeight: '700',
    fontSize: 12,
  },
  emptyFavorites: {
    color: THEME.textTertiary,
    fontSize: 13,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: THEME.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '88%',
    width: '100%',
    maxWidth: 640,
    padding: 20,
  },
  modalImageWrap: {
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: THEME.bg,
  },
  modalImage: {
    ...StyleSheet.absoluteFillObject,
  },
  modalRatingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(9,9,11,0.82)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  modalRatingBadgeText: {
    color: THEME.gold,
    fontWeight: '700',
    fontSize: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  modalHeadingGroup: {
    flex: 1,
    marginRight: 12,
  },
  modalTitle: {
    color: THEME.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  modalMeta: {
    color: THEME.textTertiary,
    fontSize: 12,
    marginTop: 3,
    fontWeight: '500',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  modalDescription: {
    color: THEME.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  modalStats: {
    flexDirection: 'row',
    gap: 10,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: THEME.accent,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  secondaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: THEME.bg,
    borderWidth: 1,
    borderColor: THEME.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonActive: {
    backgroundColor: THEME.accentSoft,
    borderColor: THEME.accent,
  },
  secondaryButtonText: {
    color: THEME.textPrimary,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1.2,
  },
  closeButton: {
    marginTop: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: THEME.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
});
