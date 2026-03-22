import { Post } from '@domain/post/entities/post';
import { PostId } from '@domain/post/value-objects/post-id';

describe('Post domain', () => {
  it('updates post content and timestamp', () => {
    const createdAt = new Date('2024-01-01T00:00:00Z');
    const updatedAt = new Date('2024-01-02T00:00:00Z');

    const post = new Post({
      title: 'Old',
      content: 'Old content',
      author: 'Author',
      createdAt,
      updatedAt
    });

    const previousUpdatedAt = post.updatedAt;

    post.update('New', 'New content');

    expect(post.title).toBe('New');
    expect(post.content).toBe('New content');
    expect(post.updatedAt.getTime()).toBeGreaterThan(
      previousUpdatedAt.getTime()
    );
    expect(post.createdAt).toBe(createdAt);
  });

  it('compares PostId values', () => {
    const first = PostId.create('post-1');
    const same = PostId.create('post-1');
    const other = PostId.create('post-2');

    expect(first.equals(same)).toBe(true);
    expect(first.equals(other)).toBe(false);
    expect(first.toString()).toBe('post-1');
  });
});
