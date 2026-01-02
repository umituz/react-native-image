/**
 * Presentation - Text Editor Tabs
 */

import React from 'react';
import { View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { AtomicText, AtomicIcon, useAppDesignTokens } from '@umituz/react-native-design-system';

interface TabProps {
  t: (key: string) => string;
}

export const TextContentTab: React.FC<TabProps & { text: string; onTextChange: (t: string) => void }> = ({ text, onTextChange, t }) => {
  const tokens = useAppDesignTokens();
  return (
    <View style={{ gap: tokens.spacing.lg }}>
      <TextInput
        value={text}
        onChangeText={onTextChange}
        placeholder={t('editor.text_placeholder')}
        style={{
          ...tokens.typography.bodyLarge,
          borderWidth: 1,
          borderColor: tokens.colors.border,
          borderRadius: tokens.borderRadius.md,
          padding: tokens.spacing.md,
          minHeight: 120,
          textAlignVertical: 'top',
        }}
        multiline
      />
    </View>
  );
};

export const TextStyleTab: React.FC<TabProps & { 
  fontSize: number; setFontSize: (s: number) => void;
  color: string; setColor: (c: string) => void;
  fontFamily: string; setFontFamily: (f: string) => void;
}> = ({ fontSize, setFontSize, color, setColor, fontFamily, setFontFamily, t }) => {
  const tokens = useAppDesignTokens();
  const colors = ['#FFFFFF', '#000000', '#FF0000', '#FFFF00', '#0000FF', '#00FF00', '#FF00FF', '#FFA500'];
  const fonts = ['System', 'serif', 'sans-serif', 'monospace'];

  return (
    <View style={{ gap: tokens.spacing.xl }}>
      <View>
        <AtomicText style={{ ...tokens.typography.labelMedium, marginBottom: tokens.spacing.sm }}>Font</AtomicText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: tokens.spacing.sm }}>
          {fonts.map(f => (
            <TouchableOpacity key={f} onPress={() => setFontFamily(f)} style={{
              paddingHorizontal: tokens.spacing.md, paddingVertical: tokens.spacing.xs, borderRadius: tokens.borderRadius.full,
              borderWidth: 1, borderColor: fontFamily === f ? tokens.colors.primary : tokens.colors.border,
              backgroundColor: fontFamily === f ? tokens.colors.primaryContainer : tokens.colors.surface
            }}>
              <AtomicText style={{ fontFamily: f }}>{f}</AtomicText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View>
        <AtomicText style={{ ...tokens.typography.labelMedium, marginBottom: tokens.spacing.sm }}>Color</AtomicText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: tokens.spacing.sm }}>
          {colors.map(c => (
            <TouchableOpacity key={c} onPress={() => setColor(c)} style={{
              width: 40, height: 40, borderRadius: 20, backgroundColor: c,
              borderWidth: color === c ? 3 : 1, borderColor: tokens.colors.primary
            }} />
          ))}
        </ScrollView>
      </View>

      <View>
        <AtomicText style={{ ...tokens.typography.labelMedium, marginBottom: tokens.spacing.xs }}>Size: {fontSize}px</AtomicText>
        <Slider value={fontSize} onValueChange={setFontSize} minimumValue={12} maximumValue={100} step={1} minimumTrackTintColor={tokens.colors.primary} />
      </View>
    </View>
  );
};

export const TextTransformTab: React.FC<TabProps & {
  scale: number; setScale: (s: number) => void;
  rotation: number; setRotation: (r: number) => void;
  opacity: number; setOpacity: (o: number) => void;
  onDelete?: () => void;
}> = ({ scale, setScale, rotation, setRotation, opacity, setOpacity, onDelete, t }) => {
  const tokens = useAppDesignTokens();
  return (
    <View style={{ gap: tokens.spacing.xl }}>
      <View>
        <AtomicText style={{ ...tokens.typography.labelMedium, marginBottom: tokens.spacing.xs }}>Scale: {scale.toFixed(2)}x</AtomicText>
        <Slider value={scale} onValueChange={setScale} minimumValue={0.2} maximumValue={3} step={0.1} minimumTrackTintColor={tokens.colors.primary} />
      </View>
      <View>
        <AtomicText style={{ ...tokens.typography.labelMedium, marginBottom: tokens.spacing.xs }}>Rotation: {Math.round(rotation)}°</AtomicText>
        <Slider value={rotation} onValueChange={setRotation} minimumValue={0} maximumValue={360} step={1} minimumTrackTintColor={tokens.colors.primary} />
      </View>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: tokens.spacing.sm,
          padding: tokens.spacing.md, borderRadius: tokens.borderRadius.md, borderWidth: 1, borderColor: tokens.colors.error
        }}>
          <AtomicIcon name="trash" size={20} color="error" />
          <AtomicText style={{ ...tokens.typography.labelMedium, color: tokens.colors.error }}>Delete Layer</AtomicText>
        </TouchableOpacity>
      )}
    </View>
  );
};
