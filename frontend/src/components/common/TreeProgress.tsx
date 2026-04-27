import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect, Ellipse, Circle } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { treeProgressStyles } from '../../styles';

interface TreeProgressProps {
  progress: number; // 0-100 arası
}

export default function TreeProgress({ progress }: TreeProgressProps) {
  const { theme } = useTheme();
  const filledSteps = Math.floor(progress / 25); // 0,1,2,3,4
  const leavesOpacity = [0, 1, 2, 3].map(i => (i < filledSteps ? 1 : 0));
  const starOpacity = filledSteps >= 4 ? 1 : 0;

  const titles = ['Profilini tamamla 🌱', 'E-postanı ekle 🌿', 'Şifreni oluştur 🌳', 'Tamamlandı! 🌟'];
  const subs = ['Ağacın filizleniyor...', 'Kök tuttu, büyüyor!', 'Neredeyse tamam!', 'Topluluğa hoş geldin!'];
  const currentIndex = Math.min(filledSteps, 3);

  return (
    <View style={[treeProgressStyles.wrap, { borderColor: theme.border, backgroundColor: theme.surface }]}>
      <Svg width={56} height={64} viewBox="0 0 56 64">
        <Rect x={24} y={44} width={8} height={18} rx={4} fill="#A16207" />
        <Ellipse cx={28} cy={38} rx={12} ry={14} fill={theme.accent} opacity={leavesOpacity[0]} />
        <Ellipse cx={16} cy={30} rx={9} ry={11} fill={theme.accentDark} opacity={leavesOpacity[1]} />
        <Ellipse cx={40} cy={28} rx={9} ry={11} fill={theme.accent} opacity={leavesOpacity[2]} />
        <Ellipse cx={28} cy={20} rx={10} ry={12} fill="#34D399" opacity={leavesOpacity[3]} />
        <Circle cx={28} cy={10} r={5} fill="#FCD34D" opacity={starOpacity} />
      </Svg>
      <View style={treeProgressStyles.textWrap}>
        <Text style={[treeProgressStyles.title, { color: theme.text2 }]}>{titles[currentIndex]}</Text>
        <Text style={[treeProgressStyles.sub, { color: theme.text4 }]}>{subs[currentIndex]}</Text>
        <View style={[treeProgressStyles.track, { backgroundColor: theme.accentLight }]}>
          <View style={[treeProgressStyles.fill, { width: `${progress}%`, backgroundColor: theme.accent }]} />
        </View>
      </View>
    </View>
  );
}