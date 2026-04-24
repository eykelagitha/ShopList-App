import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { formatPrice } from '../data/products';

const StarRating = ({ rating }) => {
  const stars = [];
  const full = Math.floor(rating);
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text key={i} style={[styles.star, i <= full ? styles.starFilled : styles.starEmpty]}>
        ★
      </Text>
    );
  }
  return <View style={styles.starsRow}>{stars}</View>;
};

const ProductCard = ({ item, isGrid = false, onPress }) => {
  const isLowStock = item.stock <= 20;

  if (isGrid) {
    return (
      <TouchableOpacity
        style={styles.gridCard}
        onPress={() => onPress && onPress(item)}
        activeOpacity={0.75}
      >
        <View style={styles.gridImageContainer}>
          <Text style={styles.gridEmoji}>{item.image}</Text>
          {isLowStock && (
            <View style={styles.badgeLow}>
              <Text style={styles.badgeLowText}>Hampir Habis</Text>
            </View>
          )}
        </View>
        <View style={styles.gridInfo}>
          <Text style={styles.gridCategory}>{item.category}</Text>
          <Text style={styles.gridName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.gridRatingRow}>
            <Text style={styles.starFilledSmall}>★</Text>
            <Text style={styles.ratingTextSmall}>{item.rating}</Text>
            <Text style={styles.soldTextSmall}>· {item.sold.toLocaleString('id-ID')} terjual</Text>
          </View>
          <Text style={styles.gridPrice}>{formatPrice(item.price)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.75}
    >
      <View style={styles.listImageContainer}>
        <Text style={styles.listEmoji}>{item.image}</Text>
      </View>
      <View style={styles.listInfo}>
        <View style={styles.listTopRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          {isLowStock && (
            <View style={styles.badgeLow}>
              <Text style={styles.badgeLowText}>Stok Terbatas</Text>
            </View>
          )}
        </View>
        <Text style={styles.listName} numberOfLines={2}>{item.name}</Text>
        <StarRating rating={item.rating} />
        <View style={styles.listBottomRow}>
          <Text style={styles.listPrice}>{formatPrice(item.price)}</Text>
          <Text style={styles.soldText}>{item.sold.toLocaleString('id-ID')} terjual</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // ─── LIST CARD ──────────────────────────────────────
  listCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    shadowColor: '#0A0A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F8',
  },
  listImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F5F5FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  listEmoji: {
    fontSize: 38,
  },
  listInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  listTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#EEF0FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryText: {
    fontSize: 11,
    color: '#5B5FC7',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  badgeLow: {
    backgroundColor: '#FFF0F0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeLowText: {
    fontSize: 10,
    color: '#E05C5C',
    fontWeight: '600',
  },
  listName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0A2E',
    lineHeight: 20,
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  star: {
    fontSize: 13,
    marginRight: 1,
  },
  starFilled: {
    color: '#F5A623',
  },
  starEmpty: {
    color: '#D0D0E0',
  },
  listBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4A4AC8',
  },
  soldText: {
    fontSize: 11,
    color: '#9090A0',
    fontWeight: '500',
  },

  // ─── GRID CARD ──────────────────────────────────────
  gridCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 6,
    shadowColor: '#0A0A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F8',
    overflow: 'hidden',
  },
  gridImageContainer: {
    height: 110,
    backgroundColor: '#F5F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridEmoji: {
    fontSize: 52,
  },
  gridInfo: {
    padding: 12,
  },
  gridCategory: {
    fontSize: 10,
    color: '#5B5FC7',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  gridName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A0A2E',
    lineHeight: 18,
    marginBottom: 6,
    minHeight: 36,
  },
  gridRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  starFilledSmall: {
    fontSize: 12,
    color: '#F5A623',
  },
  ratingTextSmall: {
    fontSize: 11,
    color: '#0A0A2E',
    fontWeight: '700',
    marginLeft: 3,
  },
  soldTextSmall: {
    fontSize: 10,
    color: '#9090A0',
    marginLeft: 3,
  },
  gridPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4A4AC8',
  },
});

export default ProductCard;
