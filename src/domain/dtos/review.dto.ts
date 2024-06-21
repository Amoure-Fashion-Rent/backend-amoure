import { Review } from '@prisma/client';

export interface PostReviewResponse extends Review {}
export interface GetReviewResponse {
  reviews: Review[];
  avgRating: number;
  count: number;
}
