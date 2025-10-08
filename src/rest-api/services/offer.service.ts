import { OfferModel, OfferEntity } from '../models/offer.model.js';
import type { OfferDocument } from '../models/offer.model.js';
import { OfferDatabaseService } from '../interfaces/database.interface.js';
import { CommentModel } from '../models/comment.model.js';
import { FavoriteModel } from '../models/favorite.model.js';

export class OfferService implements OfferDatabaseService {
  public async findById(id: string): Promise<OfferDocument | null> {
    try {
      const query = (OfferModel as any).findById(id).populate('author');
      const result = await query.exec();
      return result as OfferDocument | null;
    } catch (error) {
      return null;
    }
  }

  public async create(data: Partial<OfferEntity>): Promise<OfferDocument> {
    const offer = new OfferModel(data);
    const savedOffer = await offer.save();
    return savedOffer as any;
  }

  public async findAll(limit?: number): Promise<OfferDocument[]> {
    try {
      const query = (OfferModel as any).find().populate('author').sort({ postDate: -1 });
      if (limit) {
        query.limit(limit);
      }
      const result = await query.exec();
      return result as OfferDocument[];
    } catch (error) {
      return [];
    }
  }

  public async update(id: string, data: Partial<OfferEntity>): Promise<OfferDocument | null> {
    try {
      const query = (OfferModel as any).findByIdAndUpdate(id, data, { new: true }).populate('author');
      const result = await query.exec();
      return result as OfferDocument | null;
    } catch (error) {
      return null;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await OfferModel.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      return false;
    }
  }

  public async findByCity(city: string, limit?: number): Promise<OfferDocument[]> {
    try {
      const query = (OfferModel as any).find({ city }).populate('author').sort({ postDate: -1 });
      if (limit) {
        query.limit(limit);
      }
      const result = await query.exec();
      return result as OfferDocument[];
    } catch (error) {
      return [];
    }
  }

  public async findPremiumByCity(city: string, limit = 3): Promise<OfferDocument[]> {
    try {
      const query = (OfferModel as any).find({ city, isPremium: true })
        .populate('author')
        .sort({ postDate: -1 })
        .limit(limit);
      const result = await query.exec();
      return result as OfferDocument[];
    } catch (error) {
      return [];
    }
  }

  public async updateCommentsCount(offerId: string): Promise<void> {
    try {
      const commentsCount = await CommentModel.countDocuments({ offer: offerId });
      await OfferModel.findByIdAndUpdate(offerId, { commentsCount });
    } catch (error) {
      // Игнорируем
    }
  }

  public async updateRating(offerId: string): Promise<void> {
    try {
      const comments = await (CommentModel as any).find({ offer: offerId }).exec();
      if (comments.length === 0) {
        await OfferModel.findByIdAndUpdate(offerId, { rating: 0 });
        return;
      }

      const totalRating = comments.reduce((sum: number, comment: any) => sum + comment.rating, 0);
      const averageRating = Math.round((totalRating / comments.length) * 10) / 10;

      await OfferModel.findByIdAndUpdate(offerId, { rating: averageRating });
    } catch (error) {
      // Игнорируем
    }
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

