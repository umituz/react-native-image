/**
 * Presentation - Text Editor Sheet
 */

import React, { forwardRef, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { 
  BottomSheetModal, 
  AtomicText, 
  AtomicIcon, 
  useAppDesignTokens, 
  BottomSheetModalRef 
} from '@umituz/react-native-design-system';
import { TextContentTab, TextStyleTab, TextTransformTab } from './TextEditorTabs';

export interface TextEditorSheetProps {
  text: string;
  onTextChange: (text: string) => void;
  color: string;
  onColorChange: (color: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
  scale: number;
  onScaleChange: (scale: number) => void;
  rotation: number;
  onRotationChange: (rotation: number) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  onDelete?: () => void;
  onDismiss: () => void;
  snapPoints?: string[];
  t: (key: string) => string;
}

export const TextEditorSheet = forwardRef<BottomSheetModalRef, TextEditorSheetProps>((props, ref) => {
  const tokens = useAppDesignTokens();
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'transform'>('content');
  const { onDismiss, snapPoints = ['75%'], t } = props;

  const tabs = [
    { id: 'content', label: 'Text', icon: 'text' },
    { id: 'style', label: 'Style', icon: 'color-palette' },
    { id: 'transform', label: 'Edit', icon: 'options' },
  ];

  return (
    <BottomSheetModal ref={ref} snapPoints={snapPoints} onDismiss={onDismiss}>
      <View style={{ padding: tokens.spacing.lg, flex: 1 }}>
        <View style={{ flexDirection: 'row', gap: tokens.spacing.md, marginBottom: tokens.spacing.lg }}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1, alignItems: 'center', paddingVertical: tokens.spacing.sm,
                borderBottomWidth: 3, borderBottomColor: activeTab === tab.id ? tokens.colors.primary : 'transparent'
              }}
            >
              <AtomicIcon name={tab.icon as any} size={20} color={activeTab === tab.id ? 'primary' : 'secondary'} />
              <AtomicText style={{ 
                ...tokens.typography.labelSmall, 
                color: activeTab === tab.id ? tokens.colors.primary : tokens.colors.textSecondary,
                marginTop: 4
              }}>
                {tab.label}
              </AtomicText>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
          {activeTab === 'content' && <TextContentTab text={props.text} onTextChange={props.onTextChange} t={t} />}
          {activeTab === 'style' && (
            <TextStyleTab 
              fontSize={props.fontSize} setFontSize={props.onFontSizeChange}
              color={props.color} setColor={props.onColorChange}
              fontFamily={props.fontFamily} setFontFamily={props.onFontFamilyChange}
              t={t}
            />
          )}
          {activeTab === 'transform' && (
            <TextTransformTab 
              scale={props.scale} setScale={props.onScaleChange}
              rotation={props.rotation} setRotation={props.onRotationChange}
              opacity={props.opacity} setOpacity={props.onOpacityChange}
              onDelete={props.onDelete}
              t={t}
            />
          )}
        </ScrollView>
      </View>
    </BottomSheetModal>
  );
});

TextEditorSheet.displayName = 'TextEditorSheet';
