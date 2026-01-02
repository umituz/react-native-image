/**
 * Presentation - Filter Picker Sheet
 */

import React, { forwardRef } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { 
  BottomSheetModal, 
  AtomicText, 
  AtomicIcon,
  useAppDesignTokens, 
  BottomSheetModalRef 
} from '@umituz/react-native-design-system';
import { FilterProcessor, type FilterPreset } from '../../../infrastructure/utils/FilterProcessor';

export interface FilterPickerSheetProps {
  onSelectFilter: (filterId: string) => void;
  onDismiss: () => void;
  activeFilterId?: string;
  snapPoints?: string[];
  title?: string;
}

export const FilterPickerSheet = forwardRef<BottomSheetModalRef, FilterPickerSheetProps>(
  ({ onSelectFilter, onDismiss, activeFilterId, snapPoints = ['50%'], title = 'Filters' }, ref) => {
    const tokens = useAppDesignTokens();
    const presets = FilterProcessor.getPresets();

    return (
      <BottomSheetModal ref={ref} snapPoints={snapPoints} onDismiss={onDismiss}>
        <View style={{ padding: tokens.spacing.lg, flex: 1 }}>
          <AtomicText style={{ ...tokens.typography.headingSmall, marginBottom: tokens.spacing.md }}>
            {title}
          </AtomicText>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: tokens.spacing.md }}>
              {presets.map((preset: FilterPreset) => (
                <TouchableOpacity
                  key={preset.id}
                  onPress={() => onSelectFilter(preset.id)}
                  style={{
                    width: 100,
                    height: 120,
                    backgroundColor: activeFilterId === preset.id ? tokens.colors.primaryContainer : tokens.colors.surfaceVariant,
                    borderRadius: tokens.borderRadius.lg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: activeFilterId === preset.id ? tokens.colors.primary : 'transparent',
                  }}
                >
                  <AtomicIcon 
                    name="color-filter" 
                    size={32} 
                    color={activeFilterId === preset.id ? 'primary' : 'secondary'} 
                  />
                  <AtomicText style={{ 
                    ...tokens.typography.labelSmall, 
                    marginTop: tokens.spacing.sm,
                    color: activeFilterId === preset.id ? tokens.colors.primary : tokens.colors.textSecondary
                  }}>
                    {preset.name}
                  </AtomicText>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </BottomSheetModal>
    );
  }
);

FilterPickerSheet.displayName = 'FilterPickerSheet';
