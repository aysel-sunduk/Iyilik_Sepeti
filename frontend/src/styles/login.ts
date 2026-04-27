import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  illo: {
    height: 300,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbit: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  orbitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orbitDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  orbitText: {
    fontSize: 11,
    fontWeight: '600',
  },
  centerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainIcon: {
    fontSize: 42,
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingHorizontal: 24,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  greeting: {
    marginBottom: 28,
  },
  eye: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    lineHeight: 31,
    marginBottom: 6,
  },
  sub: {
    fontSize: 13,
    lineHeight: 20,
  },
  forgotButton: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  loginButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  bioButton: {
    width: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioIcon: {
    fontSize: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderRadius: 14,
  },
  socialIcon: {
    fontSize: 16,
    fontWeight: '600',
  },
  socialText: {
    fontSize: 13,
    fontWeight: '500',
  },
  signupLink: {
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 20,
  },
  proofBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: -24,
    marginBottom: -32,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  avatars: {
    flexDirection: 'row',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: -7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proofText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
    paddingLeft: 12,
  },
});