import { UserDocument, UserEntity } from '../models/user.model.js';
import { OfferDocument, OfferEntity } from '../models/offer.model.js';
import { CommentDocument, CommentEntity } from '../models/comment.model.js';
import { FavoriteDocument, FavoriteEntity } from '../models/favorite.model.js';

export interface DatabaseService<TDocument, TEntity> {
  findById(id: string): Promise<TDocument | null>;
  create(data: Partial<TEntity>): Promise<TDocument>;
  findAll(limit?: number): Promise<TDocument[]>;
  update(id: string, data: Partial<TEntity>): Promise<TDocument | null>;
  delete(id: string): Promise<boolean>;
}

export interface UserDatabaseService extends DatabaseService<UserDocument, UserEntity> {
  findByEmail(email: string): Promise<UserDocument | null>;
}

export interface OfferDatabaseService extends DatabaseService<OfferDocument, OfferEntity> {
  findByCity(city: string, limit?: number): Promise<OfferDocument[]>;
  findPremiumByCity(city: string, limit?: number): Promise<OfferDocument[]>;
  updateCommentsCount(offerId: string): Promise<void>;
  updateRating(offerId: string): Promise<void>;
  getFavoriteOfferIds(userId: string): Promise<string[]>;
}

export interface CommentDatabaseService extends DatabaseService<CommentDocument, CommentEntity> {
  findByOfferId(offerId: string, limit?: number): Promise<CommentDocument[]>;
}

export interface FavoriteDatabaseService extends DatabaseService<FavoriteDocument, FavoriteEntity> {
  findByUserId(userId: string): Promise<FavoriteDocument[]>;
  findByUserAndOffer(userId: string, offerId: string): Promise<FavoriteDocument | null>;
  deleteByUserAndOffer(userId: string, offerId: string): Promise<boolean>;
  addToFavorites(userId: string, offerId: string): Promise<FavoriteDocument | null>;
  removeFromFavorites(userId: string, offerId: string): Promise<boolean>;
  getFavoriteOfferIds(userId: string): Promise<string[]>;
}

