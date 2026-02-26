import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const STEP = 10;

const SHAPES = {
  square: { key: 'square', label: 'Square', width: 80, height: 80, color: '#4F46E5' },
  rectangle: { key: 'rectangle', label: 'Rectangle', width: 120, height: 80, color: '#0EA5E9' },
  circle: { key: 'circle', label: 'Circle', width: 80, height: 80, color: '#10B981' },
  triangle: { key: 'triangle', label: 'Triangle', width: 90, height: 80, color: '#F97316' },
  diamond: { key: 'diamond', label: 'Diamond', width: 90, height: 90, color: '#EC4899' }
};

export default function App() {
  const [selectedShapeKey, setSelectedShapeKey] = useState('square');
  const [playAreaSize, setPlayAreaSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const selectedShape = SHAPES[selectedShapeKey];

  const clampPosition = useCallback(
    (nextX, nextY) => {
      const { width, height } = playAreaSize;
      if (!width || !height) {
        return position;
      }

      const maxX = Math.max(0, width - selectedShape.width);
      const maxY = Math.max(0, height - selectedShape.height);

      return {
        x: Math.min(maxX, Math.max(0, nextX)),
        y: Math.min(maxY, Math.max(0, nextY))
      };
    },
    [playAreaSize, position, selectedShape.width, selectedShape.height]
  );

  const centerShape = useCallback(
    (areaWidth, areaHeight) => {
      const x = (areaWidth - selectedShape.width) / 2;
      const y = (areaHeight - selectedShape.height) / 2;
      setPosition(clampPosition(x, y));
    },
    [clampPosition, selectedShape.width, selectedShape.height]
  );

  const handlePlayAreaLayout = event => {
    const { width, height } = event.nativeEvent.layout;
    setPlayAreaSize({ width, height });
    centerShape(width, height);
  };

  const moveBy = (dx, dy) => {
    setPosition(prev => {
      const nextX = prev.x + dx;
      const nextY = prev.y + dy;
      return clampPosition(nextX, nextY);
    });
  };

  const handleSelectShape = key => {
    setSelectedShapeKey(key);
    if (playAreaSize.width && playAreaSize.height) {
      centerShape(playAreaSize.width, playAreaSize.height);
    }
  };

  const renderShape = () => {
    const { width, height, color, key } = selectedShape;

    if (key === 'triangle') {
      return (
        <View style={[styles.shapeContainer, { width, height }]}>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: width / 2,
              borderRightWidth: width / 2,
              borderBottomWidth: height,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color
            }}
          />
        </View>
      );
    }

    if (key === 'diamond') {
      return (
        <View style={[styles.shapeContainer, { width, height }]}>
          <View
            style={{
              width: width * 0.7,
              height: height * 0.7,
              backgroundColor: color,
              transform: [{ rotate: '45deg' }]
            }}
          />
        </View>
      );
    }

    const borderRadius = key === 'circle' ? width / 2 : 12;

    return (
      <View style={[styles.shapeContainer, { width, height }]}>
        <View
          style={{
            width,
            height,
            borderRadius,
            backgroundColor: color
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>Shape Mover</Text>
        <Text style={styles.subtitle}>Choose a shape, then move it with the arrows.</Text>
      </View>

      <View style={styles.shapeSelector}>
        {Object.values(SHAPES).map(shape => {
          const isSelected = shape.key === selectedShapeKey;
          return (
            <TouchableOpacity
              key={shape.key}
              style={[styles.shapeButton, isSelected && styles.shapeButtonSelected]}
              onPress={() => handleSelectShape(shape.key)}
            >
              <View style={[styles.shapePreview, { backgroundColor: shape.color }]} />
              <Text style={[styles.shapeButtonText, isSelected && styles.shapeButtonTextSelected]}>
                {shape.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.playAreaContainer} onLayout={handlePlayAreaLayout}>
        <View
          style={[
            styles.shapeWrapper,
            {
              left: position.x,
              top: position.y
            }
          ]}
        >
          {renderShape()}
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.arrowButtonSpacer} disabled>
            <Text />
          </TouchableOpacity>
          <TouchableOpacity style={styles.arrowButton} onPress={() => moveBy(0, -STEP)}>
            <Text style={styles.arrowText}>↑</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.arrowButtonSpacer} disabled>
            <Text />
          </TouchableOpacity>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.arrowButton} onPress={() => moveBy(-STEP, 0)}>
            <Text style={styles.arrowText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.arrowButton} onPress={() => moveBy(STEP, 0)}>
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.arrowButtonSpacer} disabled>
            <Text />
          </TouchableOpacity>
          <TouchableOpacity style={styles.arrowButton} onPress={() => moveBy(0, STEP)}>
            <Text style={styles.arrowText}>↓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.arrowButtonSpacer} disabled>
            <Text />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827'
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280'
  },
  shapeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  shapeButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center'
  },
  shapeButtonSelected: {
    backgroundColor: '#111827'
  },
  shapePreview: {
    width: 18,
    height: 18,
    borderRadius: 4,
    marginBottom: 4
  },
  shapeButtonText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600'
  },
  shapeButtonTextSelected: {
    color: '#F9FAFB'
  },
  playAreaContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden'
  },
  shapeWrapper: {
    position: 'absolute'
  },
  shapeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  controlsContainer: {
    paddingBottom: 16,
    paddingHorizontal: 32
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2
  },
  arrowButton: {
    width: 60,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8
  },
  arrowButtonSpacer: {
    width: 60,
    height: 44,
    marginHorizontal: 8
  },
  arrowText: {
    fontSize: 20,
    color: '#F9FAFB',
    fontWeight: '700'
  }
});

