import React from 'react';
import CategoryClient from './CategoryClient';



export default function CategoryPage({ params }: any) {
  return <CategoryClient slug={params.slug} />;
}
