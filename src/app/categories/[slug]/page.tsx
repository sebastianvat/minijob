import { CategoryContent } from './category-content';

// Generate static paths for all Skill Zones
export function generateStaticParams() {
  return [
    { slug: 'casa' },
    { slug: 'constructii' },
    { slug: 'auto' },
    { slug: 'tech' },
    { slug: 'pets' },
    { slug: 'kids' },
    { slug: 'altceva' },
  ];
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return <CategoryContent slug={params.slug} />;
}
