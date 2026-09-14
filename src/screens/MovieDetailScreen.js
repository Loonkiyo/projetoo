import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { THEME } from '../data/theme';
import { MOVIES } from '../data/movies';
import { useFavorites } from '../context/FavoritesContext';

function StatBox({ value, label }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function MovieDetailScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const navigation = useNavigation();
  const route = useRoute();
  const { movieId } = route.params;
  const { width } = useWindowDimensions();

  const movie = useMemo(
    () => MOVIES.find((m) => m.id === movieId),
    [movieId]
  );

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Filme não encontrado.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFavorite = favorites.includes(movie.id);
  const cardWidth = Math.min(width - 32, 500);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.card, { width: cardWidth }]}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.imageWrap}>
            <Image
              source={{ uri: movie.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>★ {movie.rating}</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.header}>
              <View style={styles.headingGroup}>
                <Text style={styles.title}>{movie.title}</Text>
                <Text style={styles.meta}>
                  {movie.platform} · {movie.year}
                </Text>
              </View>
              <View style={[styles.categoryPill, { borderColor: movie.color }]}>
                <View style={[styles.categoryDot, { backgroundColor: movie.color }]} />
                <Text style={[styles.categoryPillText, { color: movie.color }]}>
                  {movie.category.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>SINOPSE</Text>
            <Text style={styles.description}>{movie.desc}</Text>

            <Text style={styles.sectionLabel}>DETALHES</Text>
            <View style={styles.stats}>
              <StatBox value={movie.duration} label="DURAÇÃO" />
              <StatBox value={`${movie.rating}/5`} label="AVALIAÇÃO" />
              <StatBox value={movie.year} label="LANÇAMENTO" />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={() => {}}
              >
                <Text style={styles.primaryButtonText}>ASSISTIR AGORA</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  isFavorite && styles.secondaryButtonActive,
                ]}
                activeOpacity={0.8}
                onPress={() => toggleFavorite(movie.id)}
              >
                <Text style={styles.secondaryButtonText}>
                  {isFavorite ? 'FAVORITADO' : 'FAVORITAR'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: THEME.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: THEME.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  backLink: {
    color: THEME.accent,
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },

  card: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.border,
  },

  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(9,9,11,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  imageWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: THEME.bg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9,9,11,0.18)',
  },
  ratingBadge: {
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
  ratingBadgeText: {
    color: THEME.gold,
    fontWeight: '700',
    fontSize: 12,
  },

  cardBody: {
    padding: 18,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headingGroup: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: THEME.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  meta: {
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

  sectionLabel: {
    color: THEME.textTertiary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 18,
    marginBottom: 8,
  },
  description: {
    color: THEME.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: THEME.bg,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  statValue: {
    color: THEME.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  statLabel: {
    color: THEME.textTertiary,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 1.2,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: THEME.accent,
    paddingVertical: 13,
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
    paddingVertical: 13,
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
});
