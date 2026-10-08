/**
 * HTML-based cluster layout for Yandex Maps 2.1.
 * We use a pure DOM element layout (templateLayoutFactory.createClass)
 * instead of external SVG/PNG image hrefs so the solid blue circle is guaranteed
 * to render with 100% reliability in all browsers, viewports and iframes.
 */

export function getClustererOptions(ymaps: any) {
  // Pure HTML custom cluster layout
  const CustomClusterLayout = ymaps.templateLayoutFactory.createClass(
    '<div class="schtandart-cluster-circle" style="width: 50px; height: 50px; margin-left: -25px; margin-top: -25px; font-size: 17px;">$[properties.geoObjects.length]</div>',
    {
      build: function () {
        CustomClusterLayout.superclass.build.call(this);

        const element = this.getParentElement().querySelector(
          '.schtandart-cluster-circle'
        );
        if (!element) return;

        const count = this.getData().properties.get('geoObjects').length;

        // Progressive size scaling with a strict minimum of 50x50 px:
        // 2–4 objects: 50px (font 17px)
        // 5–9 objects: 62px (font 19px)
        // 10–19 objects: 74px (font 21px)
        // 20–34 objects: 88px (font 23px)
        // 35+ objects: 104px (font 26px)
        let size = 50;
        let fontSize = 17;
        let bg = '#0284c7'; // Vibrant solid sky blue

        if (count >= 35) {
          size = 104;
          fontSize = 26;
          bg = '#075985';
        } else if (count >= 20) {
          size = 88;
          fontSize = 23;
          bg = '#0369a1';
        } else if (count >= 10) {
          size = 74;
          fontSize = 21;
          bg = '#0369a1';
        } else if (count >= 5) {
          size = 62;
          fontSize = 19;
          bg = '#0284c7';
        }

        element.style.width = size + 'px';
        element.style.height = size + 'px';
        element.style.marginLeft = -Math.round(size / 2) + 'px';
        element.style.marginTop = -Math.round(size / 2) + 'px';
        element.style.fontSize = fontSize + 'px';
        element.style.backgroundColor = bg;
      },
    }
  );

  return {
    clusterIconLayout: CustomClusterLayout,
    clusterIconShape: {
      type: 'Circle',
      coordinates: [0, 0],
      radius: 40,
    },
    groupByCoordinates: false,
    clusterDisableClickZoom: false,
    clusterHideIconOnBalloonOpen: false,
    gridSize: 72,
    maxZoom: 16,
  };
}
