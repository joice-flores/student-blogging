import { createPost, listPosts, getPostById, updatePost, deletePost } from '@application/use-cases/post';
import { getDatabase } from '@infrastructure/database/mongodb/connection';

jest.mock('@infrastructure/database/mongodb/connection');
jest.mock('@shared/i18n', () => ({
  translate: (key: string) => key
}));

const mockDb = {
  collection: jest.fn()
};

describe('Post Use Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getDatabase as jest.Mock).mockReturnValue(mockDb);
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const mockCollection = {
        insertOne: jest.fn().mockResolvedValue({ insertedId: { toString: () => '507f1f77bcf86cd799439011' } })
      };
      mockDb.collection.mockReturnValue(mockCollection);

      const result = await createPost({ title: 'Test', content: 'Content', author: 'Author' });

      expect(result).toHaveProperty('_id');
      expect(result.title).toBe('Test');
      expect(mockCollection.insertOne).toHaveBeenCalled();
    });

    it('should throw error if title is missing', async () => {
      await expect(createPost({ title: '', content: 'Content', author: 'Author' })).rejects.toThrow();
    });

    it('should throw error if content is missing', async () => {
      await expect(createPost({ title: 'Test', content: '', author: 'Author' })).rejects.toThrow();
    });

    it('should throw error if author is missing', async () => {
      await expect(createPost({ title: 'Test', content: 'Content', author: '' })).rejects.toThrow();
    });
  });

  describe('listPosts', () => {
    it('should list posts with pagination', async () => {
      const mockPosts = [
        { _id: { toString: () => '1' }, title: 'Post 1', content: 'Content 1', author: 'Author 1', createdAt: new Date() },
        { _id: { toString: () => '2' }, title: 'Post 2', content: 'Content 2', author: 'Author 2', createdAt: new Date() }
      ];
      const mockCollection = {
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                toArray: jest.fn().mockResolvedValue(mockPosts)
              })
            })
          })
        })
      };
      mockDb.collection.mockReturnValue(mockCollection);

      const result = await listPosts(50, 0);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('_id');
    });
  });

  describe('getPostById', () => {
    it('should return a post by id', async () => {
      const mockPost = {
        _id: { toString: () => '507f1f77bcf86cd799439011' },
        title: 'Test',
        content: 'Content',
        author: 'Author',
        createdAt: new Date()
      };
      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(mockPost)
      };
      mockDb.collection.mockReturnValue(mockCollection);

      const result = await getPostById('507f1f77bcf86cd799439011');

      expect(result.title).toBe('Test');
      expect(result._id).toBe('507f1f77bcf86cd799439011');
    });

    it('should throw error if post not found', async () => {
      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(null)
      };
      mockDb.collection.mockReturnValue(mockCollection);

      await expect(getPostById('invalid-id')).rejects.toThrow();
    });
  });

  describe('updatePost', () => {
    it('should update a post successfully', async () => {
      const mockUpdatedPost = {
        _id: { toString: () => '507f1f77bcf86cd799439011' },
        title: 'Updated',
        content: 'Updated Content',
        author: 'Author',
        updatedAt: new Date()
      };
      const mockCollection = {
        findOneAndUpdate: jest.fn().mockResolvedValue({ value: mockUpdatedPost })
      };
      mockDb.collection.mockReturnValue(mockCollection);

      const result = await updatePost('507f1f77bcf86cd799439011', { title: 'Updated', content: 'Updated Content' });

      expect(result.title).toBe('Updated');
      expect(mockCollection.findOneAndUpdate).toHaveBeenCalled();
    });

    it('should throw error if post not found on update', async () => {
      const mockCollection = {
        findOneAndUpdate: jest.fn().mockResolvedValue({ value: null })
      };
      mockDb.collection.mockReturnValue(mockCollection);

      await expect(updatePost('invalid-id', { title: 'Updated' })).rejects.toThrow();
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      const mockCollection = {
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
      };
      mockDb.collection.mockReturnValue(mockCollection);

      const result = await deletePost('507f1f77bcf86cd799439011');

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalled();
    });

    it('should throw error if post not found on delete', async () => {
      const mockCollection = {
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 0 })
      };
      mockDb.collection.mockReturnValue(mockCollection);

      await expect(deletePost('invalid-id')).rejects.toThrow();
    });
  });
});
