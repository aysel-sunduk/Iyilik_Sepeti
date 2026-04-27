import { StyleSheet } from 'react-native';

export const passwordInputStyles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    paddingBottom: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 10,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  shield: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  shieldIcon: {
    fontSize: 14,
  },
  eyeIcon: {
    fontSize: 13,
    padding: 2,
  },
  errorText: {
    fontSize: 11,
    marginTop: 4,
    paddingLeft: 26,
  },
});