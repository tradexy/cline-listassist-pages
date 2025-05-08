// share.js
// --------------
// NOTE FOR LATER
// Renders a shared list payload from the URL fragment.
// 
// AFFILIATE CONFIGURATION (future):
//   We’ll eventually pull these rules from a separate JSON or JS file.
//   Example shape:
//
//     window.AFFILIATES = [
//       { hostPattern: /\.ebay\./,      param: 'campid', value: '5339108180' },
//       { hostPattern: /\.amazon\./,    param: 'tag',    value: 'YourTag-21'    },
//       { hostPattern: /\.aliexpress\./, param: 'aff_fcid', value: '...'       },
//       // …etc.
//     ];
//
//   Then, in the render loop, we simply:
//
//     AFFILIATES.forEach(a => {
//       if (a.hostPattern.test(url.hostname)) {
//         url.searchParams.set(a.param, a.value);
//       }
//     });
//
// For now, we have a single hard-coded eBay rule below.
window.addEventListener('DOMContentLoaded', () => {
    const titleEl = document.getElementById('title');
    const listEl  = document.getElementById('list');
  
    // 1) Read and decode the fragment
    const fragment = decodeURIComponent(location.hash.slice(1));
    let payload;
    try {
      payload = JSON.parse(atob(fragment));
    } catch (e) {
      titleEl.textContent = 'Invalid or missing data';
      return;
    }
  
    // 2) Set title and render items
    titleEl.textContent = payload.name || 'Shared List';
    (payload.items || []).forEach(item => {
      const li = document.createElement('li');
      
      // Optional image
      if (item.image) {
        const img = document.createElement('img');
        img.src = item.image;
        li.appendChild(img);
      }
      
      // Name and link
      const a = document.createElement('a');
      if (item.url) {
        // Re-inject affiliate param for eBay links
        try {
          const url = new URL(item.url);
          // — AFFILIATE INJECTION — 
          // NOTE FOR LATER AFFILIATES - USE WITH A+NOTE AT TOP
          // Right now we only handle eBay, but this is where we’ll loop
          // through window.AFFILIATES when we support multiple programs.
          if (/\.ebay\./i.test(url.hostname)) {
            url.searchParams.set('campid', '5339108180');
          }
          a.href = url.toString();
        } catch {
          a.href = item.url;
        }
      } else {
        a.href = '#';
      }
      a.textContent = item.name;
      a.target = '_blank';
      li.appendChild(a);
  
      listEl.appendChild(li);
    });
  });
  