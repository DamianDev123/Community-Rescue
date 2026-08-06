import { useLocalSearchParams } from 'expo-router';

import { FirstAidSearch } from '@/components/first-aid-search';
import { Screen } from '@/components/screen';

export default function FirstAidScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();

  return (
    <Screen title="First Aid" subtitle="Search a symptom or situation. Not a substitute for calling 911.">
      <FirstAidSearch initialQuery={typeof q === 'string' ? q : undefined} />
    </Screen>
  );
}
