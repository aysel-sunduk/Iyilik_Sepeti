import { apiClient } from '../api/apiClient';
import { 
  CampaignResponse, 
  CampaignCreateRequest, 
  ApiResponse 
} from '../api/types';

export const campaignService = {
  getAllCampaigns: async (): Promise<CampaignResponse[]> => {
    return apiClient.get<CampaignResponse[]>('/api/campaigns');
  },

  getActiveCampaigns: async (): Promise<CampaignResponse[]> => {
    return apiClient.get<CampaignResponse[]>('/api/campaigns/active');
  },

  getCampaignById: async (id: string): Promise<CampaignResponse> => {
    return apiClient.get<CampaignResponse>(`/api/campaigns/${id}`);
  },

  createCampaign: async (campaign: CampaignCreateRequest): Promise<CampaignResponse> => {
    return apiClient.post<CampaignResponse>('/api/campaigns', campaign);
  },

  updateCampaign: async (id: string, campaign: CampaignCreateRequest): Promise<CampaignResponse> => {
    return apiClient.put<CampaignResponse>(`/api/campaigns/${id}`, campaign);
  },

  deleteCampaign: async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/api/campaigns/${id}`);
  }
};
