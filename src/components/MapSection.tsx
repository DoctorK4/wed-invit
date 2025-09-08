// 예: src/components/MapSection.tsx
import { useEffect, useRef } from "react";

interface NaverMap {
  maps: {
    Map: unknown;
    LatLng: unknown;
  };
}

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
    let map: NaverMap | null = null;


    loadScriptOnce(NAVER_SRC)
      .then(() => {
        // @ts-expect-error - Naver Maps API를 위한 타입 정의
        const { naver } = window;
        if (!naver || !mapRef.current) return;

        map = new naver.maps.Map(mapRef.current, {
          center: new naver.maps.LatLng(37.5665, 126.9780), // TODO: 예식장 좌표로 변경
          zoom: 15,
        });

        // 마커 예시 (필요 시)
        // new naver.maps.Marker({
        //   position: new naver.maps.LatLng(37.5665, 126.9780),
        //   map,
        //   title: "예식장",
        // });
      })
      .catch(console.error);

    // 언마운트 시 지도 DOM 정리
    return () => {
      // Naver Maps는 별도 dispose가 없어도 DOM 언마운트로 정리됨
      map = null;
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