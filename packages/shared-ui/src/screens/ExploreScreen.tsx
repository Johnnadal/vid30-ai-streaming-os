import { useNavigation } from '@react-navigation/native';
import { DrawerActions, useIsFocused } from '@react-navigation/native';
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
import { discoverContent, DiscoveryResultItem } from '../data/discoverService';
import { scaledPixels } from '../hooks/useScale';
import { colors } from '../theme/colors';
import { safeZones } from '../theme';
import { getOpenDrawerDirection } from '../utils/rtl';

// Quick suggestion chips for TV D-pad users who can't type easily
const SUGGESTIONS = [
  'Something dark and cinematic under 90 minutes',
  'A funny light comedy for the weekend',
  'Romantic drama under 2 hours',
  'A mysterious sci-fi thriller',
];

export default function ExploreScreen() {
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;
  const navigation = useNavigation();
  const [focusedIndex, setFocusedIndex] = useState(0);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DiscoveryResultItem[]>([]);
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

  const runDiscover = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);
    setLastQuery(trimmed);

    try {
      const data = await discoverContent(trimmed);
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Discovery failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSuggestion = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      runDiscover(suggestion);
    },
    [runDiscover],
  );

  return (
    <SpatialNavigationRoot
      isActive={isActive}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
    >
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>AI Discovery</Text>
        <Text style={styles.subtitle}>
          Describe what you want to watch
        </Text>

        {/* Search input */}
        <DefaultFocus>
          <SpatialNavigationFocusableView
            onSelect={() => {/* TextInput handles its own focus */}}
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
                  onSubmitEditing={() => runDiscover(query)}
                  returnKeyType="search"
                  blurOnSubmit={false}
                />
              </View>
            )}
          </SpatialNavigationFocusableView>
        </DefaultFocus>

        {/* Suggestion chips */}
        <View style={styles.suggestionsRow}>
          {SUGGESTIONS.map((suggestion, index) => (
            <SpatialNavigationFocusableView
              key={index}
              onSelect={() => handleSuggestion(suggestion)}
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
            </Text>
            <ScrollView
              horizontal={false}
              showsVerticalScrollIndicator={false}
            >
              {results.map((item, index) => (
                <SpatialNavigationFocusableView
                  key={item.id}
                  onFocus={() => setFocusedIndex(index + 10)}
                >
                  {({ isFocused: cardFocused }) => (
                    <View
                      style={[
                        styles.resultCard,
                        cardFocused && styles.resultCardFocused,
                      ]}
                    >
                      <Text style={styles.resultTitle}>{item.title}</Text>
                      <Text style={styles.resultMeta}>
                        {item.durationMinutes} min
                        {item.genres.length > 0
                          ? `  ·  ${item.genres.join(', ')}`
                          : ''}
                        {item.cinematic ? '  ·  Cinematic' : ''}
                      </Text>
                      <Text style={styles.resultDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    </View>
                  )}
                </SpatialNavigationFocusableView>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Empty state */}
        {!isLoading && !error && results.length === 0 && lastQuery && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              No results found for "{lastQuery}"
            </Text>
          </View>
        )}
      </View>
    </SpatialNavigationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: scaledPixels(safeZones.titleSafe.horizontal),
    paddingVertical: scaledPixels(safeZones.titleSafe.vertical),
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
  inputContainer: {
    backgroundColor: colors.cardElevated,
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(3),
    borderColor: 'transparent',
    paddingHorizontal: scaledPixels(24),
    paddingVertical: scaledPixels(16),
    marginBottom: scaledPixels(24),
  },
  inputContainerFocused: {
    borderColor: colors.focusBorder,
    backgroundColor: colors.card,
  },
  input: {
    fontSize: scaledPixels(28),
    color: colors.text,
  },
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
  statusContainer: {
    alignItems: 'center',
    marginTop: scaledPixels(40),
    gap: scaledPixels(16),
  },
  statusText: {
    fontSize: scaledPixels(24),
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: scaledPixels(24),
    color: colors.error,
  },
  resultsSection: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: scaledPixels(28),
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: scaledPixels(20),
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
  resultTitle: {
    fontSize: scaledPixels(32),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: scaledPixels(8),
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
});
