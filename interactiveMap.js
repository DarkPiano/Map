export default class InteractiveMap {
    constructor(mapId, onClick) {
        this.mapId = mapId;
        this.onClick = onClick;
    }

    async init() {
        await this.injectYMapsScript();
        await this.loadYMaps();
        this.initMap();
    }

    injectYMapsScript(){
        return new Promise((resolve) => {
            const ymapsScript = document.createElement('script');
            ymapsScript.src = 
            'https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=<df459064-3559-4bff-8e87-aa5e3c79b452>';
            document.body.appendChild(ymapsScript);
            ymapsScript.addEventListener('load', resolve);
        });
    }

    loadYMaps(){
        return new Promise((resolve) => ymaps.ready(resolve));
    }

    initMap(){
        this.clusterer = new ymaps.Clusterer({
            groupByCoordinates: true,
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: false,
        });
        this.clusterer.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });
        this.map = new ymaps.Map(this.mapId, {
            center: [55.76, 37.64],
            zoom: 10,
        });
        this.map.events.add('click', (e) => this.onClick(e.get('coords')));
        this.map.getObjects.add(this.clusterer);
    }

    openBalloon(coords, content) {
        this.map.ballon.open(coords, content);
    }
    
    setBallonContent(content) {
        this.map.ballon.setData(content);
    }
    
    closeBallon() {
        this.map.ballon.close();
    }

    createPlacemark(coords) {
        const placemark = new ymaps.Placemark(coords);
        placemark.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });
        this.clusterer.add(placemark);
    }
}