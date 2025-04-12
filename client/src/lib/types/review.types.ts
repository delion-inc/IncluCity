import { PlaceCategory } from "./place.types";

export interface PlaceForReview {
  id: number;
  name: string;
  address: string;
  category: PlaceCategory;
}

export interface UserForReview {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: number[];
}

export interface Review {
  id: number;
  place: PlaceForReview;
  user: UserForReview;
  rating: number;
  comment: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateReviewRequest {
  rating: number;
  placeId: number;
  comment: string;
}

export interface UpdateReviewRequest {
  comment?: string;
  rating?: number;
} 