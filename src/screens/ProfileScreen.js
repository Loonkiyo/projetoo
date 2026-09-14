import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { THEME, CONTENT_MAX_WIDTH } from '../data/theme';
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

export default function ProfileScreen() {
  const { favorites } = useFavorites();
  const favoriteMovies = useMemo(
    () => MOVIES.filter((m) => favorites.includes(m.id)),
    [favorites]
  );

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
  profileScroll: {
    flex: 1,
    backgroundColor: THEME.bg,
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

  sectionLabel: {
    color: THEME.textTertiary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 22,
    marginBottom: 10,
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
});
