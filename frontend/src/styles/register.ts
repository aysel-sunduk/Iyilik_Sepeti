import { StyleSheet } from 'react-native';

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  heroTitle: {
    fontSize: 26,
    lineHeight: 32,
    marginBottom: 6,
  },
  heroTitleAccent: {
    fontStyle: 'italic',
  },
  heroSub: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  treeWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  treeTextWrap: {
    flex: 1,
  },
  treeTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  treeSub: {
    fontSize: 11,
    marginBottom: 10,
  },
  treeTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  treeFill: {
    height: '100%',
    borderRadius: 3,
    width: '0%',
  },
  toggleSection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  toggleQuestion: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  toggleIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 3,
    textAlign: 'center',
  },
  toggleSub: {
    fontSize: 10,
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  ctaWrapper: {
    marginTop: 8,
    marginBottom: 20,
  },
  ctaButton: {
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  ctaButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
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
  signinLink: {
    textAlign: 'center',
    fontSize: 13,
    paddingBottom: 16,
  },
  signinLinkText: {
    fontWeight: '600',
  },
});