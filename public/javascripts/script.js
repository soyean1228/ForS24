var urlParams = location.search.split(/[?&]/).slice(1).map(function(paramPair) {

    return paramPair.split(/=(.+)?/).slice(0, 2);

}).reduce(function(obj, pairArray) {

    obj[pairArray[0]] = pairArray[1];

    return obj;

}, {});

// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
var infowindow = new daum.maps.InfoWindow({zIndex:1}),
   contentNode = document.createElement('div'), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다 ;
   markers = []; // 마커를 담을 배열입니다

var searchAddress=" ";
searchAddress = urlParams.searchAddress;
searchAddress = decodeURI(searchAddress);

var geocoder = new daum.maps.services.Geocoder();

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
		 mapOption = {
		    center: new daum.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
			//center: new daum.maps.LatLng(result[0].y,result[0].x), // 지도의 중심좌표
			level: 3 // 지도의 확대 레벨
         };
         
var callback = function(result, status) {
    if (status === daum.maps.services.Status.OK) {
		var bounds = new daum.maps.LatLng(result[0].y,result[0].x);
		map.setCenter(bounds);
	}
};

// 지도를 생성합니다
var map = new daum.maps.Map(mapContainer, mapOption);

geocoder.addressSearch(searchAddress, callback);


// 장소 검색 객체를 생성합니다
var ps = new daum.maps.services.Places(map);

// 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
// 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 daum.maps.event.preventMap 메소드를 등록합니다 
addEventHandle(contentNode, 'mousedown', daum.maps.event.preventMap);
addEventHandle(contentNode, 'touchstart', daum.maps.event.preventMap);

// 카테고리로 은행을 검색합니다
ps.categorySearch('CS2', placesSearchCB, {useMapBounds:true});

// 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다
contentNode.className = 'placeinfo_wrap';

// 카테고리 검색을 요청하는 함수입니다
function searchPlaces() {

    // 커스텀 오버레이를 숨깁니다
    infowindow.setMap(null);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();

    ps.categorySearch('CS2', placesSearchCB, {useMapBounds:true});

}

// 지도에 idle 이벤트를 등록합니다
daum.maps.event.addListener(map, 'idle', function(){
    // 커스텀 오버레이를 숨깁니다
   infowindow.setMap(null);

   // 지도에 표시되고 있는 마커를 제거합니다
   removeMarker();

   ps.categorySearch('CS2', placesSearchCB, {useMapBounds:true}); 

});

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB (data, status, pagination) {

    if (status === daum.maps.services.Status.OK) {
		//검색된장소 위치를 기준으로 지도 범위를 재설정하기 위해 
		//LatLngBounds 객체에 좌표를 추가합니다. 
        var bounds = new daum.maps.LatLngBounds();
        for (var i=0; i<data.length; i++) {
            displayMarker(data[i]);
            bounds.extend(new daum.maps.LatLng(data[i].y, data[i].x));
        }
    }
}

// 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
function addEventHandle(target, type, callback) {
    if (target.addEventListener) {
        target.addEventListener(type, callback);
    } else {
        target.attachEvent('on' + type, callback);
    }
}

// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {
    // 마커를 생성하고 지도에 표시합니다
    var marker = new daum.maps.Marker({
        map: map,
        position: new daum.maps.LatLng(place.y, place.x)
    });
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    // 마커에 클릭이벤트를 등록합니다
    daum.maps.event.addListener(marker, 'click', function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
      var content = '<div class="placeinfo">' +
                    '   <a class="title" href="' + place.place_url + '" target="_blank" title="' + place.place_name + '">' + place.place_name + '</a>';
      if (place.road_address_name) {
        content += '    <span title="' + place.road_address_name + '">' + place.road_address_name + '</span>' +
                    '  <span class="jibun" title="' + place.address_name + '">(지번 : ' + place.address_name + ')</span>';
      }  else {
        content += '    <span title="' + place.address_name + '">' + place.address_name + '</span>';
      }
      content += '    <span class="tel">' + place.phone + '</span>' +
                '</div>' +
                '<div class="after"></div>';

        contentNode.innerHTML = content;
        infowindow.setContent(content);
        infowindow.open(map, marker);
    });
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }
    markers = [];
}