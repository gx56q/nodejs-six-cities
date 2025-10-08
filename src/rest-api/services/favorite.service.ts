import { FavoriteModel, FavoriteEntity } from '../models/favorite.model.js';
import type { FavoriteDocument } from '../models/favorite.model.js';
import { FavoriteDatabaseService } from '../interfaces/database.interface.js';

export class FavoriteService implements FavoriteDatabaseService {
  public async findById(id: string): Promise<FavoriteDocument | null> {
    try {
      const query = (FavoriteModel as any).findById(id).populate('user').populate('offer');
      const result = await query.exec();
      return result as FavoriteDocument | null;
    } catch (error) {
      return null;
    }
  }

  public async create(data: Partial<FavoriteEntity>): Promise<FavoriteDocument> {
    const favorite = new FavoriteModel(data);
    const savedFavorite = await favorite.save();
    return savedFavorite as any;
  }

  public async findAll(limit?: number): Promise<FavoriteDocument[]> {
    try {
      const query = (FavoriteModel as any).find().populate('user').populate('offer');
      if (limit) {
        query.limit(limit);
      }
      const result = await query.exec();
      return result as FavoriteDocument[];
    } catch (error) {
      return [];
    }
  }

  public async update(id: string, data: Partial<FavoriteEntity>): Promise<FavoriteDocument | null> {
    try {
      const query = (FavoriteModel as any).findByIdAndUpdate(id, data, { new: true })
        .populate('user')
        .populate('offer');
      const result = await query.exec();
      return result as FavoriteDocument | null;
    } catch (error) {
      return null;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await FavoriteModel.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      return false;
    }
  }

  public async findByUserId(userId: string): Promise<FavoriteDocument[]> {
    try {
      const query = (FavoriteModel as any).find({ user: userId })
        .populate('user')
        .populate('offer');
      const result = await query.exec();
      return result as FavoriteDocument[];
    } catch (error) {
      return [];
    }
  }

  public async findByUserAndOffer(userId: string, offerId: string): Promise<FavoriteDocument | null> {
    try {
      const query = (FavoriteModel as any).findOne({ user: userId, offer: offerId })
        .populate('user')
        .populate('offer');
      const result = await query.exec();
      return result as FavoriteDocument | null;
    } catch (error) {
      return null;
    }
  }

  public async deleteByUserAndOffer(userId: string, offerId: string): Promise<boolean> {
    try {
      const result = await FavoriteModel.findOneAndDelete({ user: userId, offer: offerId }).exec();
      return !!result;
    } catch (error) {
      return false;
    }
  }

  public async addToFavorites(userId: string, offerId: string): Promise<FavoriteDocument | null> {
    try {
      const existing = await this.findByUserAndOffer(userId, offerId);
      if (existing) {
        return existing;
      }

      const favorite = new FavoriteModel({ user: userId, offer: offerId });
      const savedFavorite = await favorite.save();
      return savedFavorite as any;
    } catch (error) {
      return null;
    }
  }

  public async removeFromFavorites(userId: string, offerId: string): Promise<boolean> {
    return await this.deleteByUserAndOffer(userId, offerId);
  }

  public async getFavoriteOfferIds(userId: string): Promise<string[]> {
    try {
      const favorites = await (FavoriteModel as any).find({ user: userId }).select('offer');
      return favorites.map((fav: any) => fav.offer.toString());
    } catch (error) {
      return [];
    }
  }
}
