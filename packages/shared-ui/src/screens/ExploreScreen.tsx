import { useNavigation } from '@react-navigation/native';
import { DrawerActions, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Direction } from '@bam.tech/lrud';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationRoot,
} from 'react-tv-space-navigation';

import { useMenuContext } from '../components/MenuContext';
import {
  discoverContent,
  type DiscoveryResultItem,
  type DiscoveryIntent,
  type ContentOrigin,
} from '../data/discoverService';
import { scaledPixels } from '../hooks/useScale';
import { colors } from '../theme/colors';
import { safeZones } from '../theme';
import { getOpenDrawerDirection } from '../utils/rtl';
import { RootStackParamList } from '../navigation/types';

// ── Suggestion chips ───────────────────────────────────────────────────────

const SUGGESTIONS = [
  'Something dark and cinematic under 90 minutes',
  'A funny light comedy for the weekend',
  'Romantic drama under 2 hours',
  'A mysterious sci-fi thriller',
  'Family movie night — something fun for everyone',
  'Something like Blade Runner but shorter',
];

// ── Intent summary component ───────────────────────────────────────────────

function IntentSummary({ intent }: { intent: DiscoveryIntent }) {
  const parts: string[] = [];
  if (intent.mood) parts.push(`mood: ${intent.mood}`);
  if (intent.cinematic) parts.push('cinematic');
  if (intent.maxDurationMinutes) parts.push(`≤ ${intent.maxDurationMinutes} min`);
  if (intent.genres.length > 0) parts.push(intent.genres.join(', '));
  if (intent.watchingContext) parts.push(`context: ${intent.watchingContext}`);
  if (intent.familyMode) parts.push('family mode ✓');

  if (parts.length === 0) return null;

  return (
    <View style={intentStyles.container}>
      <Text style={intentStyles.label}>Understood: </Text>
      <Text style={intentStyles.value} numberOfLines={2}>
        {parts.join('  ·  ')}
      </Text>
    </View>
  );
}

const intentStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.card,
    borderRadius: scaledPixels(6),
    borderWidth: scaledPixels(1),
    borderColor: colors.border,
    paddingHorizontal: scaledPixels(16),
    paddingVertical: scaledPixels(10),
    marginBottom: scaledPixels(20),
    alignItems: 'flex-start',
  },
  label: {
    fontSize: scaledPixels(18),
    color: colors.textTertiary,
    fontWeight: '600',
  },
  value: {
    fontSize: scaledPixels(18),
    color: colors.primary,
    flex: 1,
    flexWrap: 'wrap',
  },
});

// ── Main screen ────────────────────────────────────────────────────────────

type ExploreNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function ExploreScreen() {
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;
  const navigation = useNavigation<ExploreNavProp>();
  const [focusedIndex, setFocusedIndex] = useState(0);

  const [query, setQuery] = useState('');
  const [familyMode, setFamilyMode] = useState(false);
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const [results, setResults] = useState<DiscoveryResultItem[]>([]);
  const [intent, setIntent] = useState<DiscoveryIntent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string | null>(null);

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === getOpenDrawerDirection() && focusedIndex === 0) {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, focusedIndex, navigation],
  );

  const runDiscover = useCallback(
    async (q: string, fm: boolean) => {
      const trimmed = q.trim();
      if (!trimmed) return;

      setIsLoading(true);
      setError(null);
      setLastQuery(trimmed);
      setIntent(null);

      try {
        const data = await discoverContent({ query: trimmed, familyMode: fm });
        setResults(data.results);
        setIntent(data.intent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Discovery failed');
        setResults([]);
        setIntent(null);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const handleSuggestion = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      runDiscover(suggestion, familyMode);
    },
    [runDiscover, familyMode],
  );

  const handleFamilyModeToggle = useCallback(() => {
    setFamilyMode((prev) => {
      const next = !prev;
      // Re-run current query with updated familyMode if one exists
      if (lastQuery) {
        runDiscover(lastQuery, next);
      }
      return next;
    });
  }, [lastQuery, runDiscover]);

  const handleResultSelect = useCallback(
    (item: DiscoveryResultItem) => {
      navigation.navigate('Details', {
        title: item.title,
        description: item.description,
        // Use a placeholder image — catalog items don't have poster URLs yet
        headerImage:
          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&q=80',
        movie: item.id,
        genres: item.genres,
        contentRating: item.contentRating,
        // duration in seconds (DetailsScreen formats from seconds)
        duration: item.durationMinutes * 60,
      });
    },
    [navigation],
  );

  return (
    <SpatialNavigationRoot
      isActive={isActive}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <Text style={styles.title}>AI Discovery</Text>
        <Text style={styles.subtitle}>Describe what you want to watch</Text>

        {/* Search input */}
        <DefaultFocus>
          <SpatialNavigationFocusableView
            onSelect={() => {/* TextInput handles its own focus */}}
            onFocus={() => setFocusedIndex(0)}
          >
            {({ isFocused: inputFocused }) => (
              <View
                style={[
                  styles.inputContainer,
                  inputFocused && styles.inputContainerFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="e.g. something dark and cinematic under 90 min"
                  placeholderTextColor={colors.textTertiary}
                  onSubmitEditing={() => runDiscover(query, familyMode)}
                  returnKeyType="search"
                  blurOnSubmit={false}
                />
              </View>
            )}
          </SpatialNavigationFocusableView>
        </DefaultFocus>

        {/* Family Mode toggle */}
        <SpatialNavigationFocusableView
          onSelect={handleFamilyModeToggle}
          onFocus={() => setFocusedIndex(1)}
        >
          {({ isFocused: toggleFocused }) => (
            <View
              style={[
                styles.familyModeRow,
                toggleFocused && styles.familyModeRowFocused,
                familyMode && styles.familyModeRowActive,
              ]}
            >
              <View style={styles.familyModeTextBlock}>
                <Text style={styles.familyModeLabel}>
                  👨‍👩‍👧  Family Mode
                </Text>
                <Text style={styles.familyModeHint}>
                  {familyMode
                    ? 'ON — Only G, PG, PG-13 content shown'
                    : 'OFF — Tap to enable safe content filter'}
                </Text>
              </View>
              {/* Visual toggle indicator */}
              <View
                style={[
                  styles.toggleTrack,
                  familyMode && styles.toggleTrackOn,
                ]}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    familyMode && styles.toggleKnobOn,
                  ]}
                />
              </View>
            </View>
          )}
        </SpatialNavigationFocusableView>

        {/* Advanced Mode button (Coming Soon) */}
        <SpatialNavigationFocusableView
          onSelect={() => setIsAdvancedModalOpen(true)}
          onFocus={() => setFocusedIndex(2)}
        >
          {({ isFocused: advancedFocused }) => (
            <View
              style={[
                styles.advancedModeButton,
                advancedFocused && styles.advancedModeButtonFocused,
              ]}
            >
              <Text style={styles.advancedModeText}>⚙️  Advanced Mode</Text>
              <Text style={styles.comingSoonBadge}>Coming Soon</Text>
            </View>
          )}
        </SpatialNavigationFocusableView>

        {/* Suggestion chips */}
        <View style={styles.suggestionsRow}>
          {SUGGESTIONS.map((suggestion, index) => (
            <SpatialNavigationFocusableView
              key={index}
              onSelect={() => handleSuggestion(suggestion)}
              onFocus={() => setFocusedIndex(index + 10)}
            >
              {({ isFocused: chipFocused }) => (
                <View
                  style={[
                    styles.chip,
                    chipFocused && styles.chipFocused,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      chipFocused && styles.chipTextFocused,
                    ]}
                    numberOfLines={2}
                  >
                    {suggestion}
                  </Text>
                </View>
              )}
            </SpatialNavigationFocusableView>
          ))}
        </View>

        {/* Loading */}
        {isLoading && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.statusText}>Analyzing your request…</Text>
          </View>
        )}

        {/* Error */}
        {!isLoading && error && (
          <View style={styles.statusContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Results */}
        {!isLoading && !error && results.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              Results for "{lastQuery}"
              {familyMode && (
                <Text style={styles.familyActiveBadge}> · 👨‍👩‍👧 Family Mode</Text>
              )}
            </Text>

            {/* Intent summary */}
            {intent && <IntentSummary intent={intent} />}

            {results.map((item, index) => (
              <SpatialNavigationFocusableView
                key={item.id}
                onSelect={() => handleResultSelect(item)}
                onFocus={() => setFocusedIndex(index + 100)}
              >
                {({ isFocused: cardFocused }) => (
                  <View
                    style={[
                      styles.resultCard,
                      cardFocused && styles.resultCardFocused,
                    ]}
                  >
                    <View style={styles.resultCardHeader}>
                      <Text style={styles.resultTitle}>{item.title}</Text>
                      {item.contentRating && (
                        <View style={styles.ratingBadge}>
                          <Text style={styles.ratingBadgeText}>
                            {item.contentRating}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.resultMeta}>
                      {item.durationMinutes} min
                      {item.genres.length > 0
                        ? `  ·  ${item.genres.join(', ')}`
                        : ''}
                      {item.cinematic ? '  ·  Cinematic' : ''}
                      {item.familySafe ? '  ·  ✓ Family Safe' : ''}
                      {item.origin === 'founder' ? '  ·  🎬 Vid30 Original' : ''}
                    </Text>
                    <Text style={styles.resultDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                    {cardFocused && (
                      <Text style={styles.selectHint}>Press Select to view details</Text>
                    )}
                  </View>
                )}
              </SpatialNavigationFocusableView>
            ))}
          </View>
        )}

        {/* Empty state */}
        {!isLoading && !error && results.length === 0 && lastQuery && (
          <View style={styles.statusContainer}>
            {intent && <IntentSummary intent={intent} />}
            <Text style={styles.statusText}>
              {familyMode
                ? `No family-safe content found for "${lastQuery}"`
                : `No results found for "${lastQuery}"`}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Advanced Mode modal (Coming Soon) */}
      {isAdvancedModalOpen && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalPanel}>
            <Text style={styles.modalTitle}>Advanced Mode</Text>
            <Text style={styles.modalBadge}>Coming Soon</Text>
            
            <Text style={styles.modalDescription}>
              Advanced Mode will let you customize discovery with bring-your-own-key (BYOK) AI models.
            </Text>
            
            <View style={styles.modalFeatures}>
              <Text style={styles.modalFeaturesTitle}>Planned Features:</Text>
              <Text style={styles.modalFeatureItem}>• Connect your own AI provider</Text>
              <Text style={styles.modalFeatureItem}>• Fine-tune recommendation logic</Text>
              <Text style={styles.modalFeatureItem}>• Custom content filtering rules</Text>
              <Text style={styles.modalFeatureItem}>• Personalized discovery profiles</Text>
            </View>
            
            <Text style={styles.modalHint}>
              We're building this now. Check back soon or contact us for early access.
            </Text>
            
            <View style={styles.modalButtonRow}>
              <View style={{ flex: 1 }} />
              <SpatialNavigationFocusableView
                onSelect={() => setIsAdvancedModalOpen(false)}
                onFocus={() => setFocusedIndex(9999)}
              >
                {({ isFocused: btnFocused }) => (
                  <View
                    style={[
                      styles.modalCloseButton,
                      btnFocused && styles.modalCloseButtonFocused,
                    ]}
                  >
                    <Text style={styles.modalCloseButtonText}>Got It</Text>
                  </View>
                )}
              </SpatialNavigationFocusableView>
            </View>
          </View>
        </View>
      )}
    </SpatialNavigationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: scaledPixels(safeZones.titleSafe.horizontal),
    paddingTop: scaledPixels(safeZones.titleSafe.vertical),
    paddingBottom: scaledPixels(safeZones.titleSafe.vertical),
  },
  title: {
    fontSize: scaledPixels(48),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: scaledPixels(8),
  },
  subtitle: {
    fontSize: scaledPixels(24),
    color: colors.textSecondary,
    marginBottom: scaledPixels(32),
  },

  // ── Search input ──────────────────────────────────────────────────────
  inputContainer: {
    backgroundColor: colors.cardElevated,
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(3),
    borderColor: 'transparent',
    paddingHorizontal: scaledPixels(24),
    paddingVertical: scaledPixels(16),
    marginBottom: scaledPixels(16),
  },
  inputContainerFocused: {
    borderColor: colors.focusBorder,
    backgroundColor: colors.card,
  },
  input: {
    fontSize: scaledPixels(28),
    color: colors.text,
  },

  // ── Family Mode toggle ────────────────────────────────────────────────
  familyModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(3),
    borderColor: 'transparent',
    paddingHorizontal: scaledPixels(24),
    paddingVertical: scaledPixels(14),
    marginBottom: scaledPixels(24),
    gap: scaledPixels(16),
  },
  familyModeRowFocused: {
    borderColor: colors.focusBorder,
    backgroundColor: colors.cardElevated,
    transform: [{ scale: 1.02 }],
  },
  familyModeRowActive: {
    borderColor: colors.success,
  },
  familyModeTextBlock: {
    flex: 1,
  },
  familyModeLabel: {
    fontSize: scaledPixels(24),
    fontWeight: '700',
    color: colors.text,
    marginBottom: scaledPixels(4),
  },
  familyModeHint: {
    fontSize: scaledPixels(18),
    color: colors.textTertiary,
  },
  toggleTrack: {
    width: scaledPixels(60),
    height: scaledPixels(32),
    borderRadius: scaledPixels(16),
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: scaledPixels(3),
    flexShrink: 0,
  },
  toggleTrackOn: {
    backgroundColor: colors.success,
  },
  toggleKnob: {
    width: scaledPixels(26),
    height: scaledPixels(26),
    borderRadius: scaledPixels(13),
    backgroundColor: colors.text,
    alignSelf: 'flex-start',
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },

  // ── Suggestions ────────────────────────────────────────────────────────
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaledPixels(16),
    marginBottom: scaledPixels(40),
  },
  chip: {
    backgroundColor: colors.card,
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: colors.border,
    paddingHorizontal: scaledPixels(20),
    paddingVertical: scaledPixels(12),
    maxWidth: scaledPixels(400),
  },
  chipFocused: {
    backgroundColor: colors.focusBackground,
    borderColor: colors.focusBorder,
    transform: [{ scale: 1.05 }],
  },
  chipText: {
    fontSize: scaledPixels(20),
    color: colors.textSecondary,
  },
  chipTextFocused: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },

  // ── Status ─────────────────────────────────────────────────────────────
  statusContainer: {
    alignItems: 'center',
    marginTop: scaledPixels(40),
    gap: scaledPixels(16),
    paddingBottom: scaledPixels(40),
  },
  statusText: {
    fontSize: scaledPixels(24),
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: scaledPixels(24),
    color: colors.error,
    textAlign: 'center',
  },

  // ── Results ────────────────────────────────────────────────────────────
  resultsSection: {
    paddingBottom: scaledPixels(60),
  },
  resultsTitle: {
    fontSize: scaledPixels(28),
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: scaledPixels(16),
  },
  familyActiveBadge: {
    color: colors.success,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: 'transparent',
    padding: scaledPixels(24),
    marginBottom: scaledPixels(16),
  },
  resultCardFocused: {
    backgroundColor: colors.cardElevated,
    borderColor: colors.focusBorder,
    transform: [{ scale: 1.02 }],
  },
  resultCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(12),
    marginBottom: scaledPixels(8),
  },
  resultTitle: {
    fontSize: scaledPixels(32),
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: colors.cardElevated,
    borderRadius: scaledPixels(4),
    borderWidth: scaledPixels(1),
    borderColor: colors.border,
    paddingHorizontal: scaledPixels(10),
    paddingVertical: scaledPixels(4),
  },
  ratingBadgeText: {
    fontSize: scaledPixels(18),
    color: colors.textSecondary,
    fontWeight: '700',
  },
  resultMeta: {
    fontSize: scaledPixels(20),
    color: colors.primary,
    marginBottom: scaledPixels(8),
  },
  resultDescription: {
    fontSize: scaledPixels(22),
    color: colors.textSecondary,
    lineHeight: scaledPixels(32),
  },
  selectHint: {
    fontSize: scaledPixels(18),
    color: colors.textTertiary,
    marginTop: scaledPixels(8),
    fontStyle: 'italic',
  },

  // ── Advanced Mode button ──────────────────────────────────────────────
  advancedModeButton: {
    backgroundColor: colors.card,
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: colors.border,
    paddingHorizontal: scaledPixels(24),
    paddingVertical: scaledPixels(12),
    marginBottom: scaledPixels(24),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  advancedModeButtonFocused: {
    backgroundColor: colors.cardElevated,
    borderColor: colors.focusBorder,
    transform: [{ scale: 1.02 }],
  },
  advancedModeText: {
    fontSize: scaledPixels(24),
    fontWeight: '600',
    color: colors.textSecondary,
  },
  comingSoonBadge: {
    backgroundColor: colors.cardElevated,
    color: colors.primary,
    fontSize: scaledPixels(16),
    fontWeight: '700',
    paddingHorizontal: scaledPixels(12),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(4),
  },

  // ── Advanced Mode modal ───────────────────────────────────────────────
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 101,
  },
  modalPanel: {
    backgroundColor: colors.card,
    borderRadius: scaledPixels(12),
    borderWidth: scaledPixels(1),
    borderColor: colors.border,
    padding: scaledPixels(32),
    maxWidth: scaledPixels(600),
    width: '90%',
    gap: scaledPixels(16),
  },
  modalTitle: {
    fontSize: scaledPixels(36),
    fontWeight: '700',
    color: colors.text,
  },
  modalBadge: {
    fontSize: scaledPixels(16),
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.05,
  },
  modalDescription: {
    fontSize: scaledPixels(24),
    color: colors.textSecondary,
    lineHeight: scaledPixels(36),
  },
  modalFeatures: {
    backgroundColor: colors.background,
    borderRadius: scaledPixels(8),
    padding: scaledPixels(16),
    gap: scaledPixels(8),
  },
  modalFeaturesTitle: {
    fontSize: scaledPixels(22),
    fontWeight: '600',
    color: colors.text,
    marginBottom: scaledPixels(8),
  },
  modalFeatureItem: {
    fontSize: scaledPixels(20),
    color: colors.textSecondary,
    lineHeight: scaledPixels(32),
  },
  modalHint: {
    fontSize: scaledPixels(20),
    color: colors.textTertiary,
    fontStyle: 'italic',
    lineHeight: scaledPixels(32),
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: scaledPixels(12),
    marginTop: scaledPixels(12),
  },
  modalCloseButton: {
    backgroundColor: colors.primary,
    borderRadius: scaledPixels(8),
    paddingHorizontal: scaledPixels(32),
    paddingVertical: scaledPixels(12),
  },
  modalCloseButtonFocused: {
    backgroundColor: colors.success,
    transform: [{ scale: 1.05 }],
  },
  modalCloseButtonText: {
    fontSize: scaledPixels(24),
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
});
