import NextError from 'next/error';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '~/pages/_app';
import { RouterOutput, trpc } from '~/utils/trpc';

type PostByIdOutput = RouterOutput['author']['byId'];

function AuthorItem(props: { post: PostByIdOutput }) {
  const { post } = props;
  return (
    <>
      <h1>{post.name}</h1>
      <em>Created {post.createdAt.toLocaleDateString('en-us')}</em>

      <p>{post.jobTitle}</p>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(post, null, 4)}</pre>
    </>
  );
}

const PostViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const authorQuery = trpc.author.byId.useQuery({ id });

  if (authorQuery.error) {
    return (
      <NextError
        title={authorQuery.error.message}
        statusCode={authorQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (authorQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = authorQuery;
  return <AuthorItem post={data} />;
};

export default PostViewPage;
