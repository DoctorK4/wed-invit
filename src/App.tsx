import { addRSVP } from "./api/addRSVP";
import { useState } from "react";
import { addToCalendar } from "./service/addToCalendar";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // 라이트박스에 사용할 슬라이드 데이터 (이미지 경로는 프로젝트에 맞게 교체하세요)
  const slides = [
    { src: "/images/gallery1.png", alt: "사진 1" },
    { src: "/images/gallery2.png", alt: "사진 2" },
    { src: "/images/gallery3.png", alt: "사진 3" },
    { src: "/images/gallery4.png", alt: "사진 4" },
  ];

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addRSVP(name, phone);
      setIsSubmitted(true);
      setName("");
      setPhone("");
    } catch (error) {
      console.error("RSVP 전송 실패:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-md mx-auto px-6 py-8">
        
        {/* Header Section */}
        <section className="text-center mb-8">
          <div className="mb-4">
            {/* <h1 className="text-4xl font-light text-white mb-2">
             희진 & 동률
            </h1>
            <div className="text-2xl mb-4">🤵🏻‍♂️👰🏻‍♀️</div>
            <p className="text-gray-300 text-sm leading-relaxed">
              소중한 분들을 모시고<br/>
              인생의 새로운 출발을<br/>
              함께 축복받고자 합니다
            </p> */}
          </div>
        </section>

        {/* Main Photo Section */}
        <section className="mb-8">
          <div className="w-full h-[85vh] rounded-lg mb-4 overflow-hidden">
            <img 
              src="/images/Our Wedding.gif" 
              alt="희진 & 동률 결혼식" 
              className="w-full h-full object-contain"
            />
          </div>
        </section>

        {/* Wedding Info Section */}
        <section className="text-center mb-8 bg-gray-900/80 rounded-lg p-6 shadow-lg border border-gray-800">
          <h2 className="text-xl font-medium text-hot-pink-500 mb-4">Wedding Day</h2>
          <div className="space-y-2 text-gray-200">
            <p className="text-lg font-light">2025년 11월 2일 일요일</p>
            <p className="text-sm">오후 12시</p>
            <div className="mt-4">
              <p className="font-medium text-white">DITO 레스토랑 </p>
              <p className="text-sm text-gray-300">서울특별시 서초구 명달로 94</p>
            </div>
            <div className="mt-6">
              <button
                onClick={addToCalendar}
                className="bg-hot-pink-600 hover:bg-hot-pink-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm"
              >
                📅 캘린더에 저장
              </button>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mb-8">
          <h2 className="text-xl font-medium text-hot-pink-500 text-center mb-4">Gallery</h2>
          <div className="grid grid-cols-2 gap-3">
            {slides.map((s, i) => (
              <button
                key={i}
                type="button"
                className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700 focus:outline-none focus:ring-2 focus:ring-hot-pink-500"
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
                aria-label={`${s.alt} 크게 보기`}
              >
                <img src={s.src} alt={s.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Lightbox (모달) */}
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={lightboxIndex}
            slides={slides}
          />
        </section>

        {/* Contact Section */}
        <section className="text-center mb-8 bg-gray-900/80 rounded-lg p-6 shadow-lg border border-gray-800">
          <h2 className="text-xl font-medium text-hot-pink-500 mb-4">연락처</h2>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-medium text-white mb-2">신랑측</p>
              <p className="text-gray-300">아버지: 010-0000-0000</p>
              <p className="text-gray-300">어머니: 010-0000-0000</p>
              <p className="text-gray-300">신랑: 010-0000-0000</p>
            </div>
            <div>
              <p className="font-medium text-white mb-2">신부측</p>
              <p className="text-gray-300">아버지: 010-0000-0000</p>
              <p className="text-gray-300">어머니: 010-0000-0000</p>
              <p className="text-gray-300">신부: 010-0000-0000</p>
            </div>
          </div>
        </section>

        {/* Directions Section */}
        <section className="mb-8 bg-gray-900/80 rounded-lg p-6 shadow-lg border border-gray-800">
          <h2 className="text-xl font-medium text-hot-pink-500 text-center mb-4">오시는 길</h2>
          
          <div className="mb-4">
            <p className="text-center text-white font-medium mb-2">DITO 레스토랑</p>
            <p className="text-center text-gray-300 text-sm mb-4">서울특별시 서초구 명달로 94</p>
            
            {/* Naver Map */}
            <div className="w-full h-64 mb-4 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://map.naver.com/"
                title="DITTO 레스토랑 위치"
                className="border-0"
              />
            </div>
            
            {/* Map Links */}
            <div className="flex justify-center gap-4">
              <a
                href="https://map.kakao.com/link/search/서울특별시 서초구 명달로 94"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-lg transition duration-200 text-sm"
              >
                <span>
                  <img 
                    src="/images/kakao_map.png" 
                    alt="카카오맵 아이콘" 
                    className="w-4 h-4"
                  />
                </span>
                카카오맵
              </a>
              <a
                href="https://naver.me/x67yKre8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm"
              >
                <span>
                  <img 
                    src="/images/navermap.webp" 
                    alt="네이버지도 아이콘" 
                    className="w-4 h-4"
                  />
                </span>
                네이버지도
              </a>
            </div>
          </div>
        </section>

        {/* RSVP Section */}
        <section className="bg-gray-900/80 rounded-lg p-6 shadow-lg border border-gray-800">
          <h2 className="text-xl font-medium text-hot-pink-500 text-center mb-4">참석 의사 전달</h2>
          
          {isSubmitted ? (
            <div className="text-center p-4">
              <div className="text-hot-pink-500 text-lg mb-2">💖</div>
              <p className="text-hot-pink-400 font-medium">참석 의사가 전달되었습니다!</p>
              <p className="text-gray-300 text-sm mt-1">소중한 마음 감사드립니다.</p>
            </div>
          ) : (
            <form onSubmit={handleRSVP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  성함
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-hot-pink-500 text-white placeholder-gray-400"
                  placeholder="성함을 입력해주세요"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  연락처
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-hot-pink-500 text-white placeholder-gray-400"
                  placeholder="연락처를 입력해주세요"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-hot-pink-600 hover:bg-hot-pink-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
              >
                참석 의사 전달하기
              </button>
            </form>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center mt-8 text-gray-400 text-xs">
          <p>Developed by DRK</p>
        </footer>

      </div>
    </div>
  )
}

export default App
