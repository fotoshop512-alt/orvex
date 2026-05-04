import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../services/storage';
import { PODCAST_EPISODES, PodcastEpisode, TranscriptSegment } from '../data/podcastData';
import { playSound } from '../utils/sound';
import PaymentModal from './PaymentModal';

// YouTube IFrame API types
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

interface PodcastZoneProps {
    currentUser: UserProfile | null;
    onFullscreenChange?: (isFullscreen: boolean) => void;
}

const PodcastZone: React.FC<PodcastZoneProps> = ({ currentUser, onFullscreenChange }) => {
    const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
    const [playerReady, setPlayerReady] = useState(false);
    const transcriptRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const timeUpdateInterval = useRef<NodeJS.Timeout | null>(null);

    const isPro = currentUser?.isPro || currentUser?.role === 'ADMIN';

    // Load YouTube IFrame API
    useEffect(() => {
        if (window.YT) return;

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }, []);

    // Initialize YouTube player when episode is selected
    useEffect(() => {
        if (!selectedEpisode || !playerContainerRef.current) return;

        const initPlayer = () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }

            playerRef.current = new window.YT.Player('youtube-player', {
                height: '100%',
                width: '100%',
                videoId: selectedEpisode.youtubeId,
                playerVars: {
                    rel: 0,
                    modestbranding: 1,
                    controls: 0, // Kendi kontrollerimizi kullanacağız
                    showinfo: 0,
                    iv_load_policy: 3,
                    playsinline: 1,
                    disablekb: 1,
                    fs: 0,
                },
                events: {
                    onReady: () => {
                        setPlayerReady(true);
                        // Video süresini al
                        if (playerRef.current && playerRef.current.getDuration) {
                            setDuration(playerRef.current.getDuration());
                        }
                    },
                    onStateChange: (event: any) => {
                        // YT.PlayerState: PLAYING = 1, PAUSED = 2, ENDED = 0
                        if (event.data === 1) {
                            setIsPlaying(true);
                            startTimeTracking();
                        } else {
                            setIsPlaying(false);
                            stopTimeTracking();
                        }
                    },
                },
            });
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            stopTimeTracking();
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [selectedEpisode]);

    // Start tracking video time
    const startTimeTracking = () => {
        if (timeUpdateInterval.current) return;

        timeUpdateInterval.current = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                const time = playerRef.current.getCurrentTime();
                setCurrentTime(time);
            }
        }, 250); // Update 4 times per second for smooth sync
    };

    // Stop tracking
    const stopTimeTracking = () => {
        if (timeUpdateInterval.current) {
            clearInterval(timeUpdateInterval.current);
            timeUpdateInterval.current = null;
        }
    };

    // Seek to specific time
    const handleSeek = (time: number) => {
        if (playerRef.current && playerRef.current.seekTo) {
            playerRef.current.seekTo(time, true);
            setCurrentTime(time);
        }
    };

    // Update active segment based on current time
    useEffect(() => {
        if (!selectedEpisode?.transcript) return;

        const newIndex = selectedEpisode.transcript.findIndex(
            (seg, idx) => {
                const nextSeg = selectedEpisode.transcript?.[idx + 1];
                return currentTime >= seg.start && (!nextSeg || currentTime < nextSeg.start);
            }
        );

        if (newIndex !== -1 && newIndex !== activeSegmentIndex) {
            setActiveSegmentIndex(newIndex);

            // Auto-scroll to active segment
            const element = document.getElementById(`segment-${newIndex}`);
            if (element && transcriptRef.current) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentTime, selectedEpisode, activeSegmentIndex]);

    const handleEpisodeClick = (episode: PodcastEpisode, index: number) => {
        // Pro kontrolü - ilk video ücretsiz
        if (episode.isPro && !isPro && index > 0) {
            setShowPaymentModal(true);
            playSound('click');
            return;
        }

        playSound('click');
        setSelectedEpisode(episode);
        setCurrentTime(0);
        setActiveSegmentIndex(0);
        setIsPlaying(false);
        setPlayerReady(false);
        if (onFullscreenChange) {
            onFullscreenChange(true);
        }
    };

    const handleBack = () => {
        playSound('click');
        stopTimeTracking();
        setSelectedEpisode(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setPlayerReady(false);
        if (onFullscreenChange) {
            onFullscreenChange(false);
        }
    };

    const handleSegmentClick = (segment: TranscriptSegment, index: number) => {
        if (playerRef.current && playerRef.current.seekTo) {
            playerRef.current.seekTo(segment.start, true);
            setCurrentTime(segment.start);
            setActiveSegmentIndex(index);
        }
        playSound('click');
    };

    const togglePlayPause = () => {
        if (!playerRef.current) return;

        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
        playSound('click');
    };

    const highlightVocabulary = (text: string, highlights?: string[]) => {
        if (!highlights || highlights.length === 0) return text;

        let result = text;
        highlights.forEach(word => {
            const regex = new RegExp(`\\b(${word})\\b`, 'gi');
            result = result.replace(regex, `<span class="text-emerald-400 font-semibold">$1</span>`);
        });
        return result;
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Video Player View
    if (selectedEpisode) {
        return (
            <div className="fixed inset-0 z-[99999] bg-[#0a0a0f] flex flex-col">
                {/* Custom Header - App Style */}
                <div className="bg-gradient-to-b from-[#1a1b2e] to-transparent px-4 py-3 pt-safe flex items-center gap-3 z-10">
                    <button
                        onClick={handleBack}
                        className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <i className="ri-arrow-left-s-line text-xl text-white" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-white font-bold text-sm truncate">{selectedEpisode.title}</h1>
                        <p className="text-white/50 text-xs">BBC Learning English</p>
                    </div>
                </div>

                {/* Video Container with Custom Controls */}
                <div className="relative bg-black">
                    <div className="aspect-video w-full" ref={playerContainerRef}>
                        <div id="youtube-player" />
                    </div>

                    {/* Custom Video Overlay Controls */}
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        onClick={togglePlayPause}
                    >
                        {/* Center Play/Pause Button - only show when paused or loading */}
                        {(!isPlaying || !playerReady) && (
                            <div className={`
                                w-20 h-20 rounded-full flex items-center justify-center transition-all
                                ${playerReady
                                    ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:scale-110 cursor-pointer'
                                    : 'bg-white/10'}
                            `}>
                                {playerReady ? (
                                    <i className="ri-play-fill text-4xl text-white ml-1" />
                                ) : (
                                    <i className="ri-loader-4-line text-3xl text-white/50 animate-spin" />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bottom gradient for smooth transition */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#12121a] to-transparent pointer-events-none" />
                </div>

                {/* Custom Seek Bar */}
                <div className="bg-[#12121a] px-4 py-3">
                    <div className="flex items-center gap-3">
                        {/* Play/Pause Button */}
                        <button
                            onClick={togglePlayPause}
                            disabled={!playerReady}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-rose-500/20 border border-rose-500/30"
                        >
                            <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-rose-400 text-lg`} />
                        </button>

                        {/* Current Time */}
                        <span className="text-white/60 text-xs font-mono w-10">
                            {formatTime(currentTime)}
                        </span>

                        {/* Progress Bar */}
                        <div className="flex-1 relative h-8 flex items-center">
                            <input
                                type="range"
                                min={0}
                                max={duration || 100}
                                value={currentTime}
                                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                                    [&::-webkit-slider-thumb]:appearance-none
                                    [&::-webkit-slider-thumb]:w-4
                                    [&::-webkit-slider-thumb]:h-4
                                    [&::-webkit-slider-thumb]:rounded-full
                                    [&::-webkit-slider-thumb]:bg-rose-500
                                    [&::-webkit-slider-thumb]:shadow-lg
                                    [&::-webkit-slider-thumb]:shadow-rose-500/50
                                "
                                style={{
                                    background: `linear-gradient(to right, rgb(244 63 94) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%)`
                                }}
                            />
                        </div>

                        {/* Duration */}
                        <span className="text-white/40 text-xs font-mono w-10 text-right">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* Vocabulary Highlights Bar */}
                {selectedEpisode.vocabularyHighlights && (
                    <div className="bg-[#12121a] border-y border-white/5 px-4 py-2">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            <span className="text-white/40 text-xs shrink-0">📚 Kelimeler:</span>
                            {selectedEpisode.vocabularyHighlights.slice(0, 6).map((word, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium whitespace-nowrap"
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transcript with Sync */}
                <div
                    ref={transcriptRef}
                    className="flex-1 overflow-y-auto bg-gradient-to-b from-[#12121a] to-[#0a0a0f] px-4 py-4 pb-safe"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <i className="ri-file-text-line text-rose-400" />
                        <span className="text-white font-semibold text-sm">Transkript</span>
                    </div>

                    <div className="space-y-2">
                        {selectedEpisode.transcript?.map((segment, index) => (
                            <button
                                key={index}
                                id={`segment-${index}`}
                                onClick={() => handleSegmentClick(segment, index)}
                                className={`
                                    w-full text-left p-3 rounded-xl transition-all duration-300
                                    ${index === activeSegmentIndex
                                        ? 'bg-rose-500/20 border-l-4 border-rose-500 scale-[1.02]'
                                        : 'bg-white/5 border-l-4 border-transparent hover:bg-white/10'
                                    }
                                `}
                            >
                                <div className="flex items-start gap-3">
                                    <span className={`
                                        text-xs font-mono mt-0.5 shrink-0
                                        ${index === activeSegmentIndex ? 'text-rose-400' : 'text-white/30'}
                                    `}>
                                        {formatTime(segment.start)}
                                    </span>
                                    <p
                                        className={`
                                            text-sm leading-relaxed
                                            ${index === activeSegmentIndex ? 'text-white' : 'text-white/60'}
                                        `}
                                        dangerouslySetInnerHTML={{
                                            __html: highlightVocabulary(segment.text, selectedEpisode.vocabularyHighlights)
                                        }}
                                    />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* End spacer */}
                    <div className="h-20" />
                </div>
            </div>
        );
    }

    // Episode List View
    return (
        <div className="h-full overflow-y-auto pb-32">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0f0d1e] via-[#0f0d1e] to-transparent pb-4 pt-4 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                        <i className="ri-podcast-line text-2xl text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Podcast</h1>
                        <p className="text-white/50 text-sm">İngilizce dinleme videoları</p>
                    </div>
                </div>
            </div>

            {/* Episodes List */}
            <div className="px-4 space-y-3">
                {PODCAST_EPISODES.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <i className="ri-podcast-line text-4xl text-white/20" />
                        </div>
                        <h3 className="text-white/60 font-medium mb-1">Henüz video yok</h3>
                        <p className="text-white/40 text-sm">Yakında yeni içerikler eklenecek</p>
                    </div>
                ) : (
                    PODCAST_EPISODES.map((episode, index) => {
                        const isLocked = episode.isPro && !isPro && index > 0;

                        return (
                            <button
                                key={episode.id}
                                onClick={() => handleEpisodeClick(episode, index)}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl overflow-hidden transition-all group text-left"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full aspect-video bg-black/50">
                                    <img
                                        src={episode.thumbnail || `https://img.youtube.com/vi/${episode.youtubeId}/hqdefault.jpg`}
                                        alt={episode.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                            <i className="ri-play-fill text-3xl text-white ml-1" />
                                        </div>
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded-lg text-xs text-white font-medium">
                                        {episode.duration}
                                    </div>

                                    {/* Lock Overlay */}
                                    {isLocked && (
                                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/50">
                                                    <i className="ri-lock-2-fill text-xl text-amber-400" />
                                                </div>
                                                <span className="text-amber-400 text-xs font-medium">PRO</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="text-white font-bold text-base mb-1 group-hover:text-rose-300 transition-colors">
                                        {episode.title}
                                    </h3>
                                    <p className="text-white/50 text-sm line-clamp-2">
                                        {episode.description}
                                    </p>

                                    {/* Vocabulary Preview */}
                                    {episode.vocabularyHighlights && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {episode.vocabularyHighlights.slice(0, 3).map((word, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-medium"
                                                >
                                                    {word}
                                                </span>
                                            ))}
                                            {episode.vocabularyHighlights.length > 3 && (
                                                <span className="text-white/30 text-[10px] self-center">
                                                    +{episode.vocabularyHighlights.length - 3} kelime
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })
                )}
            </div>

            {showPaymentModal && (
                <PaymentModal
                    user={currentUser}
                    onClose={() => setShowPaymentModal(false)}
                    onPurchaseSuccess={() => setShowPaymentModal(false)}
                />
            )}
        </div>
    );
};

export default PodcastZone;
