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
  bg: '#0F0F12',
  surface: '#1A1A1E',
  surfaceAlt: '#141416',
  border: '#2A2A30',
  textPrimary: '#F4F4F5',
  textSecondary: '#A1A1AA',
  textTertiary: '#71717A',
  accent: '#E50914',
  accentSoft: 'rgba(229,9,20,0.15)',
  gold: '#FACC15',
  success: '#22C55E',
};

const CONTENT_MAX_WIDTH = 1120;

const MOVIES = [
  {
    id: '1',
    title: 'Duna: Parte 2',
    category: 'Ficção Científica',
    rating: '4.8',
    platform: 'Denis Villeneuve',
    year: '2024',
    duration: '2h 46m',
    color: '#E50914',
    desc: 'Paul Atreides se une aos Fremen para travar guerra contra a Casa Harkonnen. Épico sci-fi com fotografia grandiosa e trilha de Hans Zimmer.',
    image: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  },
  {
    id: '2',
    title: 'Oppenheimer',
    category: 'Drama',
    rating: '4.9',
    platform: 'Christopher Nolan',
    year: '2023',
    duration: '3h 01m',
    color: '#C9A86A',
    desc: 'A história do físico J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica. Vencedor do Oscar de Melhor Filme.',
    image: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  },
  {
    id: '3',
    title: 'Homem-Aranha: Através do Aranhaverso',
    category: 'Animação',
    rating: '4.8',
    platform: 'Joaquim Dos Santos',
    year: '2023',
    duration: '2h 20m',
    color: '#E50914',
    desc: 'Miles Morales atravessa o multiverso e encontra uma equipe de Pessoas-Aranha encarregada de proteger sua existência.',
    image: 'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tCdSvY0c5yGK3nsRL.jpg',
  },
  {
    id: '4',
    title: 'John Wick 4: Baba Yaga',
    category: 'Ação',
    rating: '4.6',
    platform: 'Chad Stahelski',
    year: '2023',
    duration: '2h 49m',
    color: '#27272A',
    desc: 'John Wick descobre um caminho para derrotar a Alta Cúpula, mas precisa enfrentar um novo inimigo com alianças poderosas.',
    image: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
  },
  {
    id: '5',
    title: 'Parasita',
    category: 'Drama',
    rating: '4.9',
    platform: 'Bong Joon-ho',
    year: '2019',
    duration: '2h 12m',
    color: '#A16207',
    desc: 'Família desempregada se infiltra na casa de uma família rica, desencadeando uma série de eventos inesperados. Palma de Ouro e Oscar.',
    image: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
  },
  {
    id: '6',
    title: 'Vingadores: Ultimato',
    category: 'Ação',
    rating: '4.7',
    platform: 'Anthony Russo',
    year: '2019',
    duration: '3h 01m',
    color: '#7F1D1D',
    desc: 'Após Thanos eliminar metade das criaturas vivas, os Vingadores precisam se reunir para desfazer suas ações e restaurar a ordem.',
    image: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
  },
  {
    id: '7',
    title: 'Interestelar',
    category: 'Ficção Científica',
    rating: '4.9',
    platform: 'Christopher Nolan',
    year: '2014',
    duration: '2h 49m',
    color: '#0E7490',
    desc: 'Um grupo de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.',
    image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  },
  {
    id: '8',
    title: 'O Poderoso Chefão',
    category: 'Crime',
    rating: '4.9',
    platform: 'Francis Ford Coppola',
    year: '1972',
    duration: '2h 55m',
    color: '#44403C',
    desc: 'O patriarca de uma dinastia do crime organizado transfere o controle de seu império clandestino para seu filho relutante.',
    image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
  },
];

const CATEGORIES = ['Todos', 'Ação', 'Ficção Científica', 'Drama', 'Animação', 'Crime'];

export default function App() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('Todos');
  const [favorites, setFavorites] = useState(['1', '3']);
  const [tab, setTab] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { width } = useWindowDimensions();
  const columns = width >= 1280 ? 3 : width >= 820 ? 2 : 1;

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const favoriteMovies = useMemo(
    () => MOVIES.filter((m) => favorites.includes(m.id)),
    [favorites]
  );

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedCat = activeCat.trim().toLowerCase();
    return MOVIES.filter((m) => {
      const matchSearch = !normalizedSearch || m.title.toLowerCase().includes(normalizedSearch);
      const matchCategory = normalizedCat === 'todos' || m.category.trim().toLowerCase() === normalizedCat;
      const matchTab = tab !== 'favs' || favorites.includes(m.id);
      return matchSearch && matchCategory && matchTab;
    });
  }, [search, activeCat, favorites, tab]);

  const renderCard = ({ item }) => (
    <View style={styles.cardSlot}>
      <MovieCard
        movie={item}
        isFavorite={favorites.includes(item.id)}
        onToggleFavorite={() => toggleFavorite(item.id)}
        onPress={() => setSelectedMovie(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.screen}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLogo}>CINEVAULT</Text>
            <Text style={styles.headerTagline}>SUA CINEMATECA</Text>
          </View>
          <View style={styles.headerAvatar}>
            <Text style={styles.avatarInitials}>CV</Text>
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
          <ProfileView favoriteMovies={favoriteMovies} />
        ) : (
          <>
            <View style={styles.searchWrap}>
              <TextInput
                placeholder="Buscar por filme..."
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
              <Text style={styles.infoCount}>{filtered.length} filmes</Text>
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
                  <Text style={styles.emptyTitle}>Nenhum filme encontrado</Text>
                  <Text style={styles.emptySubtitle}>
                    Ajuste a busca ou selecione outro gênero.
                  </Text>
                </View>
              }
            />
          </>
        )}
      </View>

      <Modal
        visible={!!selectedMovie}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedMovie(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMovie && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.modalImageWrap]}>
                  <Image
                    source={{ uri: selectedMovie.image }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlayTop} />
                  <View style={styles.imageOverlayBottom} />
                  <View style={styles.modalRatingBadge}>
                    <Text style={styles.modalRatingBadgeText}>★ {selectedMovie.rating}</Text>
                  </View>
                </View>

                <View style={styles.modalHeader}>
                  <View style={styles.modalHeadingGroup}>
                    <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                    <Text style={styles.modalMeta}>
                      {selectedMovie.platform} · {selectedMovie.year}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.categoryPill,
                      { borderColor: selectedMovie.color },
                    ]}
                  >
                    <View style={[styles.categoryDot, { backgroundColor: selectedMovie.color }]} />
                    <Text style={[styles.categoryPillText, { color: selectedMovie.color }]}>
                      {selectedMovie.category.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.sectionLabel}>SINOPSE</Text>
                <Text style={styles.modalDescription}>{selectedMovie.desc}</Text>

                <Text style={styles.sectionLabel}>DETALHES</Text>
                <View style={styles.modalStats}>
                  <StatBox value={selectedMovie.duration} label="DURAÇÃO" />
                  <StatBox value={`${selectedMovie.rating}/5`} label="AVALIAÇÃO" />
                  <StatBox value={selectedMovie.year} label="LANÇAMENTO" />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    activeOpacity={0.8}
                    onPress={() => setSelectedMovie(null)}
                  >
                    <Text style={styles.primaryButtonText}>ASSISTIR AGORA</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.secondaryButton,
                      favorites.includes(selectedMovie.id) && styles.secondaryButtonActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => toggleFavorite(selectedMovie.id)}
                  >
                    <Text style={styles.secondaryButtonText}>
                      {favorites.includes(selectedMovie.id) ? 'FAVORITADO' : 'FAVORITAR'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedMovie(null)}>
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

function MovieCard({ movie, isFavorite, onToggleFavorite, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={[styles.cardBanner, { backgroundColor: movie.color }]}>
        <Image
          source={{ uri: movie.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlayTop} />
        <View style={styles.imageOverlayBottom} />
        <View style={styles.cardRatingBadge}>
          <Text style={styles.cardRatingText}>★ {movie.rating}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton} onPress={onToggleFavorite} hitSlop={8}>
          <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>{movie.title}</Text>
        <View style={styles.cardMetaRow}>
          <View style={[styles.categoryDot, { backgroundColor: movie.color }]} />
          <Text style={styles.cardCategory}>{movie.category.toUpperCase()}</Text>
          <Text style={styles.cardSeparator}>·</Text>
          <Text style={styles.cardMetaText}>{movie.platform}</Text>
        </View>
        <Text style={styles.cardHours}>{movie.duration} · {movie.year}</Text>
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

function ProfileView({ favoriteMovies }) {
  return (
    <ScrollView
      style={styles.profileScroll}
      contentContainerStyle={styles.profileContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>CV</Text>
        </View>
        <Text style={styles.profileName}>Cinevault</Text>
        <Text style={styles.profileRank}>Nível 42 · Cinéfilo Lendário</Text>
        <View style={styles.xpBarTrack}>
          <View style={styles.xpBarFill} />
        </View>
        <Text style={styles.xpBarLabel}>7.200 / 10.000 XP</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatBox value={MOVIES.length} label="FILMES" />
        <StatBox value={favoriteMovies.length} label="FAVORITOS" />
        <StatBox value="324" label="HORAS" />
        <StatBox value="127" label="AVALIAÇÕES" />
      </View>

      <Text style={styles.sectionLabel}>CONQUISTAS RECENTES</Text>
      <View style={styles.achievementsList}>
        <AchievementItem title="Maratonista" description="50 filmes assistidos em um único mês." />
        <AchievementItem title="Crítico de Ouro" description="500 avaliações com nota máxima." />
        <AchievementItem title="Cinéfilo Completo" description="Assistiu todos os vencedores do Oscar 2023." />
      </View>

      <Text style={styles.sectionLabel}>FAVORITOS ATUAIS</Text>
      {favoriteMovies.length === 0 ? (
        <Text style={styles.emptyFavorites}>
          Nenhum favorito selecionado até o momento.
        </Text>
      ) : (
        favoriteMovies.map((m) => (
          <View key={m.id} style={styles.favoriteRow}>
            <View style={[styles.categoryDot, { backgroundColor: m.color }]} />
            <View style={styles.favoriteRowInfo}>
              <Text style={styles.favoriteRowTitle}>{m.title}</Text>
              <Text style={styles.favoriteRowSub}>
                {m.category} · {m.duration}
              </Text>
            </View>
            <Text style={styles.favoriteRowRating}>★ {m.rating}</Text>
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
