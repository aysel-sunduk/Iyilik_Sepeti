import { StyleSheet } from 'react-native';

export const modeToggleStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  question: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
    marginBottom: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 3,
    textAlign: 'center',
  },
  sub: {
    fontSize: 10,
    textAlign: 'center',
  },
});