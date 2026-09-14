import React, { useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME, CONTENT_MAX_WIDTH } from '../data/theme';
import { MOVIES } from '../data/movies';
import { useFavorites } from '../context/FavoritesContext';

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

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const columns = width >= 1280 ? 3 : width >= 820 ? 2 : 1;

  const favoriteMovies = useMemo(
    () => MOVIES.filter((m) => favorites.includes(m.id)),
    [favorites]
  );

  const handleMoviePress = useCallback((movie) => {
    navigation.navigate('MovieDetail', { movieId: movie.id });
  }, [navigation]);

  const renderCard = useCallback(({ item }) => (
    <View style={styles.cardSlot}>
      <MovieCard
        movie={item}
        isFavorite={favorites.includes(item.id)}
        onToggleFavorite={() => toggleFavorite(item.id)}
        onPress={() => handleMoviePress(item)}
      />
    </View>
  ), [favorites, toggleFavorite, handleMoviePress]);

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <View style={styles.infoBar}>
          <Text style={styles.infoCount}>{favoriteMovies.length} filmes</Text>
          <Text style={styles.infoFilter}>FAVORITOS</Text>
        </View>

        <FlatList
          key={`grid-${columns}`}
          data={favoriteMovies}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          numColumns={columns}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>♡</Text>
              <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
              <Text style={styles.emptySubtitle}>
                Toque no ícone de coração nos filmes para adicioná-los aos favoritos.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
  },

  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginTop: 16,
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
  emptyIcon: {
    color: THEME.textTertiary,
    fontSize: 48,
    marginBottom: 16,
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
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
