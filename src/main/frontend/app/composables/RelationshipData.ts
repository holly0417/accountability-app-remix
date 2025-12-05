//RelationshipDto.ts composable
//Specifically for relationship-related data
//This frontend composable is meant to organize commonly used API calls in one place
//the API calls from here to the backend (via controllers)
//we don't manipulate the data here!
//Data manipulation stays in the backend mainly in the controller

import {api} from '~/axios';
import type {Page} from '~/dto/pagination/Page';
import type {RelationshipDto} from '~/dto/relationship/RelationshipDto';
import {RelationshipStatus} from '~/dto/relationship/RelationshipStatus';
import type {RelationshipStatusDto} from '~/dto/relationship/RelationshipStatusDto';
import {RelationshipDirection} from '~/dto/relationship/RelationshipDirection';
import type {UserDto} from "~/dto/user/UserDto";
import {useNavigate} from "react-router";

export function relationshipData() {

  const getPartners = async (): Promise<UserDto[] | null> => {
      try {

          const response = await api.get<UserDto[]>('/relationships/get-partners');
          return response.data;

      } catch (e: any) {
//Handle 401 (Unauthorized) if you want specific logic
          if (e.response && e.response.status === 401) {

              const navigate = useNavigate();
              navigate('/');
          }

          throw e;
      }
  }

  const getRelationshipsByStatus = async (status: RelationshipStatus): Promise<Page<RelationshipDto>> => {
    return (await api.get<Page<RelationshipDto>>('/relationships',{
      params: {
        statuses: status
      },
      paramsSerializer: {
        indexes: null
      }
    })).data;
  }

  const getRequests = async (status: RelationshipStatus, direction: RelationshipDirection): Promise<Page<RelationshipDto>> => {
    return (await api.get<Page<RelationshipDto>>('/relationships',{
      params: {
        statuses: status,
        directions: direction
      },
      paramsSerializer: {
        indexes: null
      }
    })).data;
  }

  const updateRelationship = async (relationshipId: number, newStatus: RelationshipStatusDto): Promise<RelationshipDto> => {
    return (await api.post<RelationshipDto>(`/relationships/${relationshipId}`, newStatus)).data;
  }

  const deleteRelationship = async (relationshipId: number): Promise<void> => {
    await api.delete(`/relationships/${relationshipId}`)
  }

  async function sendRequest(partnerId: number) {
    await api.put(`/relationships/request/${partnerId}`)
  }

  async function search(inputName: string): Promise<RelationshipDto[]> {
    return (await api.get<RelationshipDto[]>('/relationships/search', {
      params: {
        username: inputName
      }
    })).data;
  }


  return { getPartners, getRelationshipsByStatus, getRequests, deleteRelationship, sendRequest, search, updateRelationship };
}
