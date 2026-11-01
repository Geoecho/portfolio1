export function setScrollIndicator(indicator: HTMLElement | null, index: number, label: string) {
  if (!indicator) return;
  indicator.setAttribute('aria-valuenow', String(index + 1));
  indicator.setAttribute('aria-valuetext', label);
  Array.from(indicator.children).forEach((segment, i) => { (segment as HTMLElement).dataset.active = String(i === index); });
}

export default function ScrollIndicator({ labels, label, className = '' }: { labels: string[]; label: string; className?: string }) {
  return <div className={`scroll-indicator ${className}`} role="progressbar" aria-label={label} aria-valuemin={1} aria-valuemax={labels.length} aria-valuenow={1} aria-valuetext={labels[0]}>
    {labels.map((name, index) => <span key={name} data-active={index === 0} />)}
  </div>;
}
