import React from 'react';
import SearchClient from './SearchClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Results | Nike Shoes',
  description: 'Search results for Nike shoes and products',
};


export default function SearchPage({ searchParams }: any) {
  const query = searchParams?.q || '';
  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 6;
  const sortBy = searchParams?.sortBy || 'featured';

  return <SearchClient query={query} initialPage={page} initialPageSize={pageSize} initialSortBy={sortBy} />;
}