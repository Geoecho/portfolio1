import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Loader2, Pause, Play } from './AnimatedIcons';
import { loadSpotifyEmbed, type SpotifyController } from '../lib/spotifyEmbed';

const track = 'https://open.spotify.com/track/2t5GyUfFoZg3E8ak3i7dVP';

export default function MusicPlayer() {
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
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
      setError('Spotify could not load. Try again or open the track in Spotify.');
    };
    void loadSpotifyEmbed().then(api => {
      if (cancelled || !host.current) return;
      const placeholder = document.createElement('div');
      host.current.replaceChildren(placeholder);
      readyTimer.current = window.setTimeout(fail, 15000);
      api.createController(placeholder, { url: `${track}?theme=0`, width: '100%', height: 80 }, embed => {
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
          if (!cancelled) setPlaying(!event.data.isPaused);
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

  const label = loading ? 'Loading Spotify player' : playing ? 'Pause Maggot Brain' : 'Play Maggot Brain on Spotify';
  return <>
    <button type="button" className={`dock-icon music-trigger ${playing ? 'is-playing' : ''}`} onClick={toggle} aria-label={label} title={label} aria-pressed={playing} aria-busy={loading} disabled={loading}>
      {loading ? <Loader2 size={19} className="loading-spinner" /> : playing ? <Pause size={19} /> : <Play size={19} />}
    </button>
    <span className="sr-only" role="status">{error || (loading ? 'Loading Maggot Brain from Spotify.' : playing ? 'Maggot Brain is playing.' : '')}</span>
    {error && <a className="music-error" href={track} target="_blank" rel="noopener noreferrer">Open in Spotify <ArrowUpRight size={15} /></a>}
    {slot && requested && createPortal(<section className="top-bar-music" aria-label="Spotify music player">
      <div ref={host} className="music-embed-host" />
    </section>, slot)}
  </>;
}
