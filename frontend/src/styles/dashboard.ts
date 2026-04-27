import { StyleSheet } from 'react-native';

export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  
  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  notificationBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: 24,
    marginTop: -20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statsCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  statsIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
  },
  
  // Campaign Cards
  campaignsList: {
    paddingHorizontal: 24,
  },
  campaignCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  campaignImage: {
    width: '100%',
    height: 140,
  },
  campaignOverlay: {
    padding: 16,
  },
  campaignBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  campaignBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  campaignDesc: {
    fontSize: 13,
    marginBottom: 12,
  },
  campaignProgress: {
    height: 6,
    borderRadius: 3,
    marginBottom: 12,
  },
  campaignProgressFill: {
    height: '100%',
    borderRadius: 3,
    width: '0%',
  },
  campaignStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  campaignStatText: {
    fontSize: 12,
    fontWeight: '500',
  },
  donateButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  donateButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  
  // Impact Summary
  impactCard: {
    margin: 24,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  impactTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  impactNumber: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
  },
  impactSub: {
    fontSize: 12,
  },
  
  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});