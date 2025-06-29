import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

import './style.css';

Fancybox.bind('[data-fancybox="gallery"]', {
  //
});


zoomOutMobile = () => {
  const viewport = document.querySelector('meta[name="viewport"]');

  if ( viewport ) {
    viewport.content = 'initial-scale=1';
    viewport.content = 'width=device-width';
  }
}