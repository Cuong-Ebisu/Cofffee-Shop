import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import GradientBGIcon from './GradientBGIcon';
import ProfilePic from './ProfilePic';
import SideMenu from './SideMenu';

interface HeaderBarProps {
  title?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({title}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <>
      <View style={styles.HeaderContainer}>
        <TouchableOpacity onPress={toggleMenu}>
          <GradientBGIcon
            name="menu"
            color={COLORS.WhiteSmoke}
            size={FONTSIZE.size_16}
          />
        </TouchableOpacity>
        <Text style={styles.HeaderText}>{title}</Text>
        <ProfilePic />
      </View>
      {isMenuVisible && <SideMenu onClose={toggleMenu} />}
    </>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    padding: SPACING.space_20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
});

export default HeaderBar;
