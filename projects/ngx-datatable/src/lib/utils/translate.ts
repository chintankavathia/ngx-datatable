import { getVendorPrefixedName } from './prefixes';
import { camelCase } from './camel-case';

// browser detection and prefixing tools
const transform = typeof window !== 'undefined' ? getVendorPrefixedName('transform') : undefined;
const hasCSSTransforms =
  typeof window !== 'undefined' ? !!getVendorPrefixedName('transform') : undefined;
const hasCSS3DTransforms =
  typeof window !== 'undefined' ? !!getVendorPrefixedName('perspective') : undefined;
const ua = typeof window !== 'undefined' ? window.navigator.userAgent : 'Chrome';
const isSafari = /Safari\//.test(ua) && !/Chrome\//.test(ua);

export function translateXY(x: number, y: number): Record<string, string> {
  if (typeof transform !== 'undefined' && hasCSSTransforms) {
    if (!isSafari && hasCSS3DTransforms) {
      return {
        transform: `translate3d(${x}px, ${y}px, 0)`,
        backfaceVisibility: 'hidden'
      };
    } else {
      return { [camelCase(transform)]: `translate(${x}px, ${y}px)` };
    }
  } else {
    return {
      top: `${y}px`,
      left: `${x}px`
    };
  }
}
