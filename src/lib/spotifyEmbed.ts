export type SpotifyPlayback = { data: { isPaused: boolean; isBuffering: boolean; duration?: number; position?: number } };
export type SpotifyController = {
  play: () => void;
  pause: () => void;
  resume: () => void;
  destroy: () => void;
  addListener: (event: string, callback: (event: SpotifyPlayback) => void) => void;
};
type SpotifyAPI = {
  createController: (element: HTMLElement, options: { url: string; width: string; height: number }, callback: (controller: SpotifyController) => void) => void;
};
declare global {
  interface Window { onSpotifyIframeApiReady?: (api: SpotifyAPI) => void }
}

let apiPromise: Promise<SpotifyAPI> | null = null;

// Called from the play action only; browsing the portfolio never loads Spotify.
export function loadSpotifyEmbed() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<SpotifyAPI>((resolve, reject) => {
    const script = document.createElement('script');
    const timeout = window.setTimeout(fail, 15000);
    function fail() {
      window.clearTimeout(timeout);
      script.remove();
      apiPromise = null;
      reject(new Error('Spotify could not load. Please try again.'));
    }
    window.onSpotifyIframeApiReady = api => {
      window.clearTimeout(timeout);
      resolve(api);
    };
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    script.onerror = fail;
    document.body.append(script);
  });
  return apiPromise;
}
