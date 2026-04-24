import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { products, CATEGORIES, formatPrice } from '../data/products';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const SORT_OPTIONS = [
  { id: 'default', label: 'Relevan' },
  { id: 'price_asc', label: 'Harga ↑' },
  { id: 'price_desc', label: 'Harga ↓' },
  { id: 'rating', label: 'Rating ★' },
];

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isGridView, setIsGridView] = useState(false);
  const [isSectionMode, setIsSectionMode] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ─── Pull to Refresh ─────────────────────────────────
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshKey((k) => k + 1);
      setSearchQuery('');
      setSelectedCategory('Semua');
      setSortBy('default');
      setRefreshing(false);
    }, 1200);
  }, []);

  // ─── Filter & Sort (useMemo) ─────────────────────────
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter kategori
    if (selectedCategory !== 'Semua') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search real-time
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, refreshKey]);

  // ─── SectionList data ────────────────────────────────
  const sectionData = useMemo(() => {
    const map = {};
    filteredProducts.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return Object.keys(map).map((cat) => ({
      title: cat,
      data: map[cat],
    }));
  }, [filteredProducts]);

  // ─── Render helpers ──────────────────────────────────
  const renderItem = useCallback(
    ({ item }) => (
      <ProductCard item={item} isGrid={isGridView && !isSectionMode} />
    ),
    [isGridView, isSectionMode]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyTitle}>Produk tidak ditemukan</Text>
      <Text style={styles.emptyHint}>
        Coba kata kunci lain atau{'\n'}pilih kategori berbeda
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => {
          setSearchQuery('');
          setSelectedCategory('Semua');
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.emptyButtonText}>Reset Pencarian</Text>
      </TouchableOpacity>
    </View>
  );

  // ─── Header Components ───────────────────────────────
  const ListHeaderComponent = () => (
    <View>
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
        placeholder="Cari produk impianmu..."
      />

      {/* Filter Kategori (E1) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              selectedCategory === cat && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === cat && styles.categoryChipTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort Bar (E4) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sortScroll}
        contentContainerStyle={styles.sortContent}
      >
        <Text style={styles.sortLabel}>Urutkan:</Text>
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={[
              styles.sortChip,
              sortBy === opt.id && styles.sortChipActive,
            ]}
            onPress={() => setSortBy(opt.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.sortChipText,
                sortBy === opt.id && styles.sortChipTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Toggle List/Grid/Section */}
      <View style={styles.viewToggleRow}>
        <Text style={styles.resultCount}>
          {filteredProducts.length} produk ditemukan
        </Text>
        <View style={styles.toggleBtns}>
          <TouchableOpacity
            style={[styles.toggleBtn, !isGridView && !isSectionMode && styles.toggleBtnActive]}
            onPress={() => { setIsGridView(false); setIsSectionMode(false); }}
            activeOpacity={0.7}
          >
            <Text style={styles.toggleIcon}>☰</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, isGridView && !isSectionMode && styles.toggleBtnActive]}
            onPress={() => { setIsGridView(true); setIsSectionMode(false); }}
            activeOpacity={0.7}
          >
            <Text style={styles.toggleIcon}>▦</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, isSectionMode && styles.toggleBtnActive]}
            onPress={() => { setIsSectionMode(true); setIsGridView(false); }}
            activeOpacity={0.7}
          >
            <Text style={styles.toggleIcon}>§</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // ─── Section Header ──────────────────────────────────
  const renderSectionHeader = ({ section: { title, data } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionCount}>{data.length} item</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFF" />

      {/* App Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🛒 ShopList</Text>
          <Text style={styles.headerSubtitle}>
            {filteredProducts.length} dari {products.length} produk
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>✨ v1.0</Text>
        </View>
      </View>

      {/* Main List */}
      {isSectionMode ? (
        // ─── SectionList Mode (E3) ───────────────────
        <SectionList
          sections={sectionData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={
            sectionData.length === 0 ? styles.emptyFlex : styles.listContent
          }
          stickySectionHeadersEnabled={true}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4A4AC8']}
              tintColor="#4A4AC8"
            />
          }
        />
      ) : (
        // ─── FlatList Mode (List or Grid) ────────────
        <FlatList
          key={isGridView ? 'grid' : 'list'}
          data={filteredProducts}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={isGridView ? 2 : 1}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={
            filteredProducts.length === 0 ? styles.emptyFlex : styles.listContent
          }
          columnWrapperStyle={isGridView ? styles.gridWrapper : undefined}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4A4AC8']}
              tintColor="#4A4AC8"
            />
          }
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={10}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAFF',
  },

  // ─── HEADER ────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDF8',
    shadowColor: '#0A0A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0A0A2E',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#7070A0',
    fontWeight: '500',
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: '#EEF0FF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  headerBadgeText: {
    fontSize: 12,
    color: '#5B5FC7',
    fontWeight: '700',
  },

  // ─── CATEGORY CHIPS ────────────────────────────────
  categoryScroll: {
    marginTop: 4,
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0FA',
    borderWidth: 1.5,
    borderColor: '#E0E0F0',
  },
  categoryChipActive: {
    backgroundColor: '#4A4AC8',
    borderColor: '#4A4AC8',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5050A0',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },

  // ─── SORT CHIPS ────────────────────────────────────
  sortScroll: {
    marginTop: 2,
  },
  sortContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 12,
    color: '#7070A0',
    fontWeight: '600',
    marginRight: 4,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5FA',
    borderWidth: 1,
    borderColor: '#E0E0F0',
  },
  sortChipActive: {
    backgroundColor: '#F0F0FF',
    borderColor: '#4A4AC8',
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7070A0',
  },
  sortChipTextActive: {
    color: '#4A4AC8',
  },

  // ─── VIEW TOGGLE ───────────────────────────────────
  viewToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultCount: {
    fontSize: 13,
    color: '#7070A0',
    fontWeight: '600',
  },
  toggleBtns: {
    flexDirection: 'row',
    gap: 6,
  },
  toggleBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F0F0FA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0F0',
  },
  toggleBtnActive: {
    backgroundColor: '#4A4AC8',
    borderColor: '#4A4AC8',
  },
  toggleIcon: {
    fontSize: 15,
    color: '#5050A0',
  },

  // ─── LIST CONTENT ──────────────────────────────────
  listContent: {
    paddingBottom: 24,
  },
  emptyFlex: {
    flexGrow: 1,
  },
  gridWrapper: {
    paddingHorizontal: 10,
  },

  // ─── SECTION HEADER ────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#EDEDF8',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4A4AC8',
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 12,
    color: '#7070A0',
    fontWeight: '600',
  },

  // ─── EMPTY STATE ───────────────────────────────────
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A0A2E',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    color: '#8080A0',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#4A4AC8',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default HomeScreen;
