export function getSlideDirection(isRTL: boolean) {
  return {
    enterFrom: isRTL ? 50 : -50,
    enterTo: 0,
    exitFrom: 0,
    exitTo: isRTL ? -50 : 50,
  }
}
