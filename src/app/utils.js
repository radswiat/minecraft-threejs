export default class Utils {

  static toDeg(rad) {
    return rad * 180 / Math.PI;
  }

  static toRad(deg) {
    return deg * Math.PI / 180;
  }

  static degAbs(deg) {
    return deg - (Math.floor((deg / 360)) * 360);
  }

  static defined(object) {
    if(typeof object !== 'undefined') {
      return true;
    }
    return false;
  }

}