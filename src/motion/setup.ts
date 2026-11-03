import { gsap } from 'gsap';
import { setLoaderFormat, setLoaderExit, ease } from '../engine';

export function setupMotion() {
  setLoaderFormat((p: number) => {
    return `${String(Math.round(p)).padStart(3, '0')}%`;
  });

  setLoaderExit((root: HTMLElement) => {
    const tl = gsap.timeline();
    tl.to(root.querySelectorAll('[data-loader-out]'), {
      yPercent: -100,
      opacity: 0,
      duration: 0.6,
      ease: ease.inOut,
      stagger: 0.04,
    })
    .to(root, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.8,
      ease: ease.inOut,
    }, '-=0.3');
    return tl;
  });
}

