import { gsap } from 'gsap';
import { setLoaderFormat, setLoaderExit, ease, setBackground } from '../engine';
import { fluidBackgroundFragment } from '../engine/gl/shaders';

export function setupMotion() {
  setLoaderFormat((p: number) => {
    return `${String(Math.round(p)).padStart(3, '0')}%`;
  });

  setLoaderExit((root: HTMLElement) => {
    const tl = gsap.timeline();
    tl.to(root.querySelectorAll('[data-loader-out]'), {
      yPercent: -100,
      opacity: 0,
      duration: 0.35,
      ease: ease.inOut,
      stagger: 0.03,
    })
    .to(root, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.45,
      ease: ease.inOut,
    }, '-=0.15');
    return tl;
  });

  // Living organic fluid matter & interactive cursor light background
  setBackground(fluidBackgroundFragment);
}

