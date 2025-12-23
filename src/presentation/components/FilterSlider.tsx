/**
 * Presentation - Filter Slider Component
 * 
 * Slider for adjusting filter parameters
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';

interface FilterSliderProps {
    label: string;
    value: number;
    onValueChange: (value: number) => void;
    minimumValue?: number;
    maximumValue?: number;
    step?: number;
    valueFormat?: (value: number) => string;
    color?: string;
}

export function FilterSlider({
    label,
    value,
    onValueChange,
    minimumValue = 0,
    maximumValue = 100,
    step = 1,
    valueFormat,
    color = '#007bff',
}: FilterSliderProps) {
    const formatValue = (val: number): string => {
        if (valueFormat) return valueFormat(val);
        return `${Math.round(val)}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{label}</Text>
                <Text style={[styles.value, { color }]}>
                    {formatValue(value)}
                </Text>
            </View>

            <View style={[styles.sliderTrack, { backgroundColor: `${color}20` }]}>
                <View
                    style={[
                        styles.sliderFill,
                        {
                            width: `${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%`,
                            backgroundColor: color
                        }
                    ]}
                />
                <Slider
                    style={styles.slider}
                    minimumValue={minimumValue}
                    maximumValue={maximumValue}
                    value={value}
                    onValueChange={onValueChange}
                    step={step}
                    minimumTrackTintColor="transparent"
                    maximumTrackTintColor="transparent"
                    thumbTintColor={color}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        gap: 8,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
    },
    sliderTrack: {
        height: 6,
        borderRadius: 3,
        position: 'relative',
    },
    sliderFill: {
        height: '100%',
        borderRadius: 3,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    slider: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
});