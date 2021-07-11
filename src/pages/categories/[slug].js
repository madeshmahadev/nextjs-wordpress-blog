import { getAllCategories, getCategoryBySlug } from 'lib/categories';
import { getPostsByCategoryId } from 'lib/posts';
import usePageMetadata from 'hooks/use-page-metadata';

import TemplateArchive from 'templates/archive';
import Title from 'components/Title';

import { useRouter } from 'next/router';

export default function Category({ category, posts }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading</div>;
  }

  const { name, description, slug } = category;

  const { metadata } = usePageMetadata({
    metadata: {
      ...category,
      description: description || category.og?.description || `Read ${posts.length} posts from ${name}`,
    },
  });

  return <TemplateArchive title={name} Title={<Title title={name} />} posts={posts} slug={slug} metadata={metadata} />;
}

export async function getStaticProps({ params = {} } = {}) {
  const { category } = await getCategoryBySlug(params?.slug);
  const { posts } = await getPostsByCategoryId(category.categoryId);

  return {
    props: {
      category,
      posts,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const { categories } = await getAllCategories();

  const paths = categories.map((category) => {
    const { slug } = category;
    return {
      params: {
        slug,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}
