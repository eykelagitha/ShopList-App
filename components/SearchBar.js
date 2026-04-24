import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

const SearchBar = ({ value, onChangeText, onClear, placeholder }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || 'Cari produk...'}
        placeholderTextColor="#A0A0B8"
        returnKeyType="search"
        clearButtonMode="never"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearBtn} activeOpacity={0.7}>
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginVertical: 10,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E8E8F5',
  },
  icon: {
    fontSize: 17,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0A0A2E',
    fontWeight: '500',
    paddingVertical: 0,
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#C0C0D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default SearchBar;
