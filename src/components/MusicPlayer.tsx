import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Loader2, Pause, Play, Minimize2, Maximize2 } from './AnimatedIcons';
import { loadSpotifyEmbed, type SpotifyController } from '../lib/spotifyEmbed';

const playlist = 'https://open.spotify.com/playlist/1RSIm5lQoC00c7lCt58YcC';

export default function MusicPlayer() {
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const [minimized, setMinimized] = useState(false);
  const [preview, setPreview] = useState(false);
  const [showTracks, setShowTracks] = useState(false);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<SpotifyController | null>(null);
  const mounted = useRef(false);
  const pending = useRef(false);
  const readyTimer = useRef<number>();

  useEffect(() => {
    mounted.current = true;
    setSlot(document.getElementById('music-embed-slot'));
    return () => {
      mounted.current = false;
      window.clearTimeout(readyTimer.current);
      controller.current?.destroy();
      controller.current = null;
    };
  }, []);

  useEffect(() => {
    if (!requested || !host.current || controller.current) return;
    let cancelled = false;
    // Spotify defaults to lazy loading. An explicit play request must also load
    // the inline player while the visitor is elsewhere on the page.
    const eagerLoad = () => {
      const frame = host.current?.querySelector('iframe');
      if (frame) { frame.loading = 'eager'; observer.disconnect(); }
    };
    const observer = new MutationObserver(eagerLoad);
    observer.observe(host.current, { childList: true, subtree: true });
    const fail = () => {
      if (cancelled || !mounted.current) return;
      controller.current?.destroy();
      controller.current = null;
      pending.current = false;
      setLoading(false);
      setRequested(false);
      setError('Spotify could not load. Try again or open the playlist in Spotify.');
    };
    void loadSpotifyEmbed().then(api => {
      if (cancelled || !host.current) return;
      const placeholder = document.createElement('div');
      host.current.replaceChildren(placeholder);
      readyTimer.current = window.setTimeout(fail, 15000);
      api.createController(placeholder, { url: `${playlist}?theme=0`, width: '100%', height: 152 }, embed => {
        if (cancelled) { embed.destroy(); return; }
        controller.current = embed;
        eagerLoad();
        embed.addListener('ready', () => {
          if (cancelled) return;
          window.clearTimeout(readyTimer.current);
          pending.current = false;
          setLoading(false);
          embed.play();
        });
        embed.addListener('playback_update', event => {
          if (!cancelled) {
            setPlaying(!event.data.isPaused);
            if (event.data.duration) setPreview(event.data.duration <= 31000);
          }
        });
      });
    }).catch(fail);
    return () => { cancelled = true; observer.disconnect(); window.clearTimeout(readyTimer.current); };
  }, [requested, slot]);

  const toggle = () => {
    if (pending.current) return;
    if (controller.current) {
      if (playing) controller.current.pause();
      else controller.current.resume();
      return;
    }
    pending.current = true;
    setError('');
    setLoading(true);
    setRequested(true);
  };

  const label = loading ? 'Loading Spotify playlist' : playing ? 'Pause music' : 'Play music on Spotify';
  return <>
    <div className="music-controls">
    <button type="button" className={`dock-icon music-trigger ${playing ? 'is-playing' : ''}`} onClick={toggle} aria-label={label} title={label} aria-pressed={playing} aria-busy={loading} disabled={loading}>
      {loading ? <Loader2 size={19} className="loading-spinner" /> : playing ? <Pause size={19} /> : <Play size={19} />}
    </button>
    {requested && <button type="button" className="dock-icon music-minimize" onClick={() => setMinimized(value => !value)} aria-label={minimized ? 'Expand Spotify player' : 'Minimize Spotify player'} aria-expanded={!minimized} aria-controls="spotify-player"><span className="music-track-label">On repeat · Spotify</span>{minimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}</button>}
    </div>
    <span className="sr-only" role="status">{error || (loading ? 'Loading music from Spotify.' : playing ? 'Music is playing.' : '')}</span>
    {error && <a className="music-error" href={playlist} target="_blank" rel="noopener noreferrer">Open in Spotify <ArrowUpRight size={15} /></a>}
    {slot && requested && createPortal(<section id="spotify-player" className={`top-bar-music ${minimized ? 'is-minimized' : ''}`} aria-label="Spotify music player" aria-hidden={minimized} {...(minimized ? { inert: '' } : {})}>
      <div ref={host} id="music-playlist-embed" className={`music-embed-host ${showTracks ? 'show-tracks' : ''}`} />
      <div className="music-playlist-actions"><button type="button" onClick={() => setShowTracks(value => !value)} aria-expanded={showTracks} aria-controls="music-playlist-embed">{showTracks ? 'Hide tracks' : 'Show tracks'}</button><a href={playlist} target="_blank" rel="noopener noreferrer">Open in Spotify</a></div>
      {preview && <p className="music-preview-notice">Spotify preview · Open in Spotify for full playback.</p>}
    </section>, slot)}
  </>;
}
