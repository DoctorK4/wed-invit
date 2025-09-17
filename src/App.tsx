import { addRSVP } from "./api/addRSVP";
import { useEffect, useRef, useState } from "react";
// import { addToCalendar } from "./service/addToCalendar";
import Gallery from "./components/Gallery";
import "yet-another-react-lightbox/styles.css";
import MapSection from "./components/MapSection";
import { motion } from "framer-motion";

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollLockRef = useRef(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [transportation, setTransportation] = useState("no");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showMusicPrompt, setShowMusicPrompt] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  // 라이트박스에 사용할 슬라이드 데이터 (이미지 경로는 프로젝트에 맞게 교체하세요)
  const slides = [
    { src: "/images/gallery1.png", alt: "사진 1" },
    { src: "/images/gallery2.jpeg", alt: "사진 2" },
    { src: "/images/gallery3.jpeg", alt: "사진 3" },
    { src: "/images/gallery4.jpeg", alt: "사진 4" },
  ];

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Ensure muted before attempting autoplay
    v.muted = true;
    v.defaultMuted = true;
    const tryPlay = async () => {
      try {
        await v.play();
      } catch (e) {
        // Autoplay may still be blocked; ignore silently
      }
    };
    if (v.readyState >= 2) {
      tryPlay();
    } else {
      const onLoaded = () => {
        tryPlay();
        v.removeEventListener("loadeddata", onLoaded);
      };
      v.addEventListener("loadeddata", onLoaded);
    }
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.loop = true;
    a.volume = 0.3;
    a.muted = true;
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const { body } = document;
    if (!body) return;

    if (showMusicPrompt) {
      scrollLockRef.current = window.scrollY || window.pageYOffset;
      body.style.position = "fixed";
      body.style.top = `-${scrollLockRef.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
    } else {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      if (scrollLockRef.current) {
        window.scrollTo({ top: scrollLockRef.current, behavior: "auto" });
        scrollLockRef.current = 0;
      }
    }

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      if (scrollLockRef.current) {
        window.scrollTo({ top: scrollLockRef.current, behavior: "auto" });
        scrollLockRef.current = 0;
      }
    };
  }, [showMusicPrompt]);

  const toggleMute = async () => {
    const a = audioRef.current;
    if (!a) return;

    if (isMuted) {
      setIsMuted(false);
      setShowMusicPrompt(false);
      a.muted = false;
      try {
        await a.play();
      } catch (e) {
        console.log("Audio play failed");
      }
    } else {
      setIsMuted(true);
      a.muted = true;
      a.pause();
    }
  };

  const startMusic = async () => {
    const a = audioRef.current;
    if (!a) return;

    setIsMuted(false);
    setShowMusicPrompt(false);
    a.muted = false;
    try {
      await a.play();
    } catch (e) {
      console.log("Audio play failed");
    }
  };

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addRSVP(name, phone, transportation === "yes");
      setIsSubmitted(true);
      setIsLoading(false);
      setName("");
      setPhone("");
      setTransportation("no");
    } catch (error) {
      console.error("RSVP 전송 실패:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="/images/tokyo87.mp3"
        preload="auto"
        muted={isMuted}
      />

      {/* Music Prompt */}
      {showMusicPrompt && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900/90 rounded-2xl p-8 max-w-sm text-center border border-gray-700 shadow-xl"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-white text-xl font-medium mb-2">음악과 함께 하실까요?</h3>
            <p className="text-gray-300 text-sm mb-6"></p>
            <div className="flex gap-3 justify-center">
              <motion.button
                onClick={startMusic}
                className="bg-hot-pink-600 hover:bg-hot-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎵 음악 켜기
              </motion.button>
              <motion.button
                onClick={() => setShowMusicPrompt(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                건너뛰기
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Mute Button */}
      <motion.button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-40 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showMusicPrompt ? 0 : 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {isMuted ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
      </motion.button>

      <div className="max-w-md mx-auto px-0">

        {/* Main Photo Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, margin: "-100px", amount: 0.2 }}
          className="mb-8"
        >
          <div className="w-full rounded-lg mb-4 overflow-hidden">
            <video
              ref={videoRef}
              src="/images/Our Wedding.mp4"
              poster="/images/Our Wedding.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              controls={false}
              className="w-full h-auto object-contain"
              title="희진 & 동률 결혼식"
            >
              <source src="/images/Our Wedding.mp4" type="video/mp4" />
              죄송합니다. 브라우저가 영상을 지원하지 않습니다.
            </video>
          </div>
        </motion.section>

        {/* Wedding Info Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px", amount: 0.3 }}
          className="text-center mb-8 bg-black rounded-lg py-6 shadow-lg"
        >
          <h2 className="text-xl font-medium text-hot-pink-500 mb-4">Our Wedding Day</h2>
          <div className="space-y-1 text-gray-200">
            <p className="text-medium font-light">2025년 11월 2일 일요일</p>
            <p className="text-medium font-light">오후 12시 | 서초 DITO</p>
          </div>
        </motion.section>

        {/* Greeting Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px", amount: 0.3 }}
          className="mt-8 mb-8"
        >
          <div className="w-full rounded-lg overflow-hidden">
            <img
              src="/images/greeting_edited.jpg"
              alt="인사말"
              className="w-full h-auto object-contain"
            />
          </div>
        </motion.section>



        {/* Ellie Letter Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px", amount: 0.2 }}
          className="mb-8"
        >
          <div className="w-full rounded-lg overflow-hidden">
            <img
              src="/images/ellieLetter.jpg"
              alt="엘리 편지"
              className="w-full h-auto object-contain"
            />
          </div>
        </motion.section>

        {/* Dr Letter Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px", amount: 0.2 }}
          className="mb-8"
        >
          <div className="w-full rounded-lg overflow-hidden">
            <img
              src="/images/drLetter.jpg"
              alt="동률 편지"
              className="w-full h-auto object-contain"
            />
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px", amount: 0.2 }}
        >
          <Gallery slides={slides} />
        </motion.div>

        {/* Contact Section */}
        {/* <section className="text-center mb-8 bg-gray-900/80 rounded-lg p-6 shadow-lg border border-gray-800">
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
        </section> */}

                {/* Wedding Info Section */}
                <motion.section
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  viewport={{ once: false, margin: "-50px", amount: 0.3 }}
                  className="text-center mb-8 bg-gray-900/80 rounded-lg py-6 shadow-lg border border-gray-800"
                >
          <h2 className="text-xl font-medium text-hot-pink-500 mb-4">Save The Date</h2>
          <div className="space-y-4 text-gray-200">
            <p className="text-lg font-light">25년 11월 2일 일요일 오후 12시</p>
            
            {/* Divider */}
            <div className="flex justify-center my-6">
              <div className="border-t border-gray-700 w-24"></div>
            </div>
            
            {/* Calendar */}
            <div className="mt-6">
              <div className="text-center mb-4">
                <p className="text-white font-medium">November 2025</p>
              </div>
              <div className="grid grid-cols-7 gap-2 max-w-xs mx-auto">
                  {/* Days of week */}
                  <div className="text-gray-400 text-center py-1 text-xs font-medium">SUN</div>
                  <div className="text-gray-400 text-center py-1 text-xs font-medium">MON</div>
                  <div className="text-gray-400 text-center py-1 text-xs font-medium">TUE</div>
                  <div className="text-gray-400 text-center py-1 text-xs font-medium">WED</div>
                  <div className="text-gray-400 text-center py-1 text-xs font-medium">THU</div>
                  <div className="text-gray-400 text-center py-1 text-xs font-medium">FRI</div>
                  <div className="text-gray-400 text-center py-1 text-xs font-medium">SAT</div>
                  
                  {/* Empty cells for start of month */}
                  <div></div><div></div><div></div><div></div><div></div><div></div>
                  
                  {/* November dates */}
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">1</div>
                  <div className="bg-hot-pink-500 text-white text-center py-2 w-8 h-8 flex items-center justify-center rounded-full font-bold">2</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">3</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">4</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">5</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">6</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">7</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">8</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">9</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">10</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">11</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">12</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">13</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">14</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">15</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">16</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">17</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">18</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">19</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">20</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">21</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">22</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">23</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">24</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">25</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">26</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">27</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">28</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">29</div>
                  <div className="text-white text-center py-2 w-8 h-8 flex items-center justify-center">30</div>
                </div>
              </div>
          </div>
        </motion.section>

        {/* Directions Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px", amount: 0.2 }}
          className="mb-8 bg-gray-900/80 rounded-lg p-6 shadow-lg border border-gray-800"
        >
          <h2 className="text-xl font-medium text-hot-pink-500 text-center mb-4">오시는 길</h2>
          
          <div className="mb-4">
            <p className="text-center text-white font-medium mb-2">DITO 레스토랑</p>
            <p className="text-center text-gray-300 text-sm mb-4">서울특별시 서초구 명달로 94</p>
            
            {/* Naver Map */}
            <div className="w-full h-64 mb-4 rounded-lg overflow-hidden">
              <MapSection address="서울특별시 서초구 명달로 94"/>
            </div>
            
            {/* Map Links */}
            <div className="flex justify-center gap-4">
              <a
                href="https://map.kakao.com/?urlX=500937.99999999907&urlY=1107307.9999999981&urlLevel=3&itemId=1706770960&q=%EB%94%94%ED%86%A0%20%EC%84%9C%EC%B4%88%EC%A0%90&srcid=1706770960&map_type=TYPE_MAP"
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
                    className="w-4 h-4 rounded"
                  />
                </span>
                네이버지도
              </a>
            </div>
            
            {/* Transportation Info */}
            <div className="mt-6 space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium text-sm mb-3 flex items-center">
                  🚇 대중교통 이용
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-hot-pink-400 text-xs font-medium mb-1">🚌 버스</p>
                    <p className="text-gray-300 text-sm">지하철 2호선 서초역 5번 출구에서 서초13 탑승 후 
                     <br/> 더미켈란아파트 정거장에서 하차</p>
                  </div>
                  <div>
                    <p className="text-hot-pink-400 text-xs font-medium mb-1">🚶 도보</p>
                    <p className="text-gray-300 text-sm">지하철 2호선 서초역 4번 출구에서 도보 10분</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium text-sm mb-2 flex items-center">
                  🚗 자차 이용
                </h3>
                <div className="space-y-1">
                  <p className="text-gray-300 text-sm">레스토랑 건물 지하 주차장 이용</p>
                  <p className="text-gray-300 text-xs text-gray-400">※ 주차 공간이 한정되어 있으니 가급적 대중교통 이용 부탁드립니다</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* RSVP Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px", amount: 0.3 }}
          className="bg-gray-900/80 rounded-lg p-6 shadow-lg border border-gray-800"
        >
          <h2 className="text-xl font-medium text-hot-pink-500 text-center mb-4">참석 의사 전달</h2>
          
          {isSubmitted ? (
            <div className="text-center p-4">
              <div className="text-hot-pink-500 text-lg mb-2">💖</div>
              <p className="text-hot-pink-400 font-medium">참석 의사가 전달되었습니다!</p>
              <p className="text-gray-300 text-sm mt-1">소중한 마음 감사드립니다.</p>
            </div>
          ) : (
            <>
          <div className="text-center mb-6 space-y-1">
            <p className="text-gray-300 text-sm">저희 결혼식은 <strong>스몰 웨딩 - 지정 좌석제</strong>로 진행됩니다</p>
            <p className="text-gray-300 text-sm">원활한 착석과 식사를 위해 참석 여부를 꼭 사전에 알려주세요</p>
            {/* <p className="text-gray-300 text-sm">소중한 시간 내어 함께해 주시는 모든 분들께</p>
            <p className="text-gray-300 text-sm">진심으로 감사드립니다.</p> */}
          </div>
            <form onSubmit={handleRSVP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  👤 성함
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-hot-pink-500 text-white placeholder-gray-400"
                  placeholder=""
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  📞 연락처
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-hot-pink-500 text-white placeholder-gray-400"
                  placeholder="01000000000"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🚗 자차 방문여부
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="transportation"
                      value="yes"
                      checked={transportation === "yes"}
                      onChange={(e) => setTransportation(e.target.value)}
                      className="accent-hot-pink-500 focus:ring-hot-pink-500 focus:ring-2"
                      disabled={isLoading}
                      required
                    />
                    <span className="ml-2 text-gray-300 text-sm">네</span>
                  </label>
                  
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="transportation"
                      value="no"
                      checked={transportation === "no"}
                      onChange={(e) => setTransportation(e.target.value)}
                      className="accent-hot-pink-500 focus:ring-hot-pink-500 focus:ring-2"
                      disabled={isLoading}
                      required
                    />
                    <span className="ml-2 text-gray-300 text-sm">아니오</span>
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-hot-pink-600 hover:bg-hot-pink-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    참석의사 전달하는 중...💌
                  </div>
                ) : (
                  "전달하기"
                )}
              </button>
            </form>
            </>
          )}
        </motion.section>

        {/* Footer */}
        <footer className="text-center mt-8 pb-8 text-gray-400 text-xs">
          <p>Designed by Ellie & Developed by Drk</p>
        </footer>

      </div>
    </div>
  )
}

export default App
