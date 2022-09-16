import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
    // loadMap: () => void;
  }
}

function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [markerList, setMarkerList] = useState<any[]>([]);
  const map = useRef<any>(null);

  // const [map, setMap] = useState<any>();

  useEffect(() => {
    // window.loadMap();
    // const container = document.getElementById("map");
    // console.log(map);
    // var options = {
    //   center: new window.kakao.maps.LatLng(33.450701, 126.570667),
    //   level: 3,
    // };
    // var map = new window.kakao.maps.Map(container, options);
    // 2.
    // if (mapRef.current) {
    //   const container = document.getElementById("map");
    //   console.log(map);
    //   var options = {
    //     center: new window.kakao.maps.LatLng(33.450701, 126.570667),
    //     level: 3,
    //   };
    //   var map = new window.kakao.maps.Map(mapRef.current, options);
    // }

    const script = document.createElement("script");

    // 동적으로 로딩할 때는 &autoload=false 붙여줘야 함
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=a3ef0797e6cd7578b7c7f62fd6e6db6e&autoload=false";

    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (mapRef.current) {
          var options = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 8,
            // draggable: false,
          };
          map.current = new window.kakao.maps.Map(mapRef.current, options);
          //setMap(new window.kakao.maps.Map(mapRef.current, options));

          // 우클릭 시 마커 생성
          window.kakao.maps.event.addListener(
            map.current,
            "rightclick",
            (mouseEvent: any) => {
              const latlng = mouseEvent.latLng;

              const title = prompt("마커의 타이틀을 입력해주세요");

              var marker = new window.kakao.maps.Marker({
                map: map.current,
                position: latlng,
                title,
              });
              setMarkerList((prev) => [...prev, marker]);
            }
          );
        }
      });
    };
    return () => script.remove();
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          map.current.setCenter(
            new window.kakao.maps.LatLng(37.5642135, 127.0016985)
          );
          map.current.setLevel(10);
        }}
      >
        서울
      </button>
      <button
        onClick={() => {
          map.current.setCenter(
            new window.kakao.maps.LatLng(35.1379222, 129.05562775)
          );
          map.current.setLevel(5);
        }}
      >
        부산
      </button>
      <input
        type="range"
        min="1"
        max="10"
        onChange={(ev) => {
          map.current.setLevel(ev.currentTarget.value, { animate: true });
        }}
      />
      <button
        onClick={() => {
          map.current.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID);
        }}
      >
        지도 타입 변경
      </button>
      <div ref={mapRef} style={{ width: 300, height: 300 }}></div>
      {markerList.map((value) => (
        <div
          onClick={() => {
            value.setMap(null);
            setMarkerList(markerList.filter((v) => v !== value));
          }}
        >
          {value.getTitle()}
        </div>
      ))}
    </div>
  );
}

export default App;
