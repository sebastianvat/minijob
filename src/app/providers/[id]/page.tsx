import { ProviderProfileContent } from './provider-content';

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];
}

export default function ProviderPage({ params }: { params: { id: string } }) {
  return <ProviderProfileContent id={params.id} />;
}
