import React, { useRef } from 'react';
import {
  View,
  FlatList,
  Pressable,
  ScrollView,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { type CardItem } from '../../api/types';
import { useLessonMachine } from '../../features/lesson/lessonMachine';

export interface CardsStepProps {
  cards: CardItem[];
  topicColor?: string;
  onStartPractice: () => void;
}

export const CardsStep: React.FC<CardsStepProps> = ({
  cards,
  topicColor = '#4F46E5',
  onStartPractice,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const CARD_WIDTH = SCREEN_WIDTH - 40; // 20px padding on each side

  const flatListRef = useRef<FlatList>(null);
  const currentCardIndex = useLessonMachine((s) => s.currentCardIndex);
  const setCardIndex = useLessonMachine((s) => s.setCardIndex);
  const revealedKeyTerms = useLessonMachine((s) => s.revealedKeyTerms);
  const toggleKeyTerm = useLessonMachine((s) => s.toggleKeyTerm);

  const isLastCard = currentCardIndex === cards.length - 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);
    if (index >= 0 && index < cards.length && index !== currentCardIndex) {
      setCardIndex(index);
    }
  };

  const handleNextPress = () => {
    if (isLastCard) {
      onStartPractice();
    } else {
      const nextIndex = currentCardIndex + 1;
      setCardIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const renderCardItem = ({ item }: { item: CardItem }) => {
    return (
      <View style={{ width: CARD_WIDTH }} className="px-1">
        <Card className="flex-1 p-5 bg-surface border-border justify-between">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {/* Emoji and Title */}
            <View className="flex-row items-center gap-3 mb-4">
              <View
                style={{ backgroundColor: `${topicColor}15` }}
                className="w-12 h-12 rounded-xl items-center justify-center border border-slate-100"
              >
                <AppText className="text-2xl">{item.emoji}</AppText>
              </View>
              <AppText variant="h3" className="flex-1 text-text">
                {item.title}
              </AppText>
            </View>

            {/* Body */}
            <AppText
              variant="body"
              className="text-slate-700 leading-6 mb-5 text-base"
            >
              {item.body}
            </AppText>

            {/* Key Terms */}
            {item.keyTerms && item.keyTerms.length > 0 ? (
              <View className="mt-auto pt-3 border-t border-slate-100">
                <AppText
                  variant="caption"
                  className="font-bold text-muted uppercase text-[11px] mb-2.5 tracking-wider"
                >
                  Key Concepts (Tap to reveal)
                </AppText>

                <View className="gap-2">
                  {item.keyTerms.map((kt) => {
                    const isRevealed = Boolean(revealedKeyTerms[kt.term]);
                    return (
                      <Pressable
                        key={kt.term}
                        onPress={() => toggleKeyTerm(kt.term)}
                        className={`p-3 rounded-xl border transition-all ${
                          isRevealed
                            ? 'bg-indigo-50/70 border-indigo-200'
                            : 'bg-slate-50 border-border active:bg-slate-100'
                        }`}
                        accessibilityRole="button"
                        accessibilityLabel={`Key term: ${kt.term}`}
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center gap-2 flex-1">
                            <Ionicons
                              name={isRevealed ? 'bulb' : 'bulb-outline'}
                              size={16}
                              color={isRevealed ? '#4F46E5' : '#64748B'}
                            />
                            <AppText
                              variant="caption"
                              className={`font-bold text-sm ${
                                isRevealed ? 'text-primary' : 'text-text'
                              }`}
                            >
                              {kt.term}
                            </AppText>
                          </View>
                          <Ionicons
                            name={isRevealed ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color="#94A3B8"
                          />
                        </View>

                        {isRevealed ? (
                          <View className="mt-2 pt-2 border-t border-indigo-100">
                            <AppText
                              variant="caption"
                              className="text-slate-700 leading-5 text-xs"
                            >
                              {kt.definition}
                            </AppText>
                          </View>
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </ScrollView>
        </Card>
      </View>
    );
  };

  return (
    <View className="flex-1 justify-between px-5 pb-6">
      {/* Top Card Tracker & Dots */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <AppText variant="caption" className="font-bold text-slate-700">
          Card {currentCardIndex + 1} of {cards.length}
        </AppText>

        <View className="flex-row items-center gap-1.5">
          {cards.map((_, idx) => {
            const isActive = idx === currentCardIndex;
            return (
              <View
                key={idx}
                style={{
                  width: isActive ? 18 : 6,
                  height: 6,
                  backgroundColor: isActive ? topicColor : '#CBD5E1',
                }}
                className="rounded-full"
              />
            );
          })}
        </View>
      </View>

      {/* Swipeable FlatList */}
      <View className="flex-1 mb-4">
        <FlatList
          ref={flatListRef}
          data={cards}
          keyExtractor={(_, index) => `card-${index}`}
          renderItem={renderCardItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
          getItemLayout={(_, index) => ({
            length: CARD_WIDTH,
            offset: CARD_WIDTH * index,
            index,
          })}
        />
      </View>

      {/* Bottom CTA */}
      <Button
        title={isLastCard ? 'Start Practice' : 'Next Card'}
        variant="primary"
        onPress={handleNextPress}
        className="w-full"
      />
    </View>
  );
};
