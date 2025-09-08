import { useEffect, useRef } from "react";


const NAVER_SRC =
  `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVERMAP_API_CID}`;

function loadScriptOnce(src: string) {
  return new Promise<void>((resolve, reject) => {
    // 이미 로드된 경우
    if (document.querySelector(`script[src^="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Naver Maps API"));
    document.body.appendChild(s);
  });
}

export default function MapSection() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadScriptOnce(NAVER_SRC)
      .then(() => {
        // @ts-expect-error - Naver Maps API를 위한 타입 정의
        const { naver } = window;
        if (!naver || !mapRef.current) return;

        const markerMap = new naver.maps.Map(mapRef.current, {
          center: new naver.maps.LatLng(37.5665, 126.9780), // TODO: 예식장 좌표로 변경
          zoom: 15,
        });

        new naver.maps.Marker({
          position: new naver.maps.LatLng(37.5665, 126.9780), // TODO: 예식장 좌표와 동일하게 수정
          map: markerMap,
          title: "예식장",
        });
      })
      .catch(console.error);

    return () => {
      // DOM 언마운트로 지도도 함께 정리됩니다.
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: 400, borderRadius: 12, overflow: "hidden" }}
      aria-label="오시는 길 지도"
    />
  );
}