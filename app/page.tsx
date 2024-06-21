import PostButton from '@/components/PostButton';
import createPost from '@/server/actions/createPost';
import getPosts from '@/server/actions/getPosts';

export default async function Home() {
  const { error, success } = await getPosts();
  if (error) {
    throw new Error(error);
  }
  if (success) {
    return (
      <main>
        {success?.map(post => (
          <div key={post.id}>
            <h2>{post.title}</h2>{' '}
          </div>
        ))}

        <form action={createPost}>
          <input
            className="bg-black border-2 text-white"
            type="text"
            name="title"
            placeholder="Title"
          />
          <PostButton/>
        </form>
      </main>
    );
  }
}
