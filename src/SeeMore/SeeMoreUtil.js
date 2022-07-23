import { PixelRatio } from 'react-native';
import reactNativeTextSize from 'react-native-text-size';


/**
 * Finds the point where the text will be truncated, leaving enough space to show
 * the "read more" link
 *
 * @param text {string} Text for which you need to find the truncation index
 * @param numberOfLines {number} Number of lines being displayed
 * @param fontSize {number} Font size
 * @param fontFamily {string} Font family
 * @param fontWeight {string} Font weight
 * @param containerWidth {number} Width of the container in which the text will be contained
 * @param seeMoreText {string} See more text
 */
async function getTruncationIndex(
  text,
  numberOfLines,
  fontSize,
  fontFamily,
  fontWeight,
  containerWidth,
  seeMoreText,
) {
  const scaledFontSize = Math.round(fontSize * PixelRatio.getFontScale());

  const widthLimit = (containerWidth);

  const { width: seeMoreWidth } = await reactNativeTextSize.measure({
    text: seeMoreText,
    fontSize: scaledFontSize,
    fontFamily,
    fontWeight,
  })

  const { lineCount: totalCount } = await reactNativeTextSize.measure({
    text,
    width: containerWidth,
    fontSize: scaledFontSize,
    fontFamily,
    fontWeight,
  });

  if (totalCount < numberOfLines) {
    return undefined;
  }

  // console.log("======", text);
  // console.log(`lineCount:${totalCount} `)

  let index = 0;
  let start = 0;
  let end = text.length;
  var needMore = false;

  while (start <= end) {
    const middle = end;

    // eslint-disable-next-line no-await-in-loop
    const { lastLineWidth, lineCount } = await reactNativeTextSize.measure({
      text: text.slice(0, middle),
      width: containerWidth,
      fontSize: scaledFontSize,
      fontFamily,
      fontWeight,
      usePreciseWidth: true,
    });
    // console.log(start, end, lineCount);

    if (lineCount > numberOfLines + 1) {
      end = start + (middle - 1 - start) / 2;
      continue
    } else if (lineCount < numberOfLines) {
      start = middle + 1;
      end = start + (end - start) / 2;
      continue
    }

    // console.log(`lastLineWidth: ${lastLineWidth + seeMoreWidth}  widthLimit:${widthLimit} lineCount:${lineCount}`);

    if (lineCount > numberOfLines || lastLineWidth + seeMoreWidth > widthLimit) {
      // console.log((lastLineWidth + seeMoreWidth));
      // console.log(text.slice(0, middle));
      end = middle - 1;
      needMore = true;
    } else {
      // console.log(text.slice(0, middle));
      index = needMore ? middle - 2 : middle;
      break;
    }
  }

  let truncationIndex = Math.floor(index);
  return truncationIndex;
}

export default {
  getTruncationIndex,
};
