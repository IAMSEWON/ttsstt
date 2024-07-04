import React from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import useThemeContext from '@/hooks/useThemeContext.ts';

type Category = {
  id: number;
  title: string;
  date: string;
  text: string;
};

const categoryList: Category[] = [
  {
    id: 1,
    title: 'title1',
    date: '2021-08-01',
    text: 'asabsjdbaskjdbkajsbdkjasbdkjasbkjasbdkjsabkjdbaskjbadskjbdkjsabdkjsabkdjsabkjdbsajkdbsakjbdaskjbdjksabdsakjbjk',
  },
  {
    id: 2,
    title: 'title2',
    date: '2021-08-02',
    text: 'text2',
  },
  {
    id: 3,
    title: 'title3',
    date: '2021-08-03',
    text: 'text3',
  },
  {
    id: 4,
    title: 'title4',
    date: '2021-08-04',
    text: 'text4',
  },
  {
    id: 5,
    title: 'title5',
    date: '2021-08-05',
    text: 'text5',
  },
  {
    id: 6,
    title: 'title6',
    date: '2021-08-06',
    text: 'text6',
  },
  {
    id: 7,
    title: 'title7',
    date: '2021-08-07',
    text: 'text7',
  },
  {
    id: 8,
    title: 'title8',
    date: '2021-08-08',
    text: 'text8',
  },
  {
    id: 9,
    title: 'title9',
    date: '2021-08-09',
    text: 'text9',
  },
  {
    id: 10,
    title: 'title10',
    date: '2021-08-10',
    text: 'text10',
  },
  {
    id: 11,
    title: 'title11',
    date: '2021-08-11',
    text: 'text11',
  },
  {
    id: 12,
    title: 'title12',
    date: '2021-08-12',
    text: 'text12',
  },
  {
    id: 13,
    title: 'title13',
    date: '2021-08-13',
    text: 'text13',
  },
  {
    id: 14,
    title: 'title14',
    date: '2021-08-14',
    text: 'text14',
  },
  {
    id: 15,
    title: 'title15',
    date: '2021-08-15',
    text: 'text15',
  },
  {
    id: 16,
    title: 'title16',
    date: '2021-08-16',
    text: 'text16',
  },
];

const screenWidth = Dimensions.get('window').width;
const numColumns = 2;
const gap = 10;
const availableSpace = screenWidth - (numColumns - 1) * gap;
const itemSize = availableSpace / numColumns;

function CategoryItem({ item }: { item: Category }) {
  const { colors } = useThemeContext();
  return (
    <View
      style={{
        height: itemSize - gap, // Adjusted size to account for margin
        width: itemSize - gap, // Adjusted size to account for margin
        padding: 10,
        borderRadius: 20,
        overflow: 'hidden',
        gap: 10,
        backgroundColor: colors.cardBackground,
      }}
    >
      <Text style={{ fontSize: 23, fontWeight: 'bold', color: colors.text }}>{item.title}</Text>
      <View style={{ height: 1, width: '100%', backgroundColor: '#f1f3f5' }} />
      <Text style={{ fontSize: 23, fontWeight: 'bold', color: colors.text, marginBottom: 6 }}>{item.text}</Text>
      <Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.text, position: 'absolute', bottom: 6, right: 6 }}>
        {item.date}
      </Text>
      <LinearGradient
        colors={['transparent', colors.cardBackground]} // Adjust these colors to match your desired shadow effect
        style={{
          zIndex: 999,
          borderRadius: 10,
          position: 'absolute',
          bottom: -10,
          height: 40,
          shadowRadius: 20,
          width: itemSize - gap,
          overflow: 'hidden', // Ensures the gradient respects the borderRadius
        }}
      />
    </View>
  );
}

function CategoryList() {
  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
      <FlatList
        data={categoryList}
        numColumns={numColumns}
        key={numColumns}
        keyExtractor={(item) => `${item.id}-${item.title}`}
        contentContainerStyle={{ gap, paddingVertical: 10 }}
        columnWrapperStyle={{ gap }}
        renderItem={({ item }) => <CategoryItem item={item} />}
      />
    </View>
  );
}

export default CategoryList;
