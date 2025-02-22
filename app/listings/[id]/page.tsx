import { Suspense } from 'react';
import { LISTINGS_API_URL } from '@/app/lib/constants';
import ListingDetail from './ListingDetail';
import ListingLoading from './loading';

interface PageProps {
  params: Promise<{ id: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: Promise<any>;
}

async function getListing(id: string) {
  const res = await fetch(`${LISTINGS_API_URL}/${id}?_bids=true`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch listing');
  }
  return res.json();
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  const listingData = getListing(id);

  return (
    <Suspense fallback={<ListingLoading />}>
      <ListingDetail listingPromise={listingData} />
    </Suspense>
  );
}
