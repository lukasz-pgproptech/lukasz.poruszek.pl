import { gsap } from 'gsap';
import { isTouch, prefersReducedMotion } from './env';
import { playHover, playClick } from './audio';

export function initMagnetic(root: ParentNode = document) {
  if (isTouch() || prefersReducedMotion()) return;
  root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '0.35');
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
  });
}

let follower: HTMLElement | null = null;
let lastHoverTarget: Element | null = null;

export function initCursor() {
  if (typeof window === 'undefined' || follower || isTouch() || prefersReducedMotion()) return;
  follower = document.getElementById('cursor');
  if (!follower) return;

  const label = follower.querySelector<HTMLElement>('[data-cursor-label]');
  const x = gsap.quickTo(follower, 'x', { duration: 0.35, ease: 'power3.out' });
  const y = gsap.quickTo(follower, 'y', { duration: 0.35, ease: 'power3.out' });

  let prevX = 0;
  let prevY = 0;

  window.addEventListener(
    'pointermove',
    (e) => {
      x(e.clientX);
      y(e.clientY);

      // Velocity calculation for dynamic stretching
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      const speed = Math.hypot(dx, dy);
      prevX = e.clientX;
      prevY = e.clientY;

      if (speed > 2) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const stretchX = 1 + Math.min(speed * 0.008, 0.4);
        const stretchY = 1 / stretchX;
        gsap.to(follower, {
          rotation: angle,
          scaleX: stretchX,
          scaleY: stretchY,
          duration: 0.15,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        gsap.to(follower, {
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }

      // Check hover targets for cursor badge and haptic tick
      const target = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]');
      if (target !== lastHoverTarget) {
        lastHoverTarget = target;
        if (target) {
          playHover();
        }
      }

      const text = target?.dataset.cursor || '';
      follower!.classList.toggle('is-active', !!text);
      if (label && label.textContent !== text) label.textContent = text;
    },
    { passive: true }
  );

  window.addEventListener('pointerdown', (e) => {
    const clickable = (e.target as HTMLElement).closest('a, button');
    if (clickable) {
      playClick();
    }
  });

  document.addEventListener('pointerleave', () => follower!.classList.remove('is-active'));
  follower.classList.add('is-ready');
}
