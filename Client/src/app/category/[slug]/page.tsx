import React from 'react';
import CategoryClient from './CategoryClient';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: PageProps) {
  return <CategoryClient slug={params.slug} />;
}
