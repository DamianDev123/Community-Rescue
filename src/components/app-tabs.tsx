import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.backgroundElement}
      indicatorColor={colors.backgroundSelected}
      iconColor={{ default: colors.textSecondary, selected: colors.primary }}
      labelStyle={{ default: { color: colors.textSecondary }, selected: { color: colors.primary } }}
      blurEffect="systemChromeMaterial">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home_filled" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="care">
        <NativeTabs.Trigger.Label>Care</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'cross.case', selected: 'cross.case.fill' }}
          md="local_hospital"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="first-aid">
        <NativeTabs.Trigger.Label>First Aid</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="bandage.fill" md="healing" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="resources">
        <NativeTabs.Trigger.Label>Resources</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="list.bullet.clipboard.fill" md="checklist" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
