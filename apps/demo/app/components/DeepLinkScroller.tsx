'use client';

import { useEffect } from 'react';

export function DeepLinkScroller({ id }: { id: string }): null {
  useEffect(() => {
    const el = document.querySelector(`[data-testimonial-id="${id}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [id]);

  return null;
}