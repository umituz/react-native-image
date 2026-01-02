/**
 * Presentation - Sticker Picker Sheet
 */

import React, { forwardRef } from 'react';
import { View, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { 
  BottomSheetModal, 
  AtomicText, 
  useAppDesignTokens, 
  BottomSheetModalRef 
} from '@umituz/react-native-design-system';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface StickerPickerSheetProps {
  stickers: string[];
  onSelectSticker: (uri: string) => void;
  onDismiss: () => void;
  title?: string;
  snapPoints?: string[];
}

export const StickerPickerSheet = forwardRef<BottomSheetModalRef, StickerPickerSheetProps>(
  ({ stickers, onSelectSticker, onDismiss, title = 'Select Sticker', snapPoints = ['60%'] }, ref) => {
    const tokens = useAppDesignTokens();

    return (
      <BottomSheetModal ref={ref} snapPoints={snapPoints} onDismiss={onDismiss}>
        <View style={{ padding: tokens.spacing.lg, flex: 1 }}>
          <AtomicText style={{ ...tokens.typography.headingSmall, marginBottom: tokens.spacing.md }}>
            {title}
          </AtomicText>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.md }}>
              {stickers.map((uri, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => onSelectSticker(uri)}
                  style={{
                    width: (SCREEN_WIDTH - 64) / 3,
                    aspectRatio: 1,
                    backgroundColor: tokens.colors.surfaceVariant,
                    borderRadius: tokens.borderRadius.md,
                    padding: tokens.spacing.sm,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </BottomSheetModal>
    );
  }
);

StickerPickerSheet.displayName = 'StickerPickerSheet';
