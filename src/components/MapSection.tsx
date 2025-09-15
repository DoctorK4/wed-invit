// 네이버 지도: 주소 → 좌표 → 마커 표시 컴포넌트
import { useEffect, useRef } from 'react'

// 환경변수에서 클라이언트 ID 로드 (Vite)
const CLIENT_ID = import.meta.env.VITE_NAVERMAP_API_CID as string | undefined

// 전역 타입 최소 선언
declare global {
  interface Window {
    naver: any
  }
}

// 스크립트를 단 한 번만 로드하기 위한 싱글톤 프라미스
let naverLoader: Promise<any> | null = null
function waitForGeocoder(naver: any, timeout = 7000): Promise<any> {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const tick = () => {
      if (naver?.maps?.Service?.geocode) return resolve(naver)
      if (Date.now() - start > timeout) return reject(new Error('geocoder not ready'))
      requestAnimationFrame(tick)
    }
    tick()
  })
}
function loadNaverMaps(): Promise<any> {
  if (typeof window !== 'undefined' && (window as any).naver?.maps) {
    return Promise.resolve((window as any).naver)
  }
  if (!naverLoader) {
    if (!CLIENT_ID) {
      console.error('[MapSection] VITE_NAVERMAP_API_CID 가 설정되어 있지 않습니다.')
    }
    const src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${CLIENT_ID}&submodules=geocoder`
    naverLoader = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src^=\"https://oapi.map.naver.com/openapi/v3/maps.js\"]`)
      if (existing) {
        existing.addEventListener('load', () => resolve((window as any).naver))
        existing.addEventListener('error', reject)
        return
      }
      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.defer = true
      script.onload = () => resolve((window as any).naver)
      script.onerror = (e) => reject(e)
      document.head.appendChild(script)
    })
  }
  return naverLoader
}

export default function MapSection({ address }: { address: string }) {
  const mapElRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!address || !mapElRef.current) return

    let marker: any | null = null
    let map: any | null = null
    let cancelled = false

    loadNaverMaps()
      .then((naver) => {
        if (cancelled) return
        // 우선 임시 중심(서울 시청)으로 맵 생성 후, 지오코딩 결과로 재중심
        map = new naver.maps.Map(mapElRef.current!, {
          center: new naver.maps.LatLng(37.5665, 126.978),
          zoom: 14,
        })

        return waitForGeocoder(naver).then(() => {
          naver.maps.Service.geocode({ query: address }, (status: string, response: any) => {
            if (cancelled) return
            if (status !== naver.maps.Service.Status.OK) {
              console.warn('[MapSection] 지오코딩 실패:', status)
              return
            }
            const result = response.v2
            const item = result?.addresses?.[0]
            if (!item) {
              console.warn('[MapSection] 주소 결과가 없습니다:', address)
              return
            }
            const lat = parseFloat(item.y)
            const lng = parseFloat(item.x)
            const latLng = new naver.maps.LatLng(lat, lng)

            map?.setCenter(latLng)
            if (marker) marker.setMap(null)
            marker = new naver.maps.Marker({ position: latLng, map })
          })
        })
      })
      .catch((e) => {
        console.error('[MapSection] Naver Maps 로드 실패:', e)
      })

    return () => {
      cancelled = true
      if (marker) {
        try { marker.setMap(null) } catch {}
      }
      // Naver Maps는 명시적인 destroy가 없어 DOM만 정리
    }
  }, [address])

  return (
    <div
      ref={mapElRef}
      style={{ 
        width: '100%', 
        height: 400, 
        borderRadius: 12, 
        overflow: 'hidden',
        touchAction: 'pan-x pan-y'
      }}
      aria-label="오시는 길 지도"
    />
  )
}
