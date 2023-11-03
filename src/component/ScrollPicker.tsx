import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  Ref,
} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

function isNumeric(str: string | unknown): boolean {
  if (typeof str === 'number') return true;
  if (typeof str !== 'string') return false;
  return (
    !isNaN(str as unknown as number) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

const isViewStyle = (style: ViewProps['style']): style is ViewStyle => {
  return (
    typeof style === 'object' &&
    style !== null &&
    Object.keys(style).includes('height')
  );
};

export type ScrollPickerProps<ItemT extends string | number> = {
  style?: ViewProps['style'];
  dataSource: Array<ItemT>;
  selectedValue?: number;
  onValueChange?: (value: ItemT, index: number) => void;
  renderItem?: (data: ItemT, index: number, isSelected: boolean) => JSX.Element;
  highlightColor?: string;
  highlightBorderWidth?: number;
  itemTextStyle?: object;
  activeItemTextStyle?: object;
  itemHeight?: number;
  wrapperHeight?: number;
  wrapperBackground?: string;
  scrollViewComponent?: any;
  type?: 'day' | 'month' | 'year';
};

export type ScrollPickerHandle = {
  scrollToTargetIndex: (val: number) => void;
};

const ScrollPicker: {
  <ItemT extends string | number>(
    props: ScrollPickerProps<ItemT> & {ref?: Ref<ScrollPickerHandle>},
  ): any;
} = React.forwardRef((propsState, ref) => {
  const {itemHeight = 30, style, scrollViewComponent, ...props} = propsState;
  const [initialized, setInitialized] = useState(false);
  const [selectedValue, setSelectedValue] = useState<any>(
    props.selectedValue && props.selectedValue >= 0 ? props.selectedValue : 0,
  );
  const sView = useRef<ScrollView>(null);
  const [isScrollTo, setIsScrollTo] = useState(false);
  const [dragStarted, setDragStarted] = useState(false);
  const [momentumStarted, setMomentumStarted] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useImperativeHandle(ref, () => ({
    scrollToTargetIndex: (val: number) => {
      console.log(val, 'val');
      setSelectedValue(val);
      sView?.current?.scrollTo({y: val * itemHeight});
    },
  }));

  const wrapperHeight =
    props.wrapperHeight ||
    (isViewStyle(style) && isNumeric(style.height)
      ? Number(style.height)
      : 0) ||
    itemHeight * 5;

  useEffect(
    function initialize() {
      if (initialized) return;
      setInitialized(true);

      setTimeout(() => {
        const index = props.dataSource.findIndex(item => item === selectedValue)
        const y = itemHeight * index;
        sView?.current?.scrollTo({y: y});
      }, 0);

      return () => {
        timer && clearTimeout(timer);
      };
    },
    [initialized, itemHeight, selectedValue, sView, timer],
  );

  const renderPlaceHolder = () => {
    const h = (wrapperHeight - itemHeight) / 2;
    const header = <View style={{height: h, flex: 1}} />;
    const footer = <View style={{height: h, flex: 1}} />;
    return {header, footer};
  };

  const renderItem = (data: (typeof props.dataSource)[0], index: number) => {
    const selectIndex = props.dataSource.findIndex(item => item === selectedValue)
    const isSelected = index === selectIndex;
    const item = props.renderItem ? (
      props.renderItem(data, index, isSelected)
    ) : (
      <Text
        style={
          isSelected
            ? [
                props.activeItemTextStyle
                  ? props.activeItemTextStyle
                  : styles.activeItemTextStyle,
              ]
            : [props.itemTextStyle ? props.itemTextStyle : styles.itemTextStyle]
        }>
        {data}
      </Text>
    );

    return (
      <View style={[styles.itemWrapper, {height: itemHeight}]} key={index}>
        {item}
      </View>
    );
  };
  const scrollFix = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      let y = 0;
      const h = itemHeight;
      if (e.nativeEvent.contentOffset) {
        y = e.nativeEvent.contentOffset.y;
      }
      const _selectedIndex = Math.round(y / h);
      const selectIndex = props.dataSource.findIndex(item => item === selectedValue)

      const _y = _selectedIndex * h;
      if (_y !== y) {
        // using scrollTo in ios, onMomentumScrollEnd will be invoked
        if (Platform.OS === 'ios') {
          setIsScrollTo(true);
        }
        sView?.current?.scrollTo({y: _y});
      }
      if (selectIndex === _selectedIndex) {
        return;
      }
      // onValueChange
      if (props.onValueChange) {
        const selectedValues = props.dataSource[_selectedIndex];
        setSelectedValue(selectedValues);
        props.onValueChange(selectedValues, _selectedIndex);
      }
    },
    [itemHeight, props, selectedValue],
  );

  const onScrollBeginDrag = () => {
    setDragStarted(true);

    if (Platform.OS === 'ios') {
      setIsScrollTo(false);
    }
    timer && clearTimeout(timer);
  };

  const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setDragStarted(false);

    // if not used, event will be garbaged
    const _e: NativeSyntheticEvent<NativeScrollEvent> = {...e};
    timer && clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        if (!momentumStarted) {
          scrollFix(_e);
        }
      }, 50),
    );
  };
  const onMomentumScrollBegin = () => {
    setMomentumStarted(true);
    timer && clearTimeout(timer);
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setMomentumStarted(false);

    if (!isScrollTo && !dragStarted) {
      scrollFix(e);
    }
  };

  const {header, footer} = renderPlaceHolder();
  const highlightColor = props.highlightColor || '#333';
  const highlightBorderWidth =
    props.highlightBorderWidth || StyleSheet.hairlineWidth;

  const wrapperStyle: ViewStyle = {
    height: 200,
    flex: 1,
    backgroundColor: props.wrapperBackground || '#ef0808',
    overflow: 'hidden',
  };

  const highlightStyle: ViewStyle = {
    position: 'absolute',
    top: (wrapperHeight - itemHeight) / 2,
    height: itemHeight,
    width: 75,
    borderTopColor: highlightColor,
    borderBottomColor: highlightColor,
    borderTopWidth: highlightBorderWidth,
    borderBottomWidth: highlightBorderWidth,
    marginLeft: 30
  };

  const CustomScrollViewComponent = scrollViewComponent || ScrollView;

  return (
    <View style={wrapperStyle}>
      <View style={highlightStyle} />
      <CustomScrollViewComponent
        ref={sView}
        bounces={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        onMomentumScrollBegin={(_e: any) => onMomentumScrollBegin()}
        onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
          onMomentumScrollEnd(e)
        }
        onScrollBeginDrag={(_e: any) => onScrollBeginDrag()}
        onScrollEndDrag={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
          onScrollEndDrag(e)
        }>
        {header}
        {props.dataSource.map(renderItem)}
        {footer}
      </CustomScrollViewComponent>
    </View>
  );
});
export default ScrollPicker;

const styles = StyleSheet.create({
  itemWrapper: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTextStyle: {
    color: '#999',
  },
  activeItemTextStyle: {
    color: '#333',
    fontWeight: 'bold'
  },
});
